// Importa los modelos de datos para trabajar con las tareas y los proyectos
const Worklog = require("../models/Worklog");
const Project = require("../models/Project"); 
const { json } = require("express");

// Función para comprobar si un proyecto existe en la base de datos
async function ensureProjectExist(id) { 
    const exist = await Project.findById(id); 
    if (!exist) throw new Error("Proyecto no encontrado"); 
}

// Crear un registro de trabajo (Worklog)
exports.createWorklog = async( req, res) => {
    try { 
        const userId = req.userId; // Codigo del usuario que hace la tarea
        const { 
            project, date, activities, notes } = req.body; // Informacion envidada en el registro 

            // Confirma que se incluya el nombre del proyecto y la fecha 
            if (!project || !date)
                return res.status(400).json({ msg: "Proyecto y fecha son necesarios" });

            // Confirma  que el proyecto existe 
            await ensureProjectExist(project);

            // Crea un registro nuevo de trabajo 

        const log = new Worklog({ 
            user: userId, 
            project, 
            date, 
            activities, 
            nores
        });

        // Funcion para guardar la informacion en la base de datos 
        await log.save(); 
        res.status(201).json(log); // Confirma el registro creado 
    } catch (err) { 
        res.status(400).json ({ msg: err.message }); // Muestra errores si hay alguno 
    }
}; 

// Obtiene los registros del usurario que inicia sesion 
exports.getWorklogById = async (req, res) => {
    const log = await Worklog.find({ user: req.user.id })
    .populate("project", "name")
    .sort({ date: -1 }); // Ordena por fecha mas reciente 

   res.json(logs); // Envia los registros  
}; 

// Obtiene un registro de trabajo por ID 
exports.getWorklogById = async (req, res) => { 
    const log = await Worklog.findById(req.params.id)    
        .populate("user", "name email")
        .populate("project", "name"); 
    
    if (!log) return res.status(404).json({ msg: "No se encontro el registro de trabajo"}); 
    // verifica si el usuario que solicita el reporte, es dept IT o Administrativo 
    const isOwnwer = String(log.user._id) === req.user.id; 
    const isAdmin = req.user.role === "Administrativo";

    if (!isOwner && !isAdmin) return res.status(403).json({ msg: "Prohibido, accesso no autorizado"}); 
    
    res.json(log); // envia el registro 
}; 

// Funcion para actualizar el registro de trabajo 
exports.updateWorklog = async (req, res) => { 
    const log = await Worklog.findById(req.params.id); //Busca registrp por id
    if (!log) return res.status(404).json({ msg: "No se encontro registro"}); // Registro no se encontro 

    // Verifica si el usuario tiene permisos para actualizar reportes 
    const isOwner = String(log.user) === req.user.id;
    const isAdmin = req.user.role === "Administrativo";

    if (!isOwner && !isAdmin) return res.status(403).json({ msg: "Prohibido, accesso no autorizado"}); 

    // Obtiene los datos nuevos 
    const { activities, notes, date } = req.body; 

    // Actualiza solo si hay valores nuevos 
    if (activities) log.activities = activities; 
    if (notes) log.notes = notes; 
    if (date) log.date = date; 

    await log.save(); // Guarda los cambios 
    res.json(log); // Envia el registro actualizado 
}; 

// Funcion para eliminar registros de trabajo 
exports.deleteWorklog = async (req, res) => { 
    const log = await Worklog.findById(req.params.id); // Busca registro por id 
    if (!log) return res.status(404).json({ msg:"No se encontro el registro de trabajo"}); // Registro no encontrado 

    // Verifica permisos de autorizacion 
    const isOwner = String(log.user) === req.user.id; 
    const isAdmin = req.user.role === "Administrativo"; 

    if (!isOwner && !isAdmin) return res.status(403).json({ msg: "Prohibido, accesso no autorizado"}); 

    await log.deleteOne();
    res.json({ msg: "Registro de trabajo borrado"}); //
};