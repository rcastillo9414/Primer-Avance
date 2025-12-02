const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/reportesController');

// Reporte: total de horas por proyecto
router.get('/hours-per-project', auth, ctrl.hoursPerProject);

// Reporte: productividad por usuario
router.get('/productivity-per-user', auth, ctrl.productivityPerUser);

module.exports = router;
