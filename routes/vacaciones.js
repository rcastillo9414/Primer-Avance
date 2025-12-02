const express = require('express');
const router = express.Router();

// IMPORTACIÓN  DEL MIDDLEWARE
const authMiddleware = require('../../Entrega-Final/middleware/auth');

// IMPORTACIÓN  DEL CONTROLLER
const vacacionesController = require('../controllers/vacacionesController');

// ===== RUTAS  ASIGNADAS =====

// Crear solicitud
router.post('/', authMiddleware, vacacionesController.createRequest);

// Ver solicitudes del usuario
router.get('/me', authMiddleware, vacacionesController.getMyRequest);

// Ver solicitudes pendientes (solo admin/ATH)
router.get('/pending', authMiddleware, vacacionesController.getPending);

// Revisar (aprobar/rechazar) una solicitud
router.put('/:id/review', authMiddleware, vacacionesController.reviewRequest);

module.exports = router;
