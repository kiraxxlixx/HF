const mongoose = require('mongoose');

const NovedadSchema = new mongoose.Schema({
    titulo: { 
        type: String, 
        required: [true, 'El título es obligatorio'] 
    },
    descripcion: { 
        type: String, 
        required: [true, 'La descripción es obligatoria'] 
    },
    mediaUrl: { 
        type: String, 
        required: [true, 'La imagen o video es obligatorio'] 
    },
    tipoMedia: { 
        type: String, 
        enum: ['imagen', 'video'], 
        default: 'imagen' 
    },
    fechaCreacion: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Novedad', NovedadSchema); 