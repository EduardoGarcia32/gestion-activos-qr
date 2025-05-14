require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { protect } = require('./middlewares/authMiddleware');

// Importar rutas
const assetRoutes = require('./routes/assets');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Ruta raíz
app.get('/', (req, res) => {
  res.json({  
    success: true,
    message: 'API de Gestión de Activos',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register'
      },
      assets: 'GET /api/assets',
      dashboard: 'GET /api/dashboard'
    },
    status: 'operativo'
  });
});

// 1. Conexión a MongoDB
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gestion-activos';
    console.log('🔗 Intentando conectar a MongoDB...');
    
    await mongoose.connect(uri); // <- Versión simplificada
    console.log('✅ MongoDB conectado');
  } catch (err) {
    console.error('❌ Error de MongoDB:', err.message);
    process.exit(1);
  }
};

// 2. Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Rutas
app.use('/api/auth', authRoutes);
app.use('/api/assets', protect, assetRoutes);
app.use('/api/dashboard', protect, dashboardRoutes);

// 4. Creación de usuario admin
const createInitialUser = async () => {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  
  try {
    console.log('🔍 Verificando usuario admin...');
    const user = await User.findOne({ email: 'admin@example.com' });
    
    if (!user) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Usuario admin creado exitosamente');
      console.log('📌 Credenciales:', {
        email: 'admin@example.com',
        password: 'admin123'
      });
    } else {
      console.log('ℹ️ Usuario admin ya existe en la base de datos');
    }
  } catch (err) {
    console.error('❌ Error al crear usuario admin:', err.message);
    throw err;
  }
};

// 5. Manejo de errores
app.use((req, res) => {
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

// 6. Inicio del servidor
const startServer = async () => {
  try {
    await connectDB();
    await createInitialUser();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor listo en http://localhost:${PORT}`);
      console.log(`🔐 Endpoint de login: POST http://localhost:${PORT}/api/auth/login`);
      console.log(`👤 Usuario demo: admin@example.com / admin123\n`);
    });
    
  } catch (error) {
    console.error('\n❌ Error crítico al iniciar:', error.message);
    process.exit(1);
  }
};

startServer();

// 7. Manejo de cierre
process.on('SIGTERM', () => {
  mongoose.connection.close();
  console.log('\n🛑 Servidor cerrado');
  process.exit(0);
});
