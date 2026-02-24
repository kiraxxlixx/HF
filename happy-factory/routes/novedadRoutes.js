const express = require('express');
const router = express.Router();

const { getNovedades, createNovedad, deleteNovedad } = require('../controllers/novedadController');

const { protect, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Ruta pública
router.get('/', getNovedades);

// Solo administrador puede crear o eliminar
router.post('/', protect, checkRole('administrador'), upload.single('media'), createNovedad);
router.delete('/:id', protect, checkRole('administrador'), deleteNovedad);

module.exports = router;