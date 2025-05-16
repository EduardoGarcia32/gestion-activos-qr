const express = require('express');
const testApp = express();
testApp.use(express.json());

testApp.post('/api/auth/login', (req, res) => {
  res.json({ success: true, message: "¡Ruta de prueba funciona!" });
});

testApp.listen(5000, () => console.log('🟢 Servidor TEST en http://localhost:5000'));