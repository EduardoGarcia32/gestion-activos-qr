const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Validación de campos (con logs para depuración)
    console.log('📥 Credenciales recibidas:', { email, password: password ? '***masked***' : null });
    
    if (!email || !password) {
      console.log('⚠️ Faltan credenciales');
      return res.status(400).json({ 
        success: false,
        message: 'Email y contraseña son requeridos' 
      });
    }

    // 2. Buscar usuario (con password incluido)
    console.log('🔍 Buscando usuario en BD...');
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

router.get('/status', (req, res) => {
  res.json({ 
    status: 'active',
    message: 'API de autenticación funcionando'
    });
    });

    // 3. Comparación de contraseñas (con log seguro)
    console.log('🔑 Comparando contraseñas...');
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('❌ Contraseña no coincide');
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

    // 4. Generación de token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '1h' }
    );

    // 5. Respuesta exitosa (con log sin datos sensibles)
    console.log('✅ Login exitoso para usuario:', user.email);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('🔥 Error en login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; // Esta línea es crucial
