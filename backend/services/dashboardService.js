const Asset = require('../models/Asset');

const getDashboardStats = async () => {
  try {
    const [totalAssets, activeAssets] = await Promise.all([
      Asset.countDocuments(),
      Asset.countDocuments({ status: 'active' })
    ]);
  
return {
      totalAssets,
      activeAssets,
      inactiveAssets: totalAssets - activeAssets,
      qrCodesGenerated: totalAssets,
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Error en dashboard service:', error);
    throw error; // Para manejar el error en la ruta
  }
};

module.exports = { getDashboardStats };

