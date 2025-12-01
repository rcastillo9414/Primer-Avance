require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // usa tu modelo real de usuarios

async function seedATH() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB para cargar usuario ATH inicial");

    // Revisa si ya existe un ATH
    const exists = await User.findOne({ role: 'ATH' });
    if (exists) {
      console.log("⚠ Ya existe un usuario con rol ATH, no se creará otro");
      process.exit();
    }

    // Datos del usuario principal ATH
    const passwordHash = await bcrypt.hash("Admin1234!", 10);

    const userATH = await User.create({
      name: "Admin ATH",
      email: "admin@rikimaka.com",
      password: passwordHash,
      role: "ATH" // ó usa "ADMIN" si lo quieres totalmente separado
    });

    console.log("✅ Usuario principal ATH creado correctamente:", userATH.email);
    process.exit();

  } catch (err) {
    console.error("❌ Error al crear usuario inicial ATH:", err.message);
    process.exit(1);
  }
}

seedATH();
