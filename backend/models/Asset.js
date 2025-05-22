const mongoose = require('mongoose');
const QRCode = require('qrcode');

const AssetSchema = new mongoose.Schema({
  assetNumber: { 
    type: String, 
    unique: true,
    required: true,
    uppercase: true 
  },
  type: { 
    type: String, 
    enum: ['Laptop', 'Desktop', 'Monitor', 'Impresora', 'Router', 'Otros'],
    required: true 
  },
  model: { type: String, required: true },
  assignedTo: { type: String, default: '' },
  qrCode: { type: String, required: true },
  specifications: {
    brand: String,
    serialNumber: String,
    location: String,
    description: String
  },
  status: {
    type: String,
    enum: ['Activo', 'En mantenimiento', 'Baja', 'Disponible', 'Asignado'],
    default: 'Disponible'
  },
  history: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: String,
    changes: Object,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Middleware para generar QR antes de guardar
AssetSchema.pre('save', async function(next) {
  if (!this.qrCode) {
    const qrData = {
      assetNumber: this.assetNumber,
      type: this.type,
      model: this.model
    };
    this.qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
  }
  next();
});

module.exports = mongoose.model('Asset', AssetSchema);

/*const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  assetNumber: { 
    type: String, 
    unique: true,
    required: true,
    uppercase: true,
    trim: true
  },
  type: { 
    type: String, 
    enum: ['Laptop', 'Desktop', 'Monitor', 'Impresora', 'Router', 'Otros'],
    required: true 
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  assignedTo: {
    type: String,
    trim: true,
    default: ''
  },
  qrCode: {
    type: String,
    required: true
  },
  specifications: {
    brand: String,
    serialNumber: String,
    purchaseDate: Date,
    location: String,
    description: String
  },
  maintenance: [{
    date: {
      type: Date,
      default: Date.now
    },
    description: String,
    technician: String,
    cost: Number,
    performedBy: {  
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  status: {
    type: String,
    enum: ['Activo', 'En mantenimiento', 'Baja', 'Disponible', 'Asignado', 'Retirado'],
    default: 'Disponible'
  },
  history: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: String,
    changes: Object,
    timestamp: { type: Date, default: Date.now }
  }],
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware para actualizar la fecha de modificación (existente)
AssetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware para el historial (nuevo)
AssetSchema.pre('save', function(next) {
  if (this.isModified()) {
    const changes = this.modifiedPaths().reduce((obj, key) => {
      obj[key] = this.get(key);
      return obj;
    }, {});
    
    this.history.push({
      user: this._req?.user?.id,
      action: this.isNew ? 'CREATED' : 'UPDATED',
      changes
    });
  }
  next();
});

module.exports = mongoose.model('Asset', AssetSchema);*/
