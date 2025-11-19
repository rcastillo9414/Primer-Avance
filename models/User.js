// Facilita el guardar, verificar y administrar la informacion de los usuarion en la base de datos, se guarda la informacion de manera ordenada y segura.

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, 
  role: { type: String, enum: ['Administrtivo','Programador','Dept IT'], default: 'Programador' }, // los roles disponibles para cada usuario
  createdAt: { type: Date, default: Date.now } // nos da la fecha en que el usuario fue creado
});

module.exports = mongoose.model('Usuario', UserSchema);
