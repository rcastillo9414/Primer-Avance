// Carga la libreria de express para crear rutas 
const express = require('express');
const router = express.Router(); // Nos ayuda a definir las rutas 

// carga middleware para verificar los roles 

const auth = require('../middleware/auth'); 
const role = require('../middleware/role'); 

// carga el control que maneja las funciones con solicitudes de vacaciones
const ctrl = require('../controllers/feriadoscontroller'); 

// Rutas para creacion de dias feriados 

router.post('/', auth, role('Administrativo'), ctrl.createHoliday);
router.get('/', auth, ctrl.getHolidays);
router.put('/:id', auth, role('Administrativo'),ctrl.updateHoliday);
router.delete('/:id', auth, role('Administrativo'), ctrl.deleteHoliday);

// Exporta las rutas para que pueda usarse en otras partes 
module.exports = router; 
