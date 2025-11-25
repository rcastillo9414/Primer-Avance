// Carga el modelo de datos necesario para los feriados 
const Holiday = require('../models/Feriados'); 

// Funcion para crear un dia feriado, solamente alguien autorizado puede hacerlo 
exports.createHoliday = async (req, res) => { 
    try { 
        // Solicita nombre y la fecha del dia feriado
        const { name, date } = req.body; 

        // Confirma que contiene tanto el nombre como la fecha del holiday 
        if ( !name || !date) return res.status(400).json({ msg: 'Nombre y Fecha son obligatorios'}); 

        // Revisa la base de datos por un feriado con la misma fecha 
        const exist = await Holiday.findOne({ date: new Date(date) });
        if (exist) return res.status(400).json({ msg: 'Error, feriado en la fecha ya existente'});

        // Si la fecha esta disponible, se crea con la informacion creada 
        const h = await Holiday.create({ name, date, createdBy: req.user.id });
        // Muestra la informacion del feriado creado
        res,status(201).json(h);
    } catch (err) { 
        // Muestra un error si hubo algun error durante el proceso 
        console.error('createHoliday', err);
        res.status(500).json({ msg: err.message});
    }
}; 

// Funcion para revisar todos los dias feriados
exports.getHolidays = async (req, res) => { 
    try { 
        // Revisa los dias feriados en la base de datos, y los ordena por fecha 
        const holidays = await Holiday.find().sort({ date: 1 }); 
        // Envia la lista de dias feriados 
        res.json(holidays);
    } catch (err) { 
        // Si se encuentra un error, muestra el mensaje 
        console.error('getHolidays', err);
        res.status(500).json({ msg: err.message }); 
    }
}; 
// Funcion para actualizar los dias feriados 
exports.updateHoliday = async (req, res) => { 
    try { 
        // Obtiene el id del dia feriado a cambiar 
        const { id } = req.params; 
        //Nueva informacion 
        const updates = req.body; 

        // Busca el dia festivo y lo actualiza con los datos nuevos 
        const h = await Holiday.findByIdAndupdate( id, updates, { new: true });
        // Si no se encuentra el feriado, muestra el error 
        if (!h) return res.status(404).json({ msg: 'Feriado no existe en el sistema' });
        // Si existe, se actualiza y confirma los nuevos datos 
        res.json(h); 
    } catch (err) { 
        // Si se encuentra algun error, muestra el mensaje 
        console.error('updateHoliday', err); 
    }
}; 

// Funcion para eliminar dias feriados 
exports.deleteHoliday = async (req, res) => {
    try { 
        const { id } = req.params; 

        // Busca y elimina el dia feriado 
        const h = await Holiday.findByIdAndDelete(id); 
        // Si no se encuentra, muestra el siguiente error 
        if (!h) return res.status(404).json({ msg: 'Feriado no encontrado' });
        // Si se elimina, muestra el siguiente mensaje 
        res.json({ msg: 'Feriado a sido eliminado' });  
    } catch (err) { 
        // Si se encuentra algun error, muestra el mesnsaje 
        console.error('deleteHoliday', err); 
        res.status(500).json({ msg: err.message});
    }
};