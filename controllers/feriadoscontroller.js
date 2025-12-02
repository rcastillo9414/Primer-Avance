const Holiday = require('../models/Feriados');

// Crear feriado
exports.createHoliday = async (req, res) => {
  try {
    const { name, date } = req.body;

    if (!name || !date)
      return res.status(400).json({ msg: "Nombre y fecha obligatorios" });

    const exists = await Holiday.findOne({ date: new Date(date) });
    if (exists)
      return res.status(400).json({ msg: "Ya existe un feriado en esa fecha" });

    const h = await Holiday.create({
      name,
      date,
      createdBy: req.user.id
    });

    res.status(201).json(h);
  } catch (err) {
    console.error("createHoliday", err);
    res.status(500).json({ msg: err.message });
  }
};

// Obtener feriados
exports.getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 });
    res.json(holidays);
  } catch (err) {
    console.error("getHolidays", err);
    res.status(500).json({ msg: err.message });
  }
};

// Actualizar feriado
exports.updateHoliday = async (req, res) => {
  try {
    const { id } = req.params;

    const h = await Holiday.findByIdAndUpdate(id, req.body, { new: true });

    if (!h)
      return res.status(404).json({ msg: "Feriado no encontrado" });

    res.json(h);
  } catch (err) {
    console.error("updateHoliday", err);
    res.status(500).json({ msg: err.message });
  }
};

// Eliminar feriado
exports.deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;

    const h = await Holiday.findByIdAndDelete(id);

    if (!h)
      return res.status(404).json({ msg: "Feriado no encontrado" });

    res.json({ msg: "Feriado eliminado" });
  } catch (err) {
    console.error("deleteHoliday", err);
    res.status(500).json({ msg: err.message });
  }
};
