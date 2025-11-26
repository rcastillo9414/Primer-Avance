// Carga el modelo de las solicitudes de vacaciones 
const VacationRequest = require('../models/Vacaciones'); 

// Funcion para que un trabajador pueda solicitar vacaciones 
exports.createRequest = async (req, res) => { 
    try { 
        const userID = req.user.id; 
        const { startDate, endDate, reason } = req.body; // Datos que envia el solicitante 
        if (!startDate || !endDate) return res.status(400).json({ msg: 'Fecha de inicio y fecha final son necesarias' });

        // Convierte las fechas en objetos para poner trabajar con ellas 
        const sd = new Date(startDate); 
        const ed = new Date(endDate); 
        // Verifica que la fecha final, sea despues de la de inicio
        if  (ed < sd) return res.status(400).json({ msg: 'La fecha final, debe ser despues de la fecha de inicio' });

        // Cuenta los dias totales. incluye desde el primero al ultimo 
        const days = Math.ceil((ed - sd) / (1000*60*60*24)) + 1;
        
        // Guarda la solicitud en la base de datos 
        const vr = await VacationRequest.create({ 
            user: userID, 
            startDate, 
            endDate, 
            days, 
            reason
        }); 

        // Envia confirmacion de que se guardo correctamente 
        res.status(201).json(vr); 
    } catch (err) { 
        // Si hay algun error, se muestra el siguiente mensaje 
        console.error('CreateRequest', err); 
        res.status(500).json({ msg: err.message }); 
    }
}; 

// Funcion para revisar sus  solicitudes propias
exports.getMyRequest = async (req, res) => { 
    try { 
    const userId = req.user.id; 
    // Busca solicitudes recientes del mismo usuario 
    const list = await VacationRequest.find({ user: userId }).sort({ createdAt: -1 }); 
    // Muestra la lista existente 
    res.json(list); 
    } catch (err) { 
        // Si se encuentra algun error, muestra el siguiente mensaje 
        console.error('getMyRequest', err); 
        res.status(500).json({ msg: err.message });
    }
}; 

// FUncion para que los administradores, vean las solicitudes pendientes 
exports.getPending = async (req, res) => { 
    try { 
        // Revisa todas las solicitudes que no han sido revisadas 
        const list = await VacationRequest.find({ status: 'Pendiente' }).populate('user','name email').sort({ createdAt: 1});
        // Genera la lista para que pueda ser revisada
        res.json(list); 
    } catch (err) { 
        // Si se encuentra algun error, muestra el sigueinte error 
        console.error('getPending', err); 
        res.status(500).json({ msg: err.message}); 
    }
}; 

// Funcion para que los administradores puedan aprovar o rechazar solicitudes 
exports.reviewReques = async (req, res) => { 
    try { 
        const { id } = req.params; 
        const { action } = req.body; 

        // Revisa la solicitud base 
        const vr = await VacationRequest.findBy(id); 
        if (!vr) return res.status(404).json({ msg: 'No se encontraron las vacaciones solicitadas' }); 
        // Revisa que todavia este pendiente para revisar 
        if (vr.status !== ' Pendiente') return res.status(400).json({ msg: 'La solicitud ya fue procesada'});

        // Cambia el estado dependiendo de la decision 
        if ( action === 'Aprovada') { 
            vr.status = 'Aprovada'; // Si la solicitud fue aprovada 
        } else if ( action === 'Rechazada') { 
            vr.status = 'Rechazada'; // Solicitud fue rechazada 
        } else { 
            return res.status(400).json({ msg: 'Accion no permitida' });
        }

        // Guarda quien revisa la solicitud y cuando 
        vr.reviewedBy = req.user.id; 
        vr.reviewedAt = new Date();
        await vr.save(); // Guarda los cambios en la base de datos 
        // Envia la solicitud actualizada 
        res.json(vr);
    } catch (err) { 
        // Si se encuentra algun error, muestra el mensaje 
        console.error('reviewRequest', err); 
        res.status(500).json({ msg: err.message }); 
    }
};