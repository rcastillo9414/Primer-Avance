const Project = require('../models/Project');
const User = require('../models/User');

/* Obtener todos los proyectos */
exports.getAll = async (req, res) => {
  try {
    const list = await Project.find()
      .populate("members", "name email")
      .lean();

    res.json(list);

  } catch (err) {
    console.error("getAllProjects ERROR:", err);
    res.status(500).json({ msg: "Error al obtener proyectos" });
  }
};

/* Obtener un proyecto por ID */
exports.getById = async (req, res) => {
  try {
    const p = await Project.findById(req.params.id)
      .populate("members", "name email");

    if (!p) 
      return res.status(404).json({ msg: "Proyecto no encontrado" });

    res.json(p);

  } catch (err) {
    res.status(500).json({ msg: "Error al obtener proyecto" });
  }
};

/* Crear proyecto */
exports.create = async (req, res) => {
  try {
    const { name, code, description, budget, resources } = req.body;

    if (!name || !code)
      return res.status(400).json({ msg: "Nombre y código son obligatorios" });

    // Evitar códigos duplicados
    const existing = await Project.findOne({ code });
    if (existing)
      return res.status(400).json({ msg: "El código ya está registrado" });

    const p = await Project.create({
      name,
      code,
      description: description || "",
      budget: budget || 0,
      resources: resources || 0,
      members: [],           // Inicializa miembros vacíos
      createdBy: req.user.id // Guarda quién creó el proyecto
    });

    res.status(201).json(p);

  } catch (err) {
    console.error("CreateProject ERROR:", err);
    res.status(500).json({ msg: "Error al crear proyecto" });
  }
};

/* Actualizar proyecto*/
exports.update = async (req, res) => {
  try {
    // PROTECCIÓN: Evitar que editen campos no permitidos
    const updateData = { ...req.body };
    delete updateData.createdBy;
    delete updateData.members; // miembros se actualizan en otra ruta

    const p = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!p)
      return res.status(404).json({ msg: "Proyecto no encontrado" });

    res.json(p);

  } catch (err) {
    res.status(500).json({ msg: "Error al actualizar proyecto" });
  }
};

/* Eliminar proyecto*/
exports.remove = async (req, res) => {
  try {
    const p = await Project.findByIdAndDelete(req.params.id);

    if (!p)
      return res.status(404).json({ msg: "Proyecto no encontrado" });

    res.json({ msg: "Proyecto eliminado" });

  } catch (err) {
    res.status(500).json({ msg: "Error al eliminar proyecto" });
  }
};

/*  Asignar programadores al proyecto */
exports.updateMembers = async (req, res) => {
  try {
    const { members } = req.body;

    if (!Array.isArray(members))
      return res.status(400).json({ msg: "El campo 'members' debe ser un array" });

    // Convertir correos → IDs (si vienen como correos)
    const users = await User.find({ email: { $in: members } });

    const userIDs = users.map(u => u._id);

    const p = await Project.findByIdAndUpdate(
      req.params.id,
      { members: userIDs },
      { new: true }
    ).populate("members", "name email");

    if (!p)
      return res.status(404).json({ msg: "Proyecto no encontrado" });

    res.json({
      msg: "Miembros actualizados",
      project: p
    });

  } catch (err) {
    console.error("updateMembers ERROR:", err);
    res.status(500).json({ msg: "Error al actualizar miembros" });
  }
};
