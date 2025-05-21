const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getDashboardStats } = require('../services/dashboardService');

// Ruta protegida para obtener estadísticas
router.get('/', protect, async (req, res) => {  // Corregido: requestAnimationFrame → req
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

