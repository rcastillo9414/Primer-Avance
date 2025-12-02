const mongoose = require('mongoose');

const VacacionesSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startDate: Date,
  endDate: Date,
  totalDays: Number,
  status: {
    type: String,
    enum: ["Pendiente", "Aprobado", "Rechazado"],
    default: "Pendiente"
  }
});

module.exports = mongoose.model("Vacaciones", VacacionesSchema);