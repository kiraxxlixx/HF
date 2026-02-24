const Novedad = require('../models/novedad');

// Obtener todas las novedades (Público)
exports.getNovedades = async (req, res) => {
    try {
        // Las ordenamos para que las más nuevas salgan primero
        const novedades = await Novedad.find().sort({ fechaCreacion: -1 });
        res.status(200).json(novedades);
    } catch (error) {
        res.status(500).json({ message: 'Error al cargar las novedades', error: error.message });
    }
};

// Crear una nueva novedad (Solo Administrador)
exports.createNovedad = async (req, res) => {
    try {
        const { titulo, descripcion, tipoMedia } = req.body;
        
        // Verificamos si se subió un archivo
        if (!req.file) {
            return res.status(400).json({ message: 'Debes subir una imagen o video' });
        }

        const mediaUrl = `/uploads/${req.file.filename}`;

        const nuevaNovedad = new Novedad({
            titulo,
            descripcion,
            tipoMedia: tipoMedia || 'imagen',
            mediaUrl
        });

        await nuevaNovedad.save();
        res.status(201).json({ message: 'Novedad publicada con éxito', novedad: nuevaNovedad });
    } catch (error) {
        res.status(500).json({ message: 'Error al publicar la novedad', error: error.message });
    }
};

// Eliminar una novedad (Solo Administrador)
exports.deleteNovedad = async (req, res) => {
    try {
        const novedad = await Novedad.findByIdAndDelete(req.params.id);
        if (!novedad) {
            return res.status(404).json({ message: 'Novedad no encontrada' });
        }
        res.status(200).json({ message: 'Novedad eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la novedad', error: error.message });
    }
};