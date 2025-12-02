// Facilita el guardar, verificar y administrar la informacion de los usuarion en la base de datos, se guarda la informacion de manera ordenada y segura.

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Administrativo', 'Programador', 'Dept IT', 'ATH'], 
    default: 'Programador' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
