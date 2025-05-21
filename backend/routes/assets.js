const express = require('express');
const router = express.Router();
const { 
  getAllAssets,
  createAssetWithQR,
  getAssetByNumber,
  getAssetQR,
  updateAsset,
  deleteAsset
} = require('../controllers/assetController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/authorize');

// Ruta para listar y crear activos
router.route('/')
  .get(protect, getAllAssets)
  .post(protect, authorize('admin', 'manager'), createAssetWithQR);

// Ruta para operaciones con ID
router.route('/:id')
  .get(protect, getAssetByNumber) // Nota: Cambié esto para consistencia
  .put(protect, authorize('admin', 'manager'), updateAsset)
  .delete(protect, authorize('admin'), deleteAsset);

// Ruta específica para QR
router.get('/:assetNumber/qr', protect, getAssetQR);

module.exports = router;