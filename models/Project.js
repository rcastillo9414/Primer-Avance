const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({ // define un esquema para projectos 
    name: {type: String, required: true}, // Nombre del projecto
    code: {type: String, reqiired: true, unique: true }, // Codigo unico del projecto 
    description: {type: String }, //Descripcion del projecto 
    budget: { type: Number, default: 0 }, //presupuesto asignado al projecto 
    resources: { type: Number, default: 0}, // recursos asignados al projecto 
    members: [{type: moongoose.Schema.Types.ObjectId, ref: 'User' }], // Miembros trabajando en el projecto 
    CreatedBy: { type: moongoose.Schema.Types.ObjectId, ref: 'User' },  //Usuario que creo el projecto 
    CreatedAt: { type: Date, default: Date.now } // Fecha en la que fue creado el projecto 
});

module.exports = moongoose.model('Project', ProjectSchema) // Exporta el modelo de proyecto basado en el modelo definido 