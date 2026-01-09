// utils/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Configure Cloudinary with your keys (from .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Define Storage Settings
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gaavya_products', // The folder name in your Cloudinary Dashboard
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    // transformation: [{ width: 800, height: 800, crop: 'limit' }] // Optional: Resize big images
  },
});

// 3. Create the upload middleware
const upload = multer({ storage: storage });

// 4. Export both 'upload' (for routes) and 'cloudinary' (for deleting images later)
module.exports = { upload, cloudinary };