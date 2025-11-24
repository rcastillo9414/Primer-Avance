const mongoose = require("moongose"); // Importa para trabajar con MongoDB

// Define como se creara la actividad, agregando descripcion, numero de horas, y registro de proceso
const ActivitySchema = new mongoose.Schema({ 
    description: { 
        type: String, 
        require: true
    },
    hours: { 
        type: Number, 
        required: true,
        min: 0
    }, 
    status: { 
        type: String, 
        enum: [ "COMPLETADO", "EN_PROCESO", "BLOQUEADO"],
        default: "EN_PROCESO"
    }
}, {_id: false }); 

// Define el registro de trabajo ( worklog )

const WorklogSchema = new mongoose.Schema ({ 
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
        default: [ ]
    }, 
    notes: { 
        type: String 
    }
}, { timestamps: true }); // Añade de manera automatica la fecha cuando es creado o modificado

WorklogSchema.pre("save", function(next) { 
    // Suma las horas de las actividades y las guarda en horas totales 
    this.totalHours = this.activities.reduce((t, a) => + a.hours, o); 
    next(); // Sigue con el paso de guardar
}); 

// Permite exportar el modelo para usar en otros lugares  
module.exports = mongoose.model("Worklog", WorklogSchema); 

