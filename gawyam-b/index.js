const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser')

const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
const adminProductsRoutes = require('./routes/adminProductsRoutes')
const adminCouponsRoutes = require('./routes/adminCouponsRoutes')

const corsOptions = {
    origin: ['http://localhost:3000', 'http://192.168.1.7:3000' , 'https://gaavya-limited-frontend.onrender.com'],
    credentials: true
};

const app = express();

app.set('trust proxy', 1);

const PORT = 5000;
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser())

app.use('/' , userRoutes)

// Admin Routes
app.use('/admin' , adminRoutes)

app.use('/admin/products' , adminProductsRoutes)

app.use('/admin/coupons' , adminCouponsRoutes)

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
