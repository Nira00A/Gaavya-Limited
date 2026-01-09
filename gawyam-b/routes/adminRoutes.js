const {isAdmin , verifyAdmin} = require("../middleware/adminAuth");
const pool = require('../config/postgreSqlClient');
const redis = require('../config/redisClient');
const nodemailer = require('nodemailer')
const { publicIpv6, publicIpv4 } = require('public-ip')
const express = require('express');
require('dotenv').config();
const router = express.Router()
const { encryptedCode , decryptedCode } = require('../utils/adminAuth');
const { verifyPassword } = require("../utils/auth");
const jwt = require('jsonwebtoken')

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  },
});

const JWTSecret = process.env.JWT_SECRET_ADMIN;

router.get('/auth/check' , async (req , res) => {
    const token = req.cookies.admin_token;

    try {
        if (!token) {
            return res.json({ success: false, isAuthenticated: false });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET_ADMIN);

        const redisCache = await redis.get(`admin:${decode.id}`)

        if(redisCache){
            return res.status(200).json({
                success: true,
                isAuthenticated: true,
                admin : JSON.parse(redisCache)
            })
        }

        const result = await pool.query('SELECT * FROM admins WHERE id = $1', [decode.id]);

        if (result.rows.length === 0) throw new Error("No admin");

        const admin = result.rows[0];

        await redis.set(`admin:${decode.id}` , JSON.stringify({
                id: admin.id,
                admin_role: admin.role
            }) , 'EX' , '3600')

        return res.status(200).json({ 
            success: true, 
            isAuthenticated: true, 
            admin: { id: admin.id, admin_role: admin.role } 
        });
    } catch (error) {
        return res.status(500).json({ success: false, isAuthenticated: false });
    }
})

