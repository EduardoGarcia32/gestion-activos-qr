require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Middlewares personalizados
const { protect } = require('./middlewares/authMiddleware');

// Importar rutas
const authRoutes = require('./routes/auth');
const assetRoutes = require('./routes/assets');
const dashboardRoutes = require('./routes/dashboard');

/*******************************************
 *  MIDDLEWARES GLOBALES (¡ESTOS VAN PRIMERO!)
 *******************************************/
// 1. Middlewares para parsear el body (CRÍTICOS)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 2. Middlewares de seguridad y logs
app.use(cors({
  origin: 'http://localhost:8081',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/*******************************************
 *  RUTAS (Siempre después de los middlewares)
 *******************************************/
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

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/assets', protect, assetRoutes);
app.use('/api/dashboard', protect, dashboardRoutes);

/*******************************************
 *  CONEXIÓN A MONGODB
 *******************************************/
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gestion-activos';
    console.log('🔗 Intentando conectar a MongoDB...');
    
    await mongoose.connect(uri);
    console.log('✅ MongoDB conectado');
  } catch (err) {
    console.error('❌ Error de MongoDB:', err.message);
    process.exit(1);
  }
};

/*******************************************
 *  CONFIGURACIÓN INICIAL TEMPORAL 
 *******************************************/
const createInitialUser = async () => {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  
  try {
    console.log('\n🔍 Configurando usuario admin (solución definitiva)...');
    
    // 1. Eliminación completa de usuarios existentes
    await User.deleteMany({ email: 'admin@example.com' });
    console.log('🗑 Todos los usuarios admin eliminados');

    // 2. Generación de hash con salt fijo para consistencia
    const plainPassword = 'admin123';
    const salt = '$2b$10$' + require('crypto').randomBytes(16).toString('hex').slice(0,22);
    console.log('🧂 Salt utilizado:', salt);
    
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    console.log('🔐 Hash generado:', hashedPassword);

    // 3. Creación directa sin middleware
    const newAdmin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    // 4. Verificación independiente
    const dbUser = await User.findOne({ email: 'admin@example.com' }).select('+password');
    
    if (!dbUser) throw new Error('Usuario no se creó correctamente');
    
    const isMatch = await bcrypt.compare(plainPassword, dbUser.password);
    console.log('🔍 Resultado comparación:', isMatch);
    console.log('📌 Hash almacenado:', dbUser.password);

    if (!isMatch) {
      throw new Error('Fallo en verificación post-guardado');
    }

    console.log('✅ Usuario admin configurado CORRECTAMENTE');
    console.log('📌 Credenciales: admin@example.com / admin123');

  } catch (err) {
    console.error('\n❌ ERROR IRRECUPERABLE:', err.message);
    console.error('Revisa:');
    console.error('1. Conexión a MongoDB');
    console.error('2. Permisos de escritura');
    console.error('3. Consistencia de bcrypt');
    process.exit(1);
  }
};

/*******************************************
 *  INICIO DEL SERVIDOR
 *******************************************/
const startServer = async () => {
  try {
    await connectDB();
    await createInitialUser(); // <-- Esta llama a la versión temporal
    
    const PORT = process.env.PORT || 800;
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor listo en http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error('\n❌ Error crítico al iniciar:', error.message);
    process.exit(1);
  }
};

startServer();

/*******************************************
 *  MANEJO DE CIERRE
 *******************************************/
process.on('SIGTERM', () => {
  mongoose.connection.close();
  console.log('\n🛑 Servidor cerrado');
  process.exit(0);
});