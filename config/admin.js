/**
 * Script de inicialización para crear el usuario raíz ATH del sistema
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function seedATH() {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ ERROR: Falta MONGO_URI en .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔌 Conectado a MongoDB para creación del usuario ATH");

    // Buscar usuario ATH existente
    const exists = await User.findOne({ role: 'ATH' });

    if (exists) {
      console.log("⚠ Ya existe un usuario ATH. No se creará otro.");
      process.exit();
    }

    // Crear usuario principal ATH
    const passwordHash = await bcrypt.hash("Admin1234!", 10);

    const rootATH = await User.create({
      name: "Administrador del Sistema",
      email: "admin@rikimaka.com",
      password: passwordHash,
      role: "ATH"
    });

    console.log("✅ Usuario raíz ATH creado correctamente:");
    console.log("   Email: admin@rikimaka.com");
    console.log("   Password: Admin1234!");

    process.exit(0);

  } catch (err) {
    console.error("❌ Error creando usuario ATH:", err.message);
    process.exit(1);
  }
}

seedATH();
