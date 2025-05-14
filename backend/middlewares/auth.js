const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// En auth.js, añade:
router.get('/login', (req, res) => {
  res.status(405).json({ message: 'Método no permitido. Use POST' });
});

// Ruta actualizada: /api/auth/login
router.post('/api/auth/login', (req, res) => {
  const token = jwt.sign(
    { userId: 'Admin' }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );
  res.json({ token });
});

module.exports = router;