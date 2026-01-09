const jwt = require('jsonwebtoken');
require('dotenv').config();
const geolib = require('geolib');
const pool = require('../config/postgreSqlClient');
const redis = require('../config/redisClient');
const { verifyPassword , hashPassword , expiresInSevenDays} = require('../utils/auth');
const express = require('express')

const verifyUser = require('../middleware/auth');


const router = express.Router()

const gaavyaDeliveryZone = [
    { latitude: 25.440933856536446, longitude: 81.88337830684264 },
    { latitude: 25.456548960796468, longitude: 81.88567697779143 },
    { latitude: 25.46656383410817, longitude: 81.8763494679792 },
    { latitude: 25.480111886615944, longitude: 81.88287417110797 },
    { latitude: 25.502937875782962, longitude: 81.8734211521737 },
    { latitude: 25.505440513939448, longitude: 81.85661787482996 },
    { latitude: 25.494103551454145, longitude: 81.84405767759858 },
    { latitude: 25.481288614846022, longitude: 81.8443747916561 },
    { latitude: 25.47587423277797, longitude: 81.83515287333643 },
    { latitude: 25.480504178202565, longitude: 81.82555506523823 },
    { latitude: 25.47063573022463, longitude: 81.79635525460009 },
    { latitude: 25.464597752608626, longitude: 81.7774361845668 },
    { latitude: 25.462093679523363, longitude: 81.75428132434831 },
    { latitude: 25.44972722485535, longitude: 81.74173975381439 },
    { latitude: 25.439275140163332, longitude: 81.73994519824276 },
    { latitude: 25.43301546461788, longitude: 81.75115156347067 },
    { latitude: 25.420645359093868, longitude: 81.7661493257047 },
    { latitude: 25.419748953132924, longitude: 81.79598849486587 },
    { latitude: 25.39897721318502, longitude: 81.80137060216703 },
    { latitude: 25.41840958252243, longitude: 81.82454249491508 },
    { latitude: 25.42784906339068, longitude: 81.85176942209733 },
    { latitude: 25.435658875776525, longitude: 81.86562241720515 },
    { latitude: 25.43049452874314, longitude: 81.86891214809128 },
    { latitude: 25.427546303931322, longitude: 81.88278359824221 },
    { latitude: 25.440933856536446, longitude: 81.88337830684264 }
];

const JWTSecret = process.env.JWT_SECRET;

// Auth Logics 
router.get('/auth/check' , async (req , res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.json({ success: false, isAuthenticated: false });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        
        const redisCache = await redis.get(`user:${decode.id}`)

        if(redisCache){
            return res.status(200).json({
                success: true,
                isAuthenticated: true,
                user : JSON.parse(redisCache)
            })
        }

        const result = await pool.query('SELECT id, name, email , phoneno , role FROM users WHERE id = $1', [decode.id]);
        if (result.rows.length === 0) throw new Error("No user");

        const user = result.rows[0];

        await redis.set(`user:${decode.id}` , JSON.stringify({
                id: user.id,
                user_role: user.role
            }) , 'EX' , '3600')

        return res.status(200).json({ 
            success: true, 
            isAuthenticated: true, 
            user: { id: user.id, user_role: user.role } 
        });
    } catch (error) {
        return res.status(500).json({ success: false, isAuthenticated: false });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { user_email, user_password } = req.body;

        // Validate input
        if (!user_email || !user_password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required.'
            });
        }

        const userResult = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [user_email]
        );

        // Check if user exists
        if (userResult.rows.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'User does not exist. Please register instead.'
            });
        }

        const user = userResult.rows[0];

        const match = await verifyPassword(user_password, user.password);

        if (!match) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password.'
            });
        }

        const token = jwt.sign(
            { id: user.id, user_role: user.role },
            JWTSecret,
            { expiresIn: '7d' }
        );

        const expires_at = expiresInSevenDays();

        res.cookie('token' , token , {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        await pool.query(
            'INSERT INTO user_sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
            [user.id, token, expires_at]
        );

        await redis.set(`user:${user.id}` , JSON.stringify({
                id: user.id,
                user_role: user.role
            }) , 'EX' , 3600)

        return res.json({
            success: true,
            text: 'Successfully login',
            token,
            user: {
                id: user.id,
                user_role: user.role
            },
            expire: expires_at
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// ✅ Fixed: Proper register endpoint
router.post('/register', async (req, res) => {
    try {
        const { user_email, user_name, user_password } = req.body;

        // Validate input
        if (!user_email || !user_password || !user_name) {
            return res.status(400).json({
                success: false,
                error: 'Email, name, and password are required.'
            });
        }

        const emailExistingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [user_email]
        )

        if (emailExistingUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Email already exists. Please sign in instead.'
            });
        }

        const hashedPassword = await hashPassword(user_password);

        const newUser = await pool.query(
            'INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING id , role',
            [user_email, user_name, hashedPassword]
        );

        // Coupon on register
        const WELCOME_CODE = 'WELCOME10';

        const couponResult = await pool.query(
            'SELECT id FROM coupons WHERE code = $1 AND is_active = true', 
            [WELCOME_CODE]
        );

        if (couponResult.rows.length > 0) {
            const couponId = couponResult.rows[0].id;

            await pool.query(
                `INSERT INTO user_coupons (user_id, coupon_id, is_used) 
                VALUES ($1, $2, $3)`,
                [newUser.rows[0].id , couponId, false]
            );
        }

        const user = newUser.rows[0];

        const token = jwt.sign(
            { id: user.id, user_role: user.role},
            JWTSecret,
            { expiresIn: '7d' }
        );

        const expires_at = expiresInSevenDays();

        res.cookie('token' , token , {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        await pool.query(
            'INSERT INTO user_sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
            [user.id, token, expires_at]
        );

        await redis.set(`user:${user.id}` , JSON.stringify({
                id: user.id,
                user_role: user.role
            }) , 'EX' , 3600)

        return res.json({
            success: true,
            text: 'Successfully registered',
            token,
            user: {
                id: user.id,
                user_role: user.role
            },
            expire: expires_at
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.post("/logout", verifyUser , async (req, res) => {
  try {
    res.clearCookie("token");
    await redis.del(`user:${req.userId}`)
    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    console.log("Error in logging out", error);
    return res.status(500).json({ message: "Logout failed" });
  }
});

/* Cart Logics */
router.post('/cart/add/sync', verifyUser, async (req, res) => {
    const { cart } = req.body;
    const userId = req.userId; 

    try {
        if (cart.length === 0){
            return res.status(200).json({
                success: true,
                text: 'No item available'
            })
        }

        await pool.query('DELETE FROM user_cart_items WHERE user_id = $1', [userId]);

        if (cart) {
            const values = [];
            const rows = cart.map((item, index) => {
                const offset = index * 3;
                values.push(userId, item.id, item.quantity);
                return `($${offset + 1}, $${offset + 2}, $${offset + 3})`;
            });

            const query = `INSERT INTO user_cart_items (user_id, item_id, quantity) VALUES ${rows.join(',')}`;
            await pool.query(query, values);
        }

        res.status(200).json({
            success: true,
            text: 'Cart synced successfully'
        });

    } catch (error) {
        console.error('Sync Error:', error);
        return res.status(500).json({ success: false, text: 'Internal Server Error' });
    }
});

/*Profile Logics*/
router.get('/profile/get' , verifyUser , async (req , res) => {
    const userID = req.userId

    try {
        
        const redisCache = await redis.get(`profile:${userID}`)

        if (redisCache){
            return res.status(200).json({
                success: true,
                text: 'fetched from redis',
                user_details: JSON.parse(redisCache)
            })
        }

        const result = await pool.query('SELECT id , name , email , phoneno FROM users WHERE id = $1' , [userID])

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found in database"
            });
        }

        const user = result.rows[0]

        await redis.set(`profile:${userID}` , JSON.stringify(result.rows[0]) , 'EX' , 3600)

        return res.status(200).json({
            success: true,
            text: 'fetched from database',
            user_details: {
                id: user.id,
                name: user.name,
                phoneno: user.phoneno,
                email: user.email}
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
})

router.post('/profile/edit' , verifyUser , async (req, res)=>{
    const userId = req.userId;
    const {name , mobile } = req.body

    try {
        await redis.del(`profile:${userId}`)

        const existing = await pool.query('SELECT * FROM users WHERE phoneno = $1 AND id != $2' , [mobile , userId])

        if(existing.rowCount !== 0){
            return res.status(400).json({
                success: true,
                text: 'Phone number is already in use'
            })
        }

        const result = await pool.query("UPDATE users SET name = COALESCE($1 , name) , phoneno = COALESCE($2 , phoneno) WHERE id = $3 RETURNING id , name , email , phoneno" , [name , mobile , userId])

        if (result.rows.length === 0){
            return res.status(404).json({
                success: false,
                text: 'User not found'
            })
        }

        const user = result.rows[0];

        return res.status(200).json({
            success: true,
            text: 'Successfully Updated',
            user_details: {
                id: user.id,
                name: user.name,
                phoneno: user.phoneno,
                email: user.email
                }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
})

/*Location check */
router.get('/location/get' , verifyUser , async (req , res) => {
    const userId = req.userId

    try {
        const redisCache = await redis.get(`user_address:${userId}`)

        if (redisCache){
            return res.status(200).json({
                success: true,
                text: 'Got the address from redis',
                user_address: JSON.parse(redisCache)
            })
        }

        const result = await pool.query('SELECT user_id , full_address , landmark , pincode , latitude , longitude , can_order FROM user_addresses WHERE user_id = $1' , [userId])
    
        if(result.rows.length === 0){
            return res.status(200).json({
                success: false,
                error: 'No Address has been added.'
            })
        }

        const user_address = result.rows[0]

        await redis.set(`user_address:${userId}` , JSON.stringify(user_address) , 'EX' , 3600)

        return res.status(200).json({
            success: true,
            text: 'Fot the address from database.',
            user_address: user_address
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
})

router.post('/location/post' , verifyUser , async (req , res)=>{
    const userId = req.userId
    const { full_address , landmark , pincode , latitude , longitude} = req.body

    try {
        if(!full_address || !landmark || !pincode || !latitude || !longitude) return res.status(200).json({
            success: false,
            error: 'Address missing...'
        })

        const existing = await pool.query('SELECT * FROM user_addresses WHERE user_id = $1' , [userId])

        if(existing.rows.length > 0){
            return res.status(422).json({
                success: false,
                error: 'Address already exits'
            })
        }

        const isInside = geolib.isPointInPolygon(
            { latitude: latitude , longitude: longitude},
            gaavyaDeliveryZone
        )

        if (!isInside) {
            const can_order = false
            const result = await pool.query('INSERT INTO user_addresses (user_id , full_address , landmark , pincode , latitude , longitude , can_order) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING user_id , full_address , landmark , pincode , latitude , longitude , can_order' , [userId , full_address , landmark , pincode , latitude , longitude , can_order])

            if(result.rows.length === 0){
                return res.status(400).json({
                    success: false,
                    error: 'Failed to insert the address.'
                })
            }

            const user_address = result.rows[0]

            return res.status(200).json({ 
                success: true, 
                text: "Location posted successfully",
                user_address: user_address
            });
        }

        const result = await pool.query('INSERT INTO user_addresses (user_id , full_address , landmark , pincode , latitude , longitude) VALUES ($1,$2,$3,$4,$5,$6) RETURNING user_id , full_address , landmark , pincode , latitude , longitude , can_order' , [userId , full_address , landmark , pincode , latitude , longitude])
    
        if(result.rows.length === 0){
            return res.status(400).json({
                success: false,
                error: 'Failed to insert the address.'
            })
        }

        const user_address = result.rows[0]

        await redis.set(`user_address:${userId}` , JSON.stringify(user_address) , 'EX' , 3600)

        return res.status(200).json({
            success: true,
            text: 'Location posted successfully',
            user_address: user_address
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
})

router.post('/location/edit' , verifyUser , async (req , res)=>{
    const userId = req.userID
    const { full_address , landmark , pincode , latitude , longitude} = req.body

    try {
        await redis.del(`user_address:${userId}`)

        const isInside = geolib.isPointInPolygon(
            { latitude: latitude , longitude: longitude},
            gaavyaDeliveryZone
        )

        if (!isInside) {
            const can_order = false
            const result = await pool.query('UPDATE user_addresses SET full_address = COALESCE($1 , full_address) , landmark = COALESCE($2 , landmark) , pincode = COALESCE($3 , pincode) , latitude = COALESCE($4 , latitude) , longitude = COALESCE($5 , longitude) , can_order = $6 WHERE user_id = $7 RETURNING user_id , full_address , landmark , pincode , latitude , longitude , can_order' , [full_address , landmark , pincode , latitude , longitude , can_order , userId])

            if(result.rows.length === 0){
                return res.status(400).json({
                    success: false,
                    error: 'Failed to update the address.'
                })
            }

            const user_address = result.rows[0]

            return res.status(200).json({ 
                success: true, 
                text: "Location updated successfully",
                user_address: user_address
            });
        }

        const existing = await pool.query('SELECT * FROM user_addresses WHERE user_id = $1' , [userId])

        if(existing.rows.length === 0){
            return res.status(404).json({
                success: false,
                text: 'User not found'
            })
        }

        const result = await pool.query('UPDATE user_addresses SET full_address = COALESCE($1 , full_address) , landmark = COALESCE($2 , landmark) , pincode = COALESCE($3 , pincode) , latitude = COALESCE($4 , latitude) , longitude = COALESCE($5 , longitude) WHERE user_id = $6 RETURNING user_id , full_address , landmark , pincode , latitude , longitude , can_order' , [full_address , landmark , pincode , latitude , longitude , userId])

        if (result.rows.length === 0){
            return res.status(404).json({
                success: false,
                text: 'User not found'
            })
        }

        const user_address = result.rows[0];

        await redis.set(`user_address:${userId}` , JSON.stringify(user_address) , 'EX' , 3600)
    
        return res.status(200).json({
            success: true,
            text: 'Successfully Updated',
            user_address: user_address
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
})

router.post('/location/delete' , verifyUser , async (req , res)=>{
    const userId = req.userId

    try {
        await pool.query('DELETE FROM user_addresses WHERE user_id = $1' , [userId])

        await redis.del(`user_address:${userId}`)

        return res.status(200).json({ success: true, text: "Deleted" });
    } catch (error) {
        console.error("Delete Error:", error.message);
        return res.status(500).json({
            success: false,
            error: "Failed to delete address."
        });
    }
})

/*Review Post*/
router.post('/review/get' , async (req , res) => {
    const { itemId } = req.body

    try {
        const redisCache = await redis.get(`reviews_item_id:${itemId}`)

        if (redisCache){
            return res.status(200).json({
                success: true,
                text: 'Successfully got the reviews',
                user_reviews: JSON.parse(redisCache)
            })
        }

        const result = await pool.query('SELECT id , rating , comment , is_verified_purchase FROM user_reviews WHERE item_id = $1' , [itemId])

        const user_reviews = result.rows

        await redis.set(`reviews_item_id:${itemId}` , JSON.stringify(user_reviews) , 'EX' , 3600)
    
        return res.status(200).json({
            success: true,
            text: 'Reviews successfully fetched',
            user_reviews: user_reviews
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: 'Server error: ' + error.message,
        })
    }
})

router.post('/review/post' , verifyUser , async (req , res) => {
    const userId = req.userId
    const { itemId , rating , comment , isVerifiedPurchase} = req.body

    try {
        const result = await pool.query('INSERT INTO user_reviews (item_id , user_id , rating , comment , is_verified_purchase) VALUES ($1 ,$2 ,$3 ,$4 , $5) RETURNING id , rating , comment , is_verified_purchase' , [itemId , userId , rating , comment , isVerifiedPurchase])
    
        if(result.rows.length === 0){
            return res.status(200).json({
                success: false,
                error: 'No reviews got for the particular user.',
                user_reviews: {}
            })
        }

        const user_reviews = result.rows[0]

        await redis.del(`reviews_item_id:${itemId}`);
    
        return res.status(200).json({
            success: true,
            text: 'Reviews successfully posted',
            user_reviews: user_reviews
        }) 
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: 'Server error: ' + error.message,
        })
    }
})

// Product Logics
router.get('/product/get/all' , async (req , res)=>{
    try {
        const redisCache = await redis.get('user_products:all')

        if (redisCache){
            return res.status(200).json({
                success: true,
                text: 'Successfully got the products',
                user_products_all: JSON.parse(redisCache)
            })
        }

        const result = await pool.query('SELECT id , name , description , price , image_url , category_id FROM products WHERE is_active = true')
    
        if (result.rows.length === 0){
            return res.status(200).json({
                success: true,
                text: 'No products in the inventory',
                user_products_all: null
            })
        }

        await redis.set('user_products:all' , JSON.stringify(result.rows) , 'EX' , 3600)
    
        return res.status(200).json({
            success: true,
            text: "Successfully got the products",
            user_products_all: result.rows
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: 'SERVER ERRROR'
        })
    }
})

router.get('/product/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // FIXED: Added .get()
        const redisCache = await redis.get(`products:${id}`);

        if (redisCache) {
            return res.status(200).json({
                success: true,
                text: "Got the requested product",
                user_product: JSON.parse(redisCache)
            });
        }

        // FIXED: Removed trailing comma after 'gallery'
        const query = `
            SELECT 
                p.*,
                c.name as category_name,
                pq.shelf_life,
                pq.storage_tips,
                pq.best_suited_for,
                pq.sourcing_origin,
                pq.allergen_info,
                COALESCE(
                    json_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL), 
                    '[]'
                ) as gallery
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_images pi ON p.id = pi.product_id
            LEFT JOIN product_quality pq ON p.id = pq.product_id
            WHERE p.id = $1
            GROUP BY p.id, c.name, pq.id, pq.shelf_life, pq.storage_tips, pq.best_suited_for, pq.sourcing_origin, pq.allergen_info`;

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
             return res.status(404).json({ success: false, text: "Product not found" });
        }

        // FIXED: Redis syntax
        await redis.set(`products:${id}`, JSON.stringify(result.rows[0]), 'EX', 3600);

        return res.status(200).json({
            success: true,
            text: 'Got the requested product',
            user_product: result.rows[0]
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: 'SERVER ERROR'
        });
    }
});

// Category Logics
router.get('/category/get/all' , async (req , res) => {
    try {
        const redisCache = await redis.get('user_categories:all')

        if (redisCache){
            return res.status(200).json({
                success: true,
                text: 'Successfully got the categories',
                user_categories_all: JSON.parse(redisCache)
            })
        }

        const result = await pool.query('SELECT id , name , icon FROM categories WHERE is_active = true')
    
        if (result.rows.length === 0){
            return res.status(200).json({
                success: true,
                text: 'No categories in the inventory',
                user_categories_all: null
            })
        }

        await redis.set('user_categories:all' , JSON.stringify(result.rows) , 'EX' , 3600)
    
        return res.status(200).json({
            success: true,
            text: "Successfully got the categories",
            user_categories_all: result.rows
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: 'SERVER ERRROR'
        })
    }
})

// Coupon Logics
router.get('/coupon' , verifyUser , async(req , res) => {
    const userId = req.userId

    try {
        const redisCache = await redis.get(`coupon:${userId}`)

        if (redisCache){
            return res.status(200).json({
                success: true,
                text: "Successfully fetched user's coupons",
                user_coupons_all: JSON.parse(redisCache)
            })
        }

        const result = await pool.query(`SELECT uc.* ,
                                            c.code , 
                                            c.discount_type,
                                            c.discount_value,
                                            c.expiry_date,
                                            c.is_active,
                                            c.description
                                            FROM user_coupons uc
                                            LEFT JOIN coupons c ON c.id = uc.coupon_id
                                            WHERE uc.user_id = $1
                                            ORDER BY uc.id`, [userId])

        if(result.rows.length === 0){
            return res.status(200).json({
                success: true,
                text: 'No coupons in the inventory',
                user_coupons_all: []
            })
        }

        await redis.set(`coupon:${userId}` , JSON.stringify(result.rows) , 'EX' , 3600)

        return res.status(200).json({
            success: true,
            text: "Successfully fetched user's coupons",
            user_coupons_all: result.rows
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: 'SERVER ERRROR'
        })
    }
})

router.get('/coupon/eligible' , verifyUser , async(req , res) => {
    try {
        const orderCount = await pool.query(
            `SELECT COUNT(*) FROM orders WHERE user_id = $1 AND payment_status = 'PAID'`,
            [req.userId]
        );

        const orders = parseInt(orderCount.rows[0].count)

        return res.json({
            success: true,
            order_count: orders,
            eligible_for_coupon: orders >= 1 
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
})

module.exports = router;

