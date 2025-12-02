// Carga la libreria de express para crear rutas 
const express = require('express');
const router = express.Router();

// middleware de autenticación
const auth = require('../middleware/auth');

// middleware que acepta múltiples roles
const roleAny = require('../middleware/roleAny');

// controlador de feriados
const ctrl = require('../controllers/feriadoscontroller');

// Crear feriado (solo ATH y Administrativo)
router.post('/', auth, roleAny('ATH', 'Administrativo'), ctrl.createHoliday);

// Listar feriados (todos los roles autenticados)
router.get('/', auth, ctrl.getHolidays);

// Actualizar feriado (solo ATH y Administrativo)
router.put('/:id', auth, roleAny('ATH', 'Administrativo'), ctrl.updateHoliday);

// Eliminar feriado (solo ATH y Administrativo)
router.delete('/:id', auth, roleAny('ATH', 'Administrativo'), ctrl.deleteHoliday);

module.exports = router;