router.post('/login' , async (req , res) => {
     const { admin_email, admin_password } = req.body;

    try {
        if (!admin_email || !admin_password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required.'
            });
        }

        const adminResult = await pool.query(
            'SELECT * FROM admins WHERE email = $1',
            [admin_email]
        );

        if (adminResult.rows.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Admin does not exist. Please register instead.'
            });
        }

        const admin = adminResult.rows[0]

        const match = await verifyPassword(admin_password, admin.password_hash);

        const ip = req.socket.remoteAddress || '127.0.0.1';

        if (!match) {
            await pool.query(
                'INSERT INTO admin_login_logs (admin_id, ip_address, status) VALUES ($1, $2, $3)',
                [admin.id, ip, 'FAILED'] 
            );

            return res.status(401).json({
                success: false,
                error: 'Invalid email or password.'
            });
        }

        const token = jwt.sign(
            { id: admin.id, admin_role: admin.role },
            JWTSecret,
            { expiresIn: '7d' }
        );

        res.cookie('admin_token' , token , {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        await pool.query('INSERT INTO admin_login_logs (admin_id , ip_address) VALUES ($1 , $2)' , [admin.id , ip])
    
        await redis.set(`admin:${admin.id}` , JSON.stringify({
            id: admin.id,
            admin_role: admin.role
        }) , 'EX' , 3600)

        return res.json({
            success: true,
            text: 'Successfully registered',
            token,
            admin: {
                id: admin.id,
                admin_role: admin.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
})

/* Dont use
router.post('/register' , async (req , res) => {
    const { admin_email, admin_password } = req.body;
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    try {
        const passEncrypted = await encryptedCode(admin_password)
        const verifyEncrypted = await encryptedCode(verificationCode.toString())

        const info = await transporter.sendMail({
            from: '"Gaavya" <gawyamlimited@gmail.com>',
            to: admin_email,
            subject: "OTP for Verifying your Email in Gaavya",
            text: `Your OTP is: ${verificationCode}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #228be6;">Welcome to Gaavya!</h2>
                <p>Thank you for registering on our platform.</p>

                <p>Please use the One-Time Password (OTP) below to verify your email address:</p>

                <div style="margin: 20px 0; padding: 15px; background-color: #f4f4f4; border-left: 5px solid #228be6;">
                    <h1 style="font-size: 32px; text-align: center; margin: 0; color: #000;">${verificationCode}</h1>
                </div>

                <p>This code is valid for the next <strong>10 minutes</strong>. Do not share it with anyone.</p>

                <p>If you didn't request this, please ignore this email.</p>

                <br />
                <p>Best regards,<br/><b>The Gaavya Team</b></p>
                </div>
            `
        });

        await redis.set(`otp:${admin_email}` , JSON.stringify({email : admin_email , password : passEncrypted , code : verifyEncrypted}) , 'EX' , 600)

        res.status(201).json({
            success: true,
            text :  'Code sent to the email',
            info: info
        })
    } catch (error) {
        res.status(500).json({success: false , error: 'Server Error' + error})
    }
})

router.post('/verify/email' , async (req , res) => {
    const { admin_email , verificationCode} = req.body

    try {
        const redisCache = await redis.get(`otp:${admin_email}`)

        if (!redisCache){
            return res.status(200).json({success: false , error : 'Try again , the code expired.'})
        }

        const data = JSON.parse(redisCache)

        const compare = await decryptedCode(verificationCode , data.code)

        if (!compare){
            return res.status(400).json({
                success : false,
                text : 'Invalid code given.'
            })
        }

        const role = 'manager'
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

        const result = await pool.query('INSERT INTO admins (email , password_hash , role ) VALUES ($1 , $2 , $3) RETURNING id' , [data.email , data.password , role])

        const admin = result.rows[0]

        const token = jwt.sign(
            { id: admin.id, admin_role: role},
            JWTSecret,
            { expiresIn: '7d' }
        );

        res.cookie('admin_token' , token , {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        await pool.query('INSERT INTO admin_login_logs (admin_id , ip_address) VALUES ($1 , $2)' , [admin.id , ip])

        await redis.set(`admin:${admin.id}` , JSON.stringify({
            id: admin.id,
            admin_role: role
        }) , 'EX' , 3600)

        await redis.del(`otp:${admin_email}`)

        return res.json({
            success: true,
            text: 'Successfully registered',
            token,
            admin: {
                id: admin.id,
                admin_role: role
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
})
*/

router.post('/logout', verifyAdmin ,async (req, res) => {
    try {
    res.clearCookie("admin_token");
    await redis.del(`admin:${req.adminId}`)
    return res.status(200).json({success: true , message: "Logged out" });
  } catch (error) {
    console.log("Error in logging out", error);
    return res.status(500).json({success: false , message: "Logout failed" });
  }
});

router.get('/dashboard-stats', verifyAdmin, async (req, res) => {
    try {
        // Total Revenue (Assuming you have an 'orders' table with 'total_amount')
        const revenueQuery = await pool.query(
            "SELECT COALESCE(SUM(total_amount), 0) as total FROM user_orders WHERE payment_status = 'paid'"
        );
        
        // Active Users
        const userQuery = await pool.query("SELECT COUNT(*) FROM users");

        // Orders Count (Pending vs Delivered)
        const pendingOrders = await pool.query("SELECT COUNT(*) FROM user_orders WHERE status = 'pending'");
        const deliveredOrders = await pool.query("SELECT COUNT(*) FROM user_orders WHERE status = 'delivered'");

        // Low Stock Alerts
        const lowStockQuery = await pool.query("SELECT COUNT(*) FROM products WHERE stock_quantity < 10");

        // Recent Activity (Latest 5 )
        const recentActivity = await pool.query(
            "SELECT id, user_id, total_amount, created_at FROM user_orders ORDER BY created_at DESC LIMIT 5"
        );

        res.json({
            success: true,
            stats: {
                revenue: revenueQuery.rows[0].total,
                users: userQuery.rows[0].count,
                pending_orders: pendingOrders.rows[0].count,
                delivered_orders: deliveredOrders.rows[0].count,
                low_stock: lowStockQuery.rows[0].count
            },
            recent_activity: recentActivity.rows
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ success: false, error: "Server Error" });
    }
});

// Get All Categories
router.get('/categories', verifyAdmin , async (req, res) => {
    try {
        const cachedData = await redis.get('categories:all');
        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        const result = await pool.query("SELECT * FROM categories ORDER BY id ASC");


        if (result.rows.length > 0) {
            await redis.set(
                'categories:all', 
                JSON.stringify(result.rows), 
                'EX' , 3600
            );
        }

        res.json(result.rows);
    } catch (err) {
        console.error("Get Categories Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

// Add New Category
router.post('/categories', verifyAdmin , async (req, res) => {
    try {
        const { name, icon , is_active} = req.body;
        
        if (!name || !icon) {
            return res.status(400).json({ error: "Name and Icon are required" });
        }

        const result = await pool.query(
            "INSERT INTO categories (name, icon , is_active) VALUES ($1, $2 , $3) RETURNING *",
            [name, icon , is_active]
        );

        await redis.del('categories:all');

        res.json({ success: true, text: 'Category added' , category: result.rows[0] });

    } catch (err) {
        if (err.code === '23505') return res.status(400).json({ error: "Category already exists" });
        console.error("Add Category Error:", err);
        res.status(500).json({success: false , error: "Server Error" });
    }
});

// Edit New Category
router.put('/categories/:id' , verifyAdmin , async (req , res) => {
    try {
        const { id } = req.params
        const { name, icon , is_active} = req.body;

        if (!name || !icon) {
            return res.status(400).json({ error: "Name and Icon are required" });
        }

        const result = await pool.query('UPDATE categories SET name = COALESCE($1 , name) , icon = COALESCE($2 , icon) , is_active = COALESCE($3 , true) WHERE id = $4 RETURNING *', [name , icon , is_active , id])
    
        await redis.del('categories:all');

        res.json({ success: true, text: 'Category updated' , category: result.rows[0] });
    } catch (error) {
        if (err.code === '23505') return res.status(400).json({ error: "Category already updated" });
        console.error("Edit Category Error:", err);
        res.status(500).json({success: false , error: "Server Error" });
    }
})

// Delete Category
router.delete('/categories/:id', verifyAdmin , async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM categories WHERE id = $1", [id]);

        await redis.del('categories:all');

        res.json({ success: true });
    } catch (err) {
        console.error("Delete Category Error:", err);
        res.status(500).json({success: false , error: "Server Error" });
    }
});

module.exports = router
