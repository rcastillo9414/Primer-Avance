// Middleware para permitir SOLO un rol
module.exports = (role) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ msg: 'No autenticado' });

    if (req.user.role !== role)
      return res.status(403).json({ msg: 'Acceso denegado: rol no autorizado' });

    next();
  };
};

// verifica si un usuario tiene permiso para acceder a un recurso determinado. 
// Si no tiene permiso, devuelve un error de acceso restringido. Si tiene permiso, permite que la solicitud continúe con la siguiente función