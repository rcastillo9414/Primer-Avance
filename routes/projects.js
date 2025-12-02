// Entrega-Final/routes/projects.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/projectsController');

// Roles permitidos para gestión de proyectos
const adminRoles = ['Administrativo', 'ATH', 'Dept IT'];

// Obtener todos los proyectos (permiso para todos los roles autenticados)
router.get('/', auth, ctrl.getAll);

// Obtener proyecto por ID (para todos)
router.get('/:id', auth, ctrl.getById);

// Crear proyecto (solo admins)
router.post('/', auth, (req, res, next) => {
  if (!adminRoles.includes(req.user.role)) {
    return res.status(403).json({ msg: 'No autorizado para crear proyectos' });
  }
  next();
}, ctrl.create);

// Actualizar proyecto
router.put('/:id', auth, (req, res, next) => {
  if (!adminRoles.includes(req.user.role)) {
    return res.status(403).json({ msg: 'No autorizado para actualizar proyectos' });
  }
  next();
}, ctrl.update);

// Eliminar proyecto
router.delete('/:id', auth, (req, res, next) => {
  if (!adminRoles.includes(req.user.role)) {
    return res.status(403).json({ msg: 'No autorizado para eliminar proyectos' });
  }
  next();
}, ctrl.remove);

module.exports = router;
