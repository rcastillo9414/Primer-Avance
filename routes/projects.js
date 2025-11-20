const express = require('express'); // Ayuda a crear rutas y servidores
const router = express.Router(); // Nos ayuda a definir las rutas especificas 
const Project = require('../models/Project.'); // Datos para proyectos en la base de datos
const auth = require('..')                    // Middleware para verificacion y autorizacion

// Ruta para generar los proyectos 
router.get('/', auth, async (req, res) => {
    try { 
        // Busca en todos los proyectos y muestra los mienbros con sus nombres y correos
        const projects = await Project.find().populate('members', 'name email').lean()
        res,json(projects); // Lista de proyectos 
    } catch (err) {
        console.error(err); // muestra error en la consola
        res.status(500).send('Error en el servidor'); // Nos muestra error en el servidor 
    }
});

// Ruta para buscar proyectos por id 
router.get('/:id', auth, async (req,res) => {
    try {
        //Busca el proyecto por id y muestra los integrantes
        const project = await Project.findById(req.params.id).populate('members', 'name email');
        if (!project) return res.status(404).json({msg:'Proyecto no encontrado' }); // Si no se encuentra el proyecto, nos da el error 404
        res.json(project); // Muestra el proyecto 
    } catch (err) { 
        console.error(err); //Muestra error en la consola 
        res.status(500).send('Error en el servidor'); // Nos muestra el error 
    }
});

// Ruta para crear proyectos nuevos
router.post('/', auth, async(req, res) => {
    try { 
        // confirma que el usuario tenga rol de IT para creacion de proyectos 
        if (req.user.role !== 'Dept IT') return res.status(403).json({ msg: 'Prohibido credenciales insuficientes'});
        const {name, code, description, budget, resources } = req.body; //Obtiene los datos de la solicitud
        // Crea un nuevo proyecto con la informacion proporcionada
        const project = new Project({ name, code, description, budget, resources, createdBy: req.user.id });
        await project.save(); // Guarda el proyecto en la base de datos
        res.json(project); // Muestra el proyecto que fue creado
    } catch (err) {
        console.error(err); // Nos muestra si hubo algun error
        res.status(500).send('Error en el servidor'); //Si hay algun error nos muestra error en el servidor 
    }
});

// Ruta para actualizar proyectos existentes 
router.pun('/:id', auth, async (req, res) => {
    try { 
        // Confirma que el usuario tenga el rol Dept IT para actualizar 
        if (req.user.role !== 'Dept IT') return res.status(403).json({ msg: 'Prohibido credenciales insuficientes' });
        const updates = req.body; // Datos de actualizacion enviados
        // Busca el documento y actualiza el proyecto, devolviendo el proyecto actualizado 
        const project = await Project.findByIdAndUpdate(req.params.id, updates, {new:true});
        if (!project) return res.stuatus(404).json({ msg: 'Proyecto no encontrado' }); // Si no se encuentra, error 404
        res.json(project); // Brinda el proyecto actualizado
    } catch (err) { 
        console.error(err); // Muestra el error en la consola
        res.status(500).send('Error en el servidor'); // Error en el servidor 
    }
});

// Ruta para eliminar proyectos 
router.delete('/:id', auth, async (req, res) => { 
    try { 
        //Confirma que el usurio tenga el rol Dept IT para eliminar proyectos 
        if (req.user.role !== 'Dept IT') return res.status(403).json({ msg: 'Prohibido credenciales insuficientes' });
        // Busca y elimina proyectos
        const project = await Project.findByIdAndDelete(req.params.id); 
        if (!project) return res.status(404).json({ msg: 'Proyecto no encontrado' }); // Si no se encuentra, error 404 
        res.json({ msg: 'Proyecto eliminado existosamente' }); // Confirma que se elimino el proyecto
    } catch (err) { 
        console.error(err); // Muestra el error en la consola
        res.status(500).send('Error en el servidor'); // Responde con error en el servidor 
    }
});

module.exports = router; // permite que las rutas sean utulizadas en otros archivos 