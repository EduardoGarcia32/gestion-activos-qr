const { sendMaintenanceAlert } = require('../controllers/notificationController');

router.post('/:assetNumber/maintenance', async (req, res) => {
  try {
    const asset = await Asset.findOne({ assetNumber: req.params.assetNumber });
    await sendMaintenanceAlert(asset.userDeviceToken, asset.assetNumber); // Envía notificación
    res.status(201).json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});