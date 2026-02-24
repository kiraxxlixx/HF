// /routes/authRoutes.js
const express = require('express');

const { registerUser, loginUser, getMe, googleLogin } = require('../controllers/authController'); 
const { protect } = require('../middleware/auth'); 

const router = express.Router();

// --- RUTAS PÚBLICAS ---
router.post('/register', registerUser);
router.post('/login', loginUser);


// --- RUTA PRIVADA ---
router.get('/me', protect, getMe); 

module.exports = router;