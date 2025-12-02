// Entrega-Final/models/Worklog.js
const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  description: { type: String, required: true },
  hours: { type: Number, required: true, min: 0 },

  // Estado actualizado y unificado
  status: {
    type: String,
    enum: ["completado", "en_proceso", "bloqueado"],
    default: "en_proceso"
  }
}, { _id: false });

const WorklogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  date: { type: Date, required: true },

  activities: {
    type: [ActivitySchema],
    required: true,
    validate: v => v.length > 0
  },

  notes: String,

  totalHours: { type: Number, default: 0 }
}, { timestamps: true });

// Calcular total de horas automáticamente
WorklogSchema.pre("save", function (next) {
  this.totalHours = this.activities.reduce((t, a) => t + a.hours, 0);
  next();
});

// También recalcular en findOneAndUpdate
WorklogSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.activities) {
    update.totalHours = update.activities.reduce((t, a) => t + a.hours, 0);
  }

  next();
});

module.exports = mongoose.model("Worklog", WorklogSchema);
