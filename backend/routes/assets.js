const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');
const QRCode = require('qrcode');  // Importar librería QR

// GET /api/assets (listar todos)
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
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