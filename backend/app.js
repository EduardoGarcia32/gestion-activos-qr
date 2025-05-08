require('dotenv').config(); // 👈 Cargar variables de entorno al inicio
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 👈 Importante para el frontend
const morgan = require('morgan'); // 👈 Para logging de requests
const path = require('path');

// Importar rutas
const assetRoutes = require('./routes/assets');
const authRoutes = require('./routes/auth'); // 👈 Nueva ruta de autenticación
const dashboardRoutes = require('./routes/dashboard'); // 👈 Ruta para el dashboard

const app = express();

// 👇 Configuración mejorada de conexión a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gestion-activos', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      family: 4 // 👈 Fuerza IPv4 para evitar problemas en Windows
    });
    console.log('✅ Conectado a MongoDB');
  } catch (err) {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    process.exit(1); // 👈 Salir si no hay conexión a la DB
  }
};
connectDB();

// Middlewares
app.use(cors()); // 👈 Habilita CORS
app.use(morgan('dev')); // 👈 Logs de requests en consola
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public'))); // 👈 Sirve archivos estáticos

// Rutas
app.use('/api/assets', assetRoutes);
app.use('/api/auth', authRoutes); // 👈 Nueva ruta de autenticación
app.use('/api/dashboard', dashboardRoutes); // 👈 Ruta para el dashboard

// Ruta de prueba mejorada
app.get('/', (req, res) => {
  res.json({
    message: 'Backend de gestión de activos',
    status: 'operativo',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ 
    success: false,
    message: 'Ruta no encontrada' 
  });
});

// Manejo centralizado de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor funcionando en http://localhost:${PORT}`);
  console.log(`📊 Dashboard disponible en http://localhost:${PORT}/api/dashboard`);
});