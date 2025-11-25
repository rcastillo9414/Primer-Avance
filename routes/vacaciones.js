
const express = require('express'); // Traemos la librería express
const router = express.Router(); // Creamos un "camino" para organizar las rutas

// Aquí se conectan funciones que verifican si la persona está autentificada (auth) y qué rol tiene (por ejemplo, trabajador o autoridad)
const auth = require('../middleware/auth'); // Verifica si la persona está logueada
const role = require('../middleware/role'); // Verifica qué rol tiene la persona
const ctrl = require('../controllers/vacacionesControler'); // Aquí están las funciones que hacen lo que se pide (crear, ver, revisar solicitudes)

// Rutas para los trabajadores:
//  Crear una solicitud de vacaciones (solo si están logueados y son trabajadores)
router.post('/', auth, role('Programador'), ctrl.createRequest);

// Ver las solicitudes que ellos mismos han hecho
router.get('/me', auth, role('Programador'), ctrl.getMyRequests);

// Rutas para la autoridad (ATH):
// Ver todas las solicitudes pendientes de revisión
router.get('/pending', auth, role('Administrativo'), ctrl.getPending);

// Revisar y aprobar o rechazar una solicitud específica
router.post('/:id/review', auth, role('Administrativo'), ctrl.reviewRequest);

// Esto permite que otras partes del programa puedan usar estas rutas
module.exports = router;