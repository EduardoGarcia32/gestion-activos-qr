const admin = require('firebase-admin');

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
};