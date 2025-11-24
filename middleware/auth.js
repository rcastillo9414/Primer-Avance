// Trae la libreria que ayuda a crear y verificar los token de seguridad 
const jwt = require('jsonwebtoken'); 


// Revisa el modelo de usuario para buscar informacion en la base de datos 
const User = require('../models/User');

// Se utiliza para la verificacion si un usuario tiene permiso para ingresar 
module.exports = async (req, res, next) => {
    //Revisa el token para aprobacion 
    const token = req.header('Autorizacion')?.replace('Bearer', '') || req.query.token; 
    // Si no hay token, rechaza la solicitud y muestra el mensaje
    if (!token) return res.status(401).json({ msg: 'Acceso Restringido, revise sus credenciales'});

    try { 
        // Verificacion del token usando clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
        // Guarda la informacion del usuario que viene en el token 
        req.user = decoded; 

        // Revisa la base de datos por mas detalles (sin contraseña)
        req.userDetails = await User.findById(decoded.id).select('-password');
        
        // Continua con el siguiente proceso
        next();
    } catch (err) { 
        // Si el token no se verifica, muestra el siguiente mensaje 
        console.error('Error de verificacion:', err.message);
        res.status(401).json({ msg: 'Acceso restringido, revise sus credenciales'});
    }
};
