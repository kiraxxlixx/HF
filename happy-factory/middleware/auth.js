// /middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// 🔐 Proteger rutas
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Buscar usuario real en DB
            req.user = await User.findById(decoded.id).select('-contrasena');

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token inválido o expirado.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'No autorizado, sin token.' });
    }
};

// 👮 Control por rol
const checkRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.rol !== role) {
            return res.status(403).json({ message: 'Acceso denegado.' });
        }
        next();
    };
};

module.exports = { protect, checkRole };