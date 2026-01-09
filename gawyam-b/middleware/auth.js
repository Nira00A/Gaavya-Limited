const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = require('../config/postgreSqlClient')
const redis = require('../config/redisClient')

const verifyUser =async (req , res , next) => {
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({ error: "No session found. Please Login."})
    }

    try {
        const decode = jwt.verify(token , process.env.JWT_SECRET)

        let userExists = await redis.get(`user_exists:${decode.id}`);

        if (!userExists) {
            const dbCheck = await pool.query('SELECT id FROM users WHERE id = $1', [decode.id]);
            if (dbCheck.rows.length === 0) {
                return res.status(404).json({ error: "Account deleted.", clearToken: true });
            }

            await redis.set(`user_exists:${decode.id}`, 'true', 'EX', 600);
        }

        req.userId = decode.id
        req.userRole = decode.user_role

        next()
    } catch (error) {
        console.log(error)
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Session expired. Please login again." });
        }
        return res.status(403).json({ error: "Invalid session." });
    }
}

module.exports = verifyUser