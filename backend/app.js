require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { protect } = require('./middlewares/auth');

// Importar rutas
const assetRoutes = require('./routes/assets');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// 1. Conexión mejorada a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      family: 4
    });
    console.log('✅ MongoDB conectado');
  } catch (err) {
    console.error('❌ Error de MongoDB:', err.message);
    process.exit(1);
  }
};
connectDB();

// 2. Middlewares esenciales
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Sistema de rutas
app.use('/api/auth', authRoutes);
app.use('/api/assets', protect, assetRoutes);
app.use('/api/dashboard', protect, dashboardRoutes);

// 4. Documentación API (opcional)
app.get('/api/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'docs.html'));
});

// 5. Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// 6. Manejo de errores
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 7. Inicio del servidor
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
  console.log(`📊 Dashboard disponible en http://localhost:${PORT}/api/dashboard`);

});

// 8. Manejo de cierre
process.on('SIGTERM', () => {
  server.close(() => {
    mongoose.connection.close();
    console.log('Servidor cerrado');
    process.exit(0);
  });
});



//  console.log(`📊 Dashboard disponible en http://localhost:${PORT}/api/dashboard`);
