// Importamos mongoose para trabajar con MongoDB
const mongoose = require('mongoose');

// Definimos el esquema para las solicitudes de vacaciones
const VacationRequestSchema = new mongoose.Schema({
  // ID del usuario que hace la solicitud (referencia a modelo User)
  user: { 
    type: mongoose.Schema.Types.ObjectId, // ID del usuario
    ref: 'User', // Referencia al modelo User
    required: true // Es obligatorio que tenga un usuario
  },
  // Fecha de inicio de las vacaciones
  startDate: { 
    type: Date, 
    required: true 
  },
  // Fecha de fin de las vacaciones
  endDate: { 
    type: Date, 
    required: true 
  },
  // Número de días solicitados
  days: { 
    type: Number, 
    required: true 
  },
  // Razón de la solicitud (opcional)
  reason: { 
    type: String // Texto con la razón
  },
  // Estado de la solicitud: pendiente, aprobada o rechazada
  status: { 
    type: String, 
    enum: ['Pendiente','Aprovada','Rechazada'], 
    default: 'Pendiente' 
  },
  // ID del usuario que revisó la solicitud (puede ser indefinida si aún no se revisa)
  reviewedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  // Fecha en que fue revisada la solicitud
  reviewedAt: { 
    type: Date // Fecha de revisión
  }
}, { timestamps: true }); // Agrega  automáticamente campos de creación y actualización

// Exportamos el modelo "VacationRequest" basado en este esquema
module.exports = mongoose.model('VacationRequest', VacationRequestSchema);