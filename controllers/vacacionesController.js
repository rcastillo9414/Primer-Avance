// Importa el modelo de datos de solicitudes de vacaciones
const VacationRequest = require('../models/Vacaciones');

// Función para crear una nueva solicitud de vacaciones
exports.createRequest = async (req, res) => {
  try {
    const userID = req.user.id; // Obtiene el ID del usuario autenticado
    const { startDate, endDate, reason } = req.body; // Extrae datos del cuerpo de la solicitud

    // Verifica que las fechas de inicio y fin estén presentes
    if (!startDate || !endDate) 
      return res.status(400).json({ msg: 'Fechas requeridas' });

    // Convierte las fechas en objetos Date para comparación
    const sd = new Date(startDate);
    const ed = new Date(endDate);

    // Verifica que la fecha final sea mayor que la inicial
    if (ed < sd) 
      return res.status(400).json({ msg: 'Fecha final debe ser mayor a la inicial' });

    // Calcula la cantidad de días entre las fechas (incluyendo ambos días)
    const days = Math.ceil((ed - sd) / (1000 * 60 * 60 * 24)) + 1;

    // Crea la solicitud en la base de datos
    const vr = await VacationRequest.create({
      user: userID,
      startDate,
      endDate,
      days,
      reason
    });

    // Responde con la solicitud creada y código 201 (creado)
    res.status(201).json(vr);
  } catch (err) {
    // En caso de error, responde con código 500 y el mensaje del error
    res.status(500).json({ msg: err.message });
  }
};

// Función para obtener las solicitudes del usuario autenticado
exports.getMyRequest = async (req, res) => {
  try {
    // Busca todas las solicitudes del usuario y las ordena por fecha de creación (más recientes primero)
    const list = await VacationRequest.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(list); // Devuelve la lista en formato JSON
  } catch (err) {
    res.status(500).json({ msg: err.message }); // En caso de error
  }
};

// Función para obtener todas las solicitudes que están pendientes de revisión
exports.getPending = async (req, res) => {
  try {
    // Busca solicitudes con estado 'PENDING' y "rellena"  datos del usuario (nombre y email)
    const list = await VacationRequest.find({ status: 'PENDING' }).populate('user','name email');
    res.json(list); // Devuelve la lista
  } catch (err) {
    res.status(500).json({ msg: err.message }); // En caso de error
  }
};

// Función para revisar y cambiar el estado de una solicitud (aprobada o rechazada)
exports.reviewRequest = async (req, res) => {
  try {
    const { id } = req.params; // ID de la solicitud a revisar
    const { action } = req.body; // Acción deseada: 'Aprobada' o 'Rechazada'

    // Busca la solicitud por ID
    const vr = await VacationRequest.findById(id);
    if (!vr) return res.status(404).json({ msg: 'No encontrado' }); // No existe la solicitud

    // Solo se puede revisar si está en estado 'PENDING'
    if (vr.status !== 'PENDING') return res.status(400).json({ msg: 'Ya procesado' });

    // Actualiza el estado según la acción
    if (action === 'Aprobada') vr.status = 'Aprovada';
    else if (action === 'Rechazada') vr.status = 'Rechazada';
    else return res.status(400).json({ msg: 'Acción inválida' }); // Acción desconocida

    // Registra quién revisó y cuándo
    vr.reviewedBy = req.user.id;
    vr.reviewedAt = new Date();

    // Guarda los cambios en la base de datos
    await vr.save();

    // Devuelve la solicitud actualizada
    res.json(vr);
  } catch (err) {
    res.status(500).json({ msg: err.message }); // En caso de error
  }
};

// Exporta las funciones para que puedan usarse en otras partes del proyecto
module.exports = {
  createRequest: exports.createRequest,
  getMyRequest: exports.getMyRequest,
  getPending: exports.getPending,
  reviewRequest: exports.reviewRequest
};