// Entrega-Final/routes/worklogs.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/worklogController");

// Obtener mis worklogs
router.get("/me", auth, ctrl.getMine);

// Crear worklog (permitido para cualquier usuario autenticado)
router.post("/", auth, ctrl.create);

// Eliminar mi worklog
router.delete("/:id", auth, ctrl.remove);

module.exports = router;
