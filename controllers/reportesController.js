// Carga el modelo de los registros de trabajo y mongoose para trabajar con la base de datos
const Worklog = require('../models/Worklog');
const mongoose = require('mongoose');

// Función para calcular las horas totales por proyecto
exports.hoursPerProject = async (req, res) => {
  try {
    const match = {}; // Aquí guardamos los filtros para buscar en la base

    // Si se pasa un proyecto por la URL, filtramos solo ese proyecto
    if (req.query.project) match.project = mongoose.Types.ObjectId(req.query.project);

    // Si se pasa un rango de fechas, filtramos por esas fechas
    if (req.query.from || req.query.to) {
      match.date = {}; // Aquí guardamos las fechas para filtrar
      if (req.query.from) match.date.$gte = new Date(req.query.from); // Desde qué fecha
      if (req.query.to) match.date.$lte = new Date(req.query.to); // Hasta qué fecha
    }

    // Agrupamos los datos para sumar las horas por cada proyecto
    const agg = await Worklog.aggregate([
      { $match: match }, // Aplicamos los filtros
      { $group: { _id: '$project', totalHours: { $sum: '$totalHours' } } }, // Sumamos horas por proyecto
      { $lookup: { from: 'projects', localField: '_id', foreignField: '_id', as: 'project' } }, // Buscamos detalles del proyecto
      { $unwind: { path: '$project', preserveNullAndEmptyArrays: true } }, // Desenrollamos el resultado para facilitar la lectura
      { $project: { project: '$project.name', projectCode: '$project.code', totalHours: 1 } } // Mostramos solo los datos necesarios
    ]);

    // Envia los resultados
    res.json(agg);
  } catch (err) {
    // Si hay error, lo mostramos en la consola y enviamos un mensaje
    console.error('hoursPerProject', err);
    res.status(500).json({ msg: err.message });
  }
};

// Función para mostrar cuánto trabajo hizo cada usuario
exports.workloadByUser = async (req, res) => {
  try {
    const match = {}; // Aquí guarda los filtros

    // Si se pasa un rango de fechas, filtramos solo esas fechas
    if (req.query.from || req.query.to) {
      match.date = {};
      if (req.query.from) match.date.$gte = new Date(req.query.from); // Desde qué fecha
      if (req.query.to) match.date.$lte = new Date(req.query.to); // Hasta qué fecha
    }

    // Agrupamos las horas totales por cada usuario
    const agg = await Worklog.aggregate([
      { $match: match }, // Aplicamos los filtros
      { $group: { _id: '$user', totalHours: { $sum: '$totalHours' } } }, // Sumamos horas por usuario
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } }, // Buscamos datos del usuario
      { $unwind: '$user' }, // Desenrollamos para facilitar la lectura
      { $project: { user: '$user.name', email: '$user.email', totalHours: 1 } } // Mostramos solo lo necesario
    ]);

    // Envia los resultados
    res.json(agg);
  } catch (err) {
    // Si hay error, lo mostramos en la consola y muestra un mensaje
    console.error('workloadByUser', err);
    res.status(500).json({ msg: err.message });
  }
};