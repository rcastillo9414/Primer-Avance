const express = require("express"); // Importa Express para crear rutas
const router = express.Router(); // Crea un router para manejar las rutas de trabajo

// Importa middleware que verifica si el usuario está autorizado
const auth = require("../middleware/auth");

// Importa las funciones que controlan las operaciones sobre los registros de trabajo
const ctrl = require("../controllers/worklogController");

// Ruta para crear un nuevo registro de trabajo
// Solo accesible si el usuario está autorizado
router.post("/", auth, ctrl.createWorklog);

// Ruta para obtener los registros de trabajo del usuario que ha iniciado sesión
// Solo accesible si el usuario está autorizado
router.get("/me", auth, ctrl.getMyWorklogs);

// Ruta para obtener un registro de trabajo específico por su ID
// Solo accesible si el usuario está autorizado
router.get("/:id", auth, ctrl.getWorklogById);

// Ruta para actualizar un registro de trabajo existente por su ID
// Solo accesible si el usuario está autorizado
router.put("/:id", auth, ctrl.updateWorklog);

// Ruta para eliminar un registro de trabajo por su ID
// Solo accesible si el usuario está autorizado
router.delete("/:id", auth, ctrl.deleteWorklog);

// Exporta las rutas para que puedan ser usadas en la app
module.exports = router;