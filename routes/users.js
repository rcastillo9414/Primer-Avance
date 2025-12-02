const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const ctrl = require('../controllers/usersController');

// Crear usuario (solo ATH o Administrativo)
router.post('/', auth, role("ATH", "Administrativo", "Dept IT", "Programador"), ctrl.create);

module.exports = router;
