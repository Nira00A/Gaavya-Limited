const express = require('express');
const router = express.Router();
const pool = require('../config/postgreSqlClient');
const redis = require('../config/redisClient');
const { verifyAdmin } = require('../middleware/adminAuth');

const PRODUCTS_CACHE_KEY = 'products:all';
const USER_PRODUCTS_CACHE_KEY = 'user_products:all'

// ==========================================
// 1. GET ALL PRODUCTS (Includes Quality Info)
// ==========================================
router.get('/', verifyAdmin, async (req, res) => {
    try {
        const cachedData = await redis.get(PRODUCTS_CACHE_KEY);
        if (cachedData) return res.json(JSON.parse(cachedData));

        const query = `
            SELECT 
                p.*, 
                c.name as category_name,
                -- Quality Fields
                pq.shelf_life,
                pq.storage_tips,
                pq.best_suited_for,
                pq.sourcing_origin,
                pq.allergen_info,
                -- Gallery Aggregation
                COALESCE(
                    json_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL), 
                    '[]'
                ) as gallery
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_images pi ON p.id = pi.product_id
            LEFT JOIN product_quality pq ON p.id = pq.product_id -- 🔗 JOIN QUALITY
            GROUP BY p.id, c.name, pq.id
            ORDER BY p.created_at DESC
        `;
        const result = await pool.query(query);

        if (result.rows.length > 0) {
            await redis.set(PRODUCTS_CACHE_KEY, JSON.stringify(result.rows), 'EX', 3600);
        }

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});

// ==========================================
// 2. ADD PRODUCT (Main + Gallery + Quality)
// ==========================================
router.post('/', verifyAdmin, async (req, res) => {
    const client = await pool.connect(); 

    try {
        const { 
            name, description, price, stock_quantity, category_id, 
            main_image_url, serving_options, gallery_images,
            // Quality Fields
            shelf_life, storage_tips, best_suited_for, sourcing_origin, allergen_info 
        } = req.body;

        if (!main_image_url) return res.status(400).json({ error: "Main image URL is required" });

        await client.query('BEGIN');

        // A. Insert Product
        const productRes = await client.query(
            `INSERT INTO products (name, description, price, stock_quantity, category_id, image_url , serving_options) 
             VALUES ($1, $2, $3, $4, $5, $6 , $7) RETURNING id`,
            [name, description, price, stock_quantity, category_id, main_image_url , serving_options]
        );
        const newProductId = productRes.rows[0].id;

        // B. Insert Product Quality
        // Note: We convert "Tea, Coffee" string to an Array for Postgres using string_to_array or logic here
        // We will assume frontend sends a string "Tea, Coffee" and we convert it here:
        const suitedArray = best_suited_for ? best_suited_for.split(',').map(s => s.trim()) : [];

        await client.query(
            `INSERT INTO product_quality 
            (product_id, shelf_life, storage_tips, best_suited_for, sourcing_origin, allergen_info)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [newProductId, shelf_life, storage_tips, suitedArray, sourcing_origin, allergen_info]
        );

        // C. Insert Gallery Images
        if (gallery_images && gallery_images.length > 0) {
            const galleryQueries = gallery_images.map(url => {
                return client.query(
                    "INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)",
                    [newProductId, url]
                );
            });
            await Promise.all(galleryQueries);
        }

        await client.query('COMMIT');
        await redis.del(PRODUCTS_CACHE_KEY);
        await redis.del(USER_PRODUCTS_CACHE_KEY) 

        res.json({ success: true, text: "Product created successfully" });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Add Product Error:", err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// ==========================================
// 3. DELETE PRODUCT (Invalidates Cache)
// ==========================================
router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        await pool.query("DELETE FROM products WHERE id = $1", [req.params.id]);
        
        // CACHE INVALIDATION
        await redis.del(PRODUCTS_CACHE_KEY);
        await redis.del(USER_PRODUCTS_CACHE_KEY) 
        await redis.del(`products:${req.params.id}`)

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});

// ==========================================
// 4. UPDATE STOCK/PRICE (Invalidates Cache)
// ==========================================
router.patch('/:id/quick-edit', verifyAdmin, async (req, res) => {
    try {
        const { price, stock_quantity } = req.body;
        await pool.query(
            "UPDATE products SET price = $1, stock_quantity = $2 WHERE id = $3",
            [price, stock_quantity, req.params.id]
        );

        // 🔥 CACHE INVALIDATION
        // Even a small price/stock change must reflect instantly on the frontend
        await redis.del(PRODUCTS_CACHE_KEY);
        await redis.del(USER_PRODUCTS_CACHE_KEY) 
        await redis.del(`products:${req.params.id}`)

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;