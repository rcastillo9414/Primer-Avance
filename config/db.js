// Entrega-Final/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ ERROR: Falta la variable MONGO_URI en .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB conectado correctamente");

    mongoose.connection.on('disconnected', () => {
      console.warn("⚠ MongoDB desconectado. Intentando reconexión...");
    });

  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error.message);
    process.exit(1);
  }
};

// Cierre ordenado
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log("🔌 MongoDB desconectado (SIGINT)");
  process.exit(0);
});

module.exports = connectDB;
