// backend/models/Asset.js
const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  assetNumber: { 
    type: String, 
    unique: true,  // Número de activo único
    required: true // Obligatorio
  },
  type: { 
    type: String, 
    enum: ['Laptop', 'Desktop', 'Monitor'], // Solo estos valores, se pueden agregar más de ser necesario
    required: true 
  },
  model: String, // Ej: "Dell XPS 15"
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

module.exports = mongoose.model('Asset', AssetSchema);