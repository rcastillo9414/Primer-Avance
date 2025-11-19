// Carga las variables de entorno desde el archivo .env.
require('dotenv').config();

const express = require('express');  // Framework para crear el servidor y manejar rutas HTTP.
const path = require('path');        // Módulo nativo de Node para manejar rutas de archivos.
const cors = require('cors');        // Middleware para permitir peticiones desde otros dominios.
const connectDB = require('./config/db'); // Función que conecta a la base de datos.

// Inicializa la aplicación Express.
const app = express();

// Conexión a la base de datos.
// Sin esta llamada, la API no podría leer/escribir datos.
connectDB();

// Middleware que habilita CORS para permitir peticiones desde otro dominio
app.use(cors());

// Middleware que permite a Express interpretar JSON en las peticiones.
// Necesario para manejar POST, PUT, PATCH con cuerpos en formato JSON.
app.use(express.json());

// Esto permite a Express entregar HTML, CSS, JS e imágenes sin definir rutas manuales.
app.use(express.static(path.join(__dirname, 'public')));

// Registro de rutas de la API.
// Todo lo que esté dentro de routes/auth.js responderá bajo la ruta /api/auth
// Ejemplo: /api/auth/login, /api/auth/register
app.use('/api/auth', require('./routes/auth'));

// Fallback para aplicaciones tipo Single Page Application (SPA).
// Si ninguna ruta coincide, devuelve index.html.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Obtiene el puerto desde variables de entorno o usa 3000 por defecto.
const PORT = process.env.PORT || 3000;

// Inicia el servidor y muestra un mensaje en consola indicando el puerto activo.
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
