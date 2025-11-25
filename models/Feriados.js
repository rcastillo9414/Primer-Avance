// Importa mongoose para trabajar con MongoDB
const mongoose = require('mongoose');

// Define el esquema para los días festivos (Holiday)
const HolidaySchema = new mongoose.Schema({ 
    name: { 
        type: String, // El nombre del día festivo
        require: true // Es obligatorio que tenga un nombre
    }, 
    date: { 
        type: Date, // La fecha del día festivo
        require: true, // Es obligatorio que tenga una fecha
        unique: true // La fecha debe ser única, no puede haber dos días festivos en la misma fecha
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, // ID del usuario que creó el festivo
        ref: 'User' // Referencia al modelo User (usuarios)
    } 
}, {timestamps: true }); // Agrega automáticamente fecha de creación y actualización

// Exporta  el modelo "feriados" basado en este esquema
module.exports = mongoose.model('Holiday', HolidaySchema);