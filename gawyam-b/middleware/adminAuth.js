const jwt = require('jsonwebtoken')
const pool = require('../config/postgreSqlClient')
const redis = require('../config/redisClient')

const isAdmin = async (req , res , next) => {
    const userRole = req.userRole

    if (userRole !== 'admin'){
        return res.status(404).json({
            success: false,
            error: 'Unauthorized'
        })
    }
    
    next()
}

const verifyAdmin =async (req , res , next) => {
    const token = req.cookies.admin_token

    if(!token){
        return res.status(401).json({ error: "No admin session found. Please Login."})
    }

    try {
        const decode = jwt.verify(token , process.env.JWT_SECRET_ADMIN)

        let adminExist = await redis.get(`admin_exists:${decode.id}`);

        if (!adminExist) {
            const dbCheck = await pool.query('SELECT id FROM admins WHERE id = $1', [decode.id]);
            if (dbCheck.rows.length === 0) {
                return res.status(404).json({ error: "Account deleted.", clearToken: true });
            }

            await redis.set(`admin_exists:${decode.id}`, 'true', 'EX', 600);
        }

        req.adminId = decode.id
        req.adminRole = decode.admin_role

        next()
    } catch (error) {
        console.log(error)
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Admin Session expired. Please login again." });
        }
        return res.status(403).json({ error: "Invalid session." });
    }
}

module.exports = {isAdmin , verifyAdmin}