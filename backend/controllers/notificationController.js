const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { getDashboardStats } = require('../services/dashboardService');

router.get('/', protect, async (req, res) => {  // Cambiado: requestAnimationFrame → req
    try {
        const stats = await getDashboardStats();
        res.json({
            success: true,
            data: stats,  // Corregido: date → data
            user: req.user // Información del usuario autenticado
        });
    } catch(error) {
        console.error('Error en dashboard', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas'
        });
    }
});

module.exports = router;

/*const admin = require('firebase-admin');

// Configura Firebase Admin SDK.
admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-service-account.json')),
});

// Función para enviar notificaciones
exports.sendMaintenanceAlert = async (deviceToken, assetNumber) => {
  const message = {
    notification: {
      title: 'Mantenimiento requerido',
      body: `El activo ${assetNumber} necesita mantenimiento preventivo.`,
    },
    token: deviceToken,
  };

  try {
    await admin.messaging().send(message);
    console.log('Notificación enviada');
  } catch (err) {
    console.error('Error al enviar notificación:', err);
  }
};*/