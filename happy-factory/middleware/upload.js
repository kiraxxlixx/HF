const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Le decimos a Multer que suba los archivos directo a la nube
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'happy_factory_productos', // Se creará esta carpeta en tu Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  },
});

const upload = multer({ storage: storage });

module.exports = upload;