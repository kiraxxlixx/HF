// /controllers/adminController.js
const Promotion = require('../models/promotion'); 
const Review = require('../models/review');
const Product = require('../models/product');
const User = require('../models/user');
const Sucursal = require('../models/sucursal');
const Config = require('../models/config');



// @desc    Crear Sucursal
exports.createSucursal = async (req, res) => {
    const { nombreSucursal, direccion, telefono, estado } = req.body;
    if (!nombreSucursal || !direccion) return res.status(400).json({ message: 'Datos incompletos.' });

    try {
        const sucursal = await Sucursal.create({ nombreSucursal, direccion, telefono, estado });
        res.status(201).json({ success: true, data: sucursal });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ success: false, message: 'Nombre de sucursal duplicado.' });
        res.status(500).json({ success: false, message: error.message });
    }
};



// @desc    Obtener Sucursales
exports.getSucursales = async (req, res) => {
    try {
        const sucursales = await Sucursal.find({ estado: 'activo' });
        res.json({ success: true, data: sucursales });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener sucursales.' });
    }
};

exports.getGlobalConfig = async (req, res) => {
    try {
        const config = await Config.findOne({ key: req.params.key });
        res.json({ success: true, value: config ? config.value : '' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateGlobalConfig = async (req, res) => {
    try {
        const { key, value } = req.body;
        const config = await Config.findOneAndUpdate(
            { key }, 
            { value }, 
            { new: true, upsert: true } // Crea si no existe
        );
        res.json({ success: true, data: config });
    } catch (err) { res.status(500).json({ message: err.message }); }
};
// --- PROMOCIONES ---
exports.getPromotions = async (req, res) => {
    try {
        const promos = await Promotion.find({}).sort({ fecha_inicio: -1 });
        res.json(promos);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createPromotion = async (req, res) => {
    try {
        const promo = await Promotion.create(req.body);
        res.status(201).json(promo);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updatePromotion = async (req, res) => {
    try {
        const promo = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!promo) return res.status(404).json({ message: 'Promoción no encontrada' });
        res.json(promo);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.togglePromotionActive = async (req, res) => {
    try {
        const promo = await Promotion.findByIdAndUpdate(req.params.id, { activo: req.body.activo }, { new: true });
        if (!promo) return res.status(404).json({ message: 'Promoción no encontrada' });
        res.json(promo);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

// NUEVA FUNCIÓN: Eliminar promoción
exports.deletePromotion = async (req, res) => {
    try {
        const promo = await Promotion.findByIdAndDelete(req.params.id);
        if (!promo) return res.status(404).json({ message: 'Promoción no encontrada' });
        res.json({ success: true, message: 'Promoción eliminada correctamente' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// --- REVIEWS ---
exports.getPendingReviews = async (req, res) => {
    
    try {
        const reviews = await Review.find() // Quitamos filtro { estado: 'pendiente' } para ver todo
            .populate('IDPRODUCTO', 'nombreProducto')
            .populate('IDUSUARIO', 'nombrePila')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.moderateReview = async (req, res) => {
    const { estado } = req.body;
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, { estado }, { new: true });
        res.json(review);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Reseña eliminada' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// --- PRODUCTOS ---
exports.createProduct = async (req, res) => {
    try {
        let imagenUrl = '';
        
        // ✨ EL CAMBIO MAGICO ESTÁ AQUÍ ✨
        // Si hay un archivo, usamos la ruta segura que nos da Cloudinary
        if (req.file) imagenUrl = req.file.path;
        else imagenUrl = req.body.imagenUrl || '';

        const productData = { ...req.body, imagenUrl };

        if (typeof productData.variaciones === 'string') productData.variaciones = JSON.parse(productData.variaciones);
        if (typeof productData.sucursales === 'string') productData.sucursales = JSON.parse(productData.sucursales);
        
        productData.esFavorito = req.body.esFavorito === 'true' || req.body.esFavorito === true;

        const product = await Product.create(productData);
        res.status(201).json({ success: true, data: product });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.updateProduct = async (req, res) => {
    try {
        let updateData = { ...req.body };
        
        // ✨ Y TAMBIÉN AQUÍ ✨
        if (req.file) updateData.imagenUrl = req.file.path;
        
        if (typeof updateData.variaciones === 'string') updateData.variaciones = JSON.parse(updateData.variaciones);
        if (typeof updateData.sucursales === 'string') updateData.sucursales = JSON.parse(updateData.sucursales);
        
        if (updateData.esFavorito !== undefined) {
            updateData.esFavorito = updateData.esFavorito === 'true' || updateData.esFavorito === true;
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!product) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        res.json({ success: true, data: product });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};



exports.archiveProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, { activo: req.body.activo }, { new: true });
        if (!product) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        res.json({ success: true, data: product });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ nombreProducto: 1 });
        res.json({ success: true, data: products });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ...

// @desc    Actualizar una sucursal
// @route   PUT /api/v1/admin/sucursales/:id
exports.updateSucursal = async (req, res) => {
    try {
        const { nombreSucursal, direccion, telefono, estado } = req.body;

        // Buscamos y actualizamos
        const sucursal = await Sucursal.findByIdAndUpdate(req.params.id, {
            nombreSucursal,
            direccion, // Se espera un objeto { calle, colonia, ... }
            telefono,
            estado
        }, { new: true, runValidators: true });

        if (!sucursal) {
            return res.status(404).json({ message: 'Sucursal no encontrada.' });
        }

        res.json({ success: true, message: 'Sucursal actualizada.', data: sucursal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Eliminar una sucursal
// @route   DELETE /api/v1/admin/sucursales/:id
exports.deleteSucursal = async (req, res) => {
    try {
        const sucursal = await Sucursal.findByIdAndDelete(req.params.id);
        
        if (!sucursal) {
            return res.status(404).json({ message: 'Sucursal no encontrada.' });
        }

        res.json({ success: true, message: 'Sucursal eliminada.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Eliminar un producto definitivamente
// @route   DELETE /api/v1/admin/products/:id
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }

        res.json({ success: true, message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSucursalById = async (req, res) => {
    try {
        const sucursal = await Sucursal.findById(req.params.id);
        if(!sucursal) return res.status(404).json({message: 'Sucursal no encontrada'});
        res.json({ success: true, data: sucursal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};