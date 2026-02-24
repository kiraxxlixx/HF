// /controllers/authController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');


// Función auxiliar para generar el Token
const generateToken = (id, rol, IDSucursal) => {
    return jwt.sign(
        { id, rol, IDSucursal }, 
        process.env.JWT_SECRET,
        { expiresIn: '30d' } 
    );
};
// Importante: exportar esta función auxiliar también si se usa en otros lados (como userController)
module.exports.generateToken = generateToken;

// @desc    Registrar un nuevo usuario (CLIENTE)
exports.registerUser = async (req, res) => {
    const { nombrePila, primerApell, email, contrasena } = req.body;
    try {
        const user = await User.create({
            nombrePila, primerApell, email, contrasena, rol: 'cliente' 
        });
        res.status(201).json({
            _id: user._id, nombre: user.nombrePila, rol: user.rol, 
            token: generateToken(user._id, user.rol, user.IDSucursal)
        });
    } catch (error) {
        if (error.code === 11000) { return res.status(400).json({ message: 'El correo ya está registrado.' }); }
        res.status(500).json({ message: 'Error al registrar el usuario.' });
    }
};

// @desc    Autenticar (Login Normal)
exports.loginUser = async (req, res) => {
    const { email, contrasena } = req.body;
    if (!email || !contrasena) {
        return res.status(400).json({ message: 'Por favor ingrese email y contraseña.' });
    }
    
    const user = await User.findOne({ email }).select('+contrasena');

    if (user && (await user.matchPassword(contrasena))) {
        res.json({
            _id: user._id,
            nombre: user.nombrePila,
            rol: user.rol,
            IDSucursal: user.IDSucursal, 
            token: generateToken(user._id, user.rol, user.IDSucursal)
        });
    } else {
        res.status(401).json({ message: 'Credenciales inválidas.' });
    }
};



// @desc    Obtener perfil
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-contrasena');
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor.' });
    }
};