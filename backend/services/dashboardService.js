const Asset = require('../models/Asset');

const getDashboardStats = async () => {
  const totalAssets = await Asset.countDocuments();
  const activeAssets = await Asset.countDocuments({ status: 'active' });
  
  return {
    totalAssets,
    activeAssets,
    inactiveAssets: totalAssets - activeAssets,
    qrCodesGenerated: totalAssets // Ejemplo básico
  };
};

module.exports = { getDashboardStats };

