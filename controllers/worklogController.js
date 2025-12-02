const Worklog = require("../models/Worklog");
const Project = require("../models/Project");

// Verifica si un proyecto existe
async function ensureProjectExist(id) {
  const exists = await Project.findById(id);
  if (!exists) throw new Error("Proyecto no encontrado");
}

// Crear Worklog
exports.createWorklog = async (req, res) => {
  try {
    const userId = req.user.id;  // ID correcto del usuario
    const { project, date, activities, notes } = req.body;

    if (!project || !date)
      return res.status(400).json({ msg: "Proyecto y fecha son necesarios" });

    await ensureProjectExist(project);

    const log = new Worklog({
      user: userId,
      project,
      date,
      activities,
      notes
    });

    await log.save();
    res.status(201).json(log);

  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// Obtener worklogs del usuario autenticado
exports.getMyWorklogs = async (req, res) => {
  try {
    const logs = await Worklog.find({ user: req.user.id })
      .populate("project", "name")
      .sort({ date: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Obtener Worklog por ID
exports.getWorklogById = async (req, res) => {
  try {
    const log = await Worklog.findById(req.params.id)
      .populate("user", "name email")
      .populate("project", "name");

    if (!log)
      return res.status(404).json({ msg: "No se encontró el registro" });

    const isOwner = String(log.user._id) === req.user.id;
    const isAdmin = req.user.role === "ATH" || req.user.role === "IT";

    if (!isOwner && !isAdmin)
      return res.status(403).json({ msg: "Acceso no autorizado" });

    res.json(log);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Actualizar Worklog
exports.updateWorklog = async (req, res) => {
  try {
    const log = await Worklog.findById(req.params.id);
    if (!log)
      return res.status(404).json({ msg: "No se encontró registro" });

    const isOwner = String(log.user) === req.user.id;
    const isAdmin = req.user.role === "ATH" || req.user.role === "IT";

    if (!isOwner && !isAdmin)
      return res.status(403).json({ msg: "Acceso no autorizado" });

    const { activities, notes, date } = req.body;

    if (activities) log.activities = activities;
    if (notes) log.notes = notes;
    if (date) log.date = date;

    await log.save();
    res.json(log);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Eliminar Worklog
exports.deleteWorklog = async (req, res) => {
  try {
    const log = await Worklog.findById(req.params.id);
    if (!log)
      return res.status(404).json({ msg: "No se encontró el registro" });

    const isOwner = String(log.user) === req.user.id;
    const isAdmin = req.user.role === "ATH" || req.user.role === "IT";

    if (!isOwner && !isAdmin)
      return res.status(403).json({ msg: "Acceso no autorizado" });

    await log.deleteOne();
    res.json({ msg: "Registro eliminado" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
