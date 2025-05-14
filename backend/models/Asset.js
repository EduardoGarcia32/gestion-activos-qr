// backend/models/Asset.js
const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  assetNumber: { 
    type: String, 
    unique: true,  // Número de activo único
    required: true, // Obligatorio
    uppercase: true, //Forzar mayúsculas
    trim: true //Eliminar espacios
  },
  type: { 
    type: String, 
    enum: ['Laptop', 'Desktop', 'Monitor', 'Impresora', 'Router', 'Otros'], // Solo estos valores, se pueden agregar más de ser necesario
    required: true 
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  qrCode: {
    type: String,
    required: true
  },
  specifications: {
    brand: String,
    sreialNumber: String,
    purchaseDate: Date
  },
  maintenance: [{
    date: {
      type: Date,
      default: Date.now
    },
    description: String,
    technician: String,
    cost: Number
  }],
  status: {
    type: String,
    eneum: ['Activo', 'En mantenimeinto', 'Baja'],
    default: 'Activo'
  }
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Assets', AssetSchema);

  /*model: String, // Ej: "Dell XPS 15"
  qrCode: String, // Almacenará el QR en formato texto (base64)
  maintenance: [{ // Array de mantenimientos
    date: { 
      type: Date, 
      default: Date.now // Fecha automática
    },
    description: String, // Ej: "Cambio de teclado"
    technician: String   // Ej: "Juan Pérez"
  }]
});

module.exports = mongoose.model('Asset', AssetSchema);*/