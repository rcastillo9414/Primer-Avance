const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware de autenticación
module.exports = async (req, res, next) => {
  try {
    // Obtener token desde header o query
    const token =
      req.header('Authorization')?.replace('Bearer ', '') ||
      req.query.token;

    if (!token) 
      return res.status(401).json({ msg: 'Acceso restringido: falta token' });

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');

    // Buscar usuario real
    const user = await User.findById(decoded.id).select('-password');

    if (!user)
      return res.status(401).json({ msg: 'Usuario no encontrado o eliminado' });

    // Guardar datos en req
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();

  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ msg: 'Token inválido o expirado' });
  }
};
