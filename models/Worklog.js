const mongoose = require("mongoose"); // Importa Mongoose correctamente

// Define el esquema de actividades
const ActivitySchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true
    },
    hours: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ["COMPLETADO", "EN_PROCESO", "BLOQUEADO"],
      default: "EN_PROCESO"
    }
  },
  { _id: false }
);

// Define el esquema principal Worklog
const WorklogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    activities: {
      type: [ActivitySchema],
      default: []
    },
    notes: {
      type: String
    },
    totalHours: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Middleware para calcular total de horas
WorklogSchema.pre("save", function (next) {
  this.totalHours = this.activities.reduce((t, a) => t + a.hours, 0);
  next();
});

// Exportar modelo
module.exports = mongoose.model("Worklog", WorklogSchema);
