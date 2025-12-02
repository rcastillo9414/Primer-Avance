const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const ctrl = require("../controllers/vacacionesController");

router.post("/", auth, ctrl.create);
router.get("/", auth, ctrl.list);

router.get("/pending", auth, role("Administrativo", "ATH"), ctrl.listPending);
router.patch("/:id/approve", auth, role("Administrativo", "ATH"), ctrl.approve);
router.patch("/:id/reject", auth, role("Administrativo", "ATH"), ctrl.reject);

module.exports = router;
