const Vacaciones = require("../models/Vacaciones");
const User = require("../models/User");

// Crear solicitud
exports.create = async (req, res) => {
  try {
    const { startDate, endDate, totalDays } = req.body;

    const vac = await Vacaciones.create({
      user: req.user.id,
      startDate,
      endDate,
      totalDays,
      status: "Pendiente"
    });

    res.json(vac);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Listar solicitudes del usuario
exports.list = async (req, res) => {
  const vac = await Vacaciones.find({ user: req.user.id });
  res.json(vac);
};

// Solicitudes pendientes (administrador)
exports.listPending = async (req, res) => {
  const vac = await Vacaciones.find({ status: "Pendiente" }).populate("user", "name email");
  res.json(vac);
};

// Aprobar
exports.approve = async (req, res) => {
  try {
    await Vacaciones.findByIdAndUpdate(req.params.id, { status: "Aprobado" });
    res.json({ msg: "Solicitud aprobada correctamente" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Rechazar
exports.reject = async (req, res) => {
  try {
    await Vacaciones.findByIdAndUpdate(req.params.id, { status: "Rechazado" });
    res.json({ msg: "Solicitud rechazada correctamente" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
