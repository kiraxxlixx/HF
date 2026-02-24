// /controllers/clientController.js
const Product = require('../models/product');
const Sucursal = require('../models/sucursal');
const Config = require('../models/config'); 
const Promotion = require('../models/promotion');
const Review = require('../models/review'); 
const mongoose = require('mongoose');


// --- Constantes de Regla de Negocio ---
const LIMITE_MENUDEO = 32;
const CARGO_SERVICIO_ONLINE = 5.00;

// @desc    Obtener lista de sucursales (Pública para el selector)
// @route   GET /api/v1/client/sucursales
exports.getPublicSucursales = async (req, res) => {
    try {
        const sucursales = await Sucursal.find({ estado: 'activo' }).select('nombreSucursal _id direccion');
        res.json({ success: true, data: sucursales });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener sucursales.' });
    }
};

// @desc    Obtener el catálogo filtrado por Sucursal
// @route   GET /api/v1/client/products?sucursalId=...
// @access  Public
exports.getCatalogo = async (req, res) => {
    try {
        let { sucursalId } = req.query;

        if (!sucursalId) {
            const benton = await Sucursal.findOne({ nombreSucursal: 'Benton' });
            if (benton) sucursalId = benton._id;
        }

        if (!sucursalId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Debes seleccionar una sucursal.' 
            });
        }

        const products = await Product.find({
            activo: true,
            $or: [
                { sucursales: { $exists: false } },
                { sucursales: { $size: 0 } },
                { sucursales: sucursalId }
            ]
        }).select(
            '_id nombreProducto descripcion imagenUrl categoria variaciones'
        );

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {
        console.error("🔥 ERROR EN getCatalogo:", error);
        res.status(500).json({
            success: false,
            message: 'Error al cargar el catálogo.'
        });
    }
};



// @desc    Obtener promociones activas y vigentes
// @route   GET /api/v1/client/promotions/active
exports.getActivePromotions = async (req, res) => {
    try {
        const today = new Date();
        const promotions = await Promotion.find({
            activo: true,
            fecha_inicio: { $lte: today }, // Que ya haya empezado
            fecha_fin: { $gte: today }     // Que no haya terminado
        });
        res.json({ success: true, data: promotions });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener promociones.' });
    }
};

// @desc    Obtener reseñas recientes (ej. las últimas 3 de 5 estrellas)
// @route   GET /api/v1/client/reviews/recent
exports.getRecentReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ 
            estado: 'aprobado',
            calificacion: { $gte: 4 } // Solo reseñas buenas (4 o 5 estrellas)
        })
        .sort({ createdAt: -1 }) // Las más nuevas primero
        .limit(3) // Solo 3
        .populate('IDUSUARIO', 'nombrePila') // Nombre del cliente
        .populate('IDPRODUCTO', 'nombreProducto'); // Nombre del helado

        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener reseñas.' });
    }
};

exports.getHomeData = async (req, res) => {
    try {
        const today = new Date();
        
        // 1. Promociones Activas (Populate sucursal para saber el nombre)
        const promotions = await Promotion.find({
            activo: true,
            fecha_inicio: { $lte: today },
            fecha_fin: { $gte: today }
        }).populate('IDSucursal', 'nombreSucursal');

        // 2. Productos Favoritos (Máx 3, activos)
        const favorites = await Product.find({ 
            activo: true, 
            esFavorito: true 
        }).limit(3);

        // 3. Configuración del Título
        const titleConfig = await Config.findOne({ key: 'home_title' });
        const sectionTitle = titleConfig ? titleConfig.value : 'Nuestros Favoritos';

        // 4. Reseñas Recientes
        const reviews = await Review.find({ estado: 'aprobado', calificacion: { $gte: 4 } })
            .sort({ createdAt: -1 }).limit(3)
            .populate('IDUSUARIO', 'nombrePila')
            .populate('IDPRODUCTO', 'nombreProducto');

        res.json({ 
            success: true, 
            data: { promotions, favorites, sectionTitle, reviews } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo datos del home.' });
    }
};