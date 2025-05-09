const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Ejemplo de ruta de login
router.post('/login', (req, res) => {
  // Validar credenciales...
  const token = jwt.sign(
    { userId: '123' }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );
  res.json({ token });
});

module.exports = router;