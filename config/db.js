const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/rikimaka';
    await mongoose.connect(uri);
    console.log('MongoDB conectado existosamente');
  } catch (err) {
    console.error('MongoDB error de coneccion:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;