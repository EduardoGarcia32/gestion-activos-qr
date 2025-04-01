const express = require('express');
const mongoose = require('mongoose'); // 👈 1. Importa mongoose
const app = express();
const assetRoutes = require('./routes/assets');

// 👇 2. Conexión a MongoDB (¡Añade esto!)
mongoose.connect('mongodb://127.0.0.1:27017/gestion-activos', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Timeout de 5 segundos
})
.then(() => console.log('✅ Conectado a MongoDB')) // Mensaje de éxito
.catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/assets', assetRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Backend de gestión de activos');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`); // 👈 3. Corrige el template string
});