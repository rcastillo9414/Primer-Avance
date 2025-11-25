module.exports = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: "Accesso restringido" });
        }
        next();
    };
};
// verifica si un usuario tiene permiso para acceder a un recurso determinado. 
// Si no tiene permiso, devuelve un error de acceso restringido. Si tiene permiso, permite que la solicitud continúe con la siguiente función