const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');
const QRCode = require('qrcode');  // Importar librería QR
const { protect } = require('../middlewares/authMiddleware');
const { getAllAssets, createAssetWithQR, getAssetByNumber, getAssetQR } = require('../controllers/assetController');

// Rutas protegidas
router.get('/', protect, getAllAssets);
router.post('/', protect, createAssetWithQR);

// Nuevas rutas para detalles y QR
router.get('/:assetNumber', protect, getAssetByNumber);
router.get('/:assetNumber/qr', protect, getAssetQR);


// GET /api/assets (listar todos)
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json({
      success: true,
      data: assets
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los assets'
    });
  }
});

// POST /api/assets (Crear nuevo activo con QR)
router.post('/', async (req, res) => {
  try {
    const { assetNumber, type, model } = req.body;

    // 1. Generar código QR (en formato base64)
    const qrCode = await QRCode.toDataURL(assetNumber);

    // 2. Crear documento con el QR
    const asset = new Asset({
      assetNumber,
      type,
      model,
      qrCode  // Guardar el QR generado
    });

    // 3. Guardar en MongoDB
    await asset.save();

    // 4. Responder con los datos del activo (incluyendo QR)
    res.status(201).json({
      message: "Activo creado exitosamente",
      asset: asset
    });

  } catch (err) {
    // Manejo de errores
    if (err.code === 11000) {
      res.status(400).json({ error: "El número de activo ya existe" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

module.exports = router;