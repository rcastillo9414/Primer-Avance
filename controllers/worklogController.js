// Entrega-Final/controllers/worklogController.js
const Worklog = require("../models/Worklog");
const Project = require("../models/Project");

exports.getMine = async (req, res) => {
  try {
    const logs = await Worklog.find({ user: req.user.id })
      .populate("project", "name")
      .lean();

    res.json(logs);

  } catch (err) {
    console.error("Error getMine:", err);
    res.status(500).json({ msg: "Error obteniendo tus registros" });
  }
};

exports.create = async (req, res) => {
  try {
    const { project, date, activities, notes } = req.body;

    if (!project || !date || !activities || activities.length === 0) {
      return res.status(400).json({ msg: "Campos incompletos" });
    }

    // Validar proyecto
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    // Normalizar actividades
    const normalizedActivities = activities.map(a => {
      let st = (a.status || "").toLowerCase();

      // Normalización
      if (["completado", "finalizado", "completo", "hecho"].includes(st)) {
        st = "completado";
      } else if (["en proceso", "en_proceso", "proceso"].includes(st)) {
        st = "en_proceso";
      } else if (["bloqueado", "detenido"].includes(st)) {
        st = "bloqueado";
      } else {
        st = "en_proceso"; // valor por defecto seguro
      }

      return {
        description: a.description,
        hours: Number(a.hours),
        status: st
      };
    });

    const wl = await Worklog.create({
      user: req.user.id,
      project,
      date,
      activities: normalizedActivities,
      notes
    });

    res.status(201).json(wl);

  } catch (err) {
    console.error("Error create Worklog:", err);
    res.status(500).json({ msg: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const wl = await Worklog.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!wl) return res.status(404).json({ msg: "Registro no encontrado" });

    res.json({ msg: "Worklog eliminado" });

  } catch (err) {
    console.error("Error remove:", err);
    res.status(500).json({ msg: "Error eliminando registro" });
  }
};
