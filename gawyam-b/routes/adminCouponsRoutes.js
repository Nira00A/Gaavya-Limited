const express = require('express');
const router = express.Router();
const pool = require('../config/postgreSqlClient');
const redis = require('../config/redisClient');
const { verifyAdmin } = require('../middleware/adminAuth');

router.get('/' , verifyAdmin , async (req , res) => {
    try {
        const redisCache = await redis.get('coupons:all')

        if (redisCache){
            return res.status(200).json({
                success: true,
                text: 'Fetched the coupons',
                coupons: JSON.parse(redisCache)
            })
        }

        const result = await pool.query('SELECT * FROM coupons')

        await redis.set('coupons:all' , JSON.stringify(result.rows) , 'EX' , 3600)

        return res.status(200).json({
            success: true,
            text: 'Fetched the Coupons',
            coupons: result.rows
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: error.message    
        })
    }
})

router.post('/add' , verifyAdmin , async (req , res) => {
    const formData = req.body

    try {
        await redis.del('coupons:all')

        const result = await pool.query('INSERT INTO coupons (code , discount_type , discount_value , expiry_date, description) VALUES ($1,$2,$3,$4,$5)', [formData.code , formData.discount_type , formData.discount_value , formData.expiry_date , formData.description])
    
        return res.status(200).json({
            success: true,
            text: 'Successfully registered',
            coupons: result.rows
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
})

router.patch('/:id/toggle' , verifyAdmin , async (req , res) => {
    const { id } = req.params
    const { is_active } = req.body

    try {
        await redis.del('coupons:all')
        await redis.del(`coupon:${id}`)

        await pool.query(
            'UPDATE coupons SET is_active = $1 WHERE id = $2 RETURNING *', 
            [is_active, id]
        )
    
        return res.status(200).json({
            success: true,
            text: 'Successfully toggled',
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
})

router.delete('/:id' , verifyAdmin , async (req , res) => {
    const { id } = req.params

    try {
        await redis.del('coupons:all')
        await redis.del(`coupon:${id}`)

        await pool.query('DELETE FROM coupons WHERE id = $1' , [id])

        return res.status(200).json({
            success: true,
            text: 'Successfully deleted',
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
})

module.exports = router
