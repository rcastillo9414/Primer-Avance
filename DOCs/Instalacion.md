## Guía Completa de Instalación y Puesta en Marcha – Proyecto Rikimaka HR
## 1. Introducción
Este documento guía al usuario paso a paso para instalar, configurar y ejecutar el sistema Rikimaka HR en cualquier equipo nuevo. Incluye las instrucciones necesarias para instalar dependencias, configurar la base de datos, levantar el servidor y crear el primer usuario administrador para iniciar sesión.
## 2. Requisitos Previos
Antes de comenzar, asegúrese de tener lo siguiente instalado:
- Node.js (versión 18 o superior) - MongoDB Atlas (recomendado) o un servidor local de MongoDB - Editor de texto o IDE (Visual Studio Code recomendado) - Navegador web (Chrome, Firefox, Edge) - Git (opcional, para clonar el proyecto)
## 3. Obtener el Proyecto
Existen dos métodos para obtener el proyecto:
A) Descargar ZIP desde la entrega final:
1. Extraiga el archivo ZIP completo. 2. Colóquelo en una carpeta accesible como Documentos o Escritorio.
B) Clonar desde Git (si aplica):
1. Abrir terminal. 2. Ejecutar: git clone <URL_DEL_REPOSITORIO>
## 4. Instalar Dependencias del Proyecto
1. Abra una terminal dentro de la carpeta raíz del proyecto (donde está index.js).
2. Ejecute el siguiente comando:
npm install
 Esto instalará todas las dependencias necesarias: Express, Mongoose, Bcrypt, JWT, etc.
## 5. Configurar Variables de Entorno (.env)
En la raíz del proyecto cree un archivo llamado .env con el siguiente contenido:
MONGO_URI=<Cadena de conexión de MongoDB Atlas> JWT_SECRET=<Una clave segura para firmar tokens>
Ejemplo de cadena MongoDB Atlas:
mongodb+srv://usuario:password@cluster0.mongodb.net/rikimakaDB?retryWrites=true&w=majority
## 6. Ejecutar la Aplicación
Para iniciar el servidor, ejecute:
npm run dev
Si todo funciona correctamente, debería ver el mensaje: Server running on port 5500 MongoDB conectado correctamente
## 7. Crear el Primer Usuario Administrador
Dado que el sistema requiere credenciales para ingresar, es necesario crear el primer usuario administrador de manera manual directamente desde la terminal.
7.1 Pasos para crear el primer usuario
1. Abra Visual Studio Code o un editor y cree un archivo temporal llamado createAdmin.js en la raíz del proyecto.
2. Copie el siguiente contenido:
const mongoose = require('mongoose'); const bcrypt = require('bcrypt'); const User = require('./Entrega-Final/models/User'); require('dotenv').config(); async function createAdmin() { await mongoose.connect(process.env.MONGO_URI); const hash = await bcrypt.hash('admin123', 10); await User.create({ name: 'Administrador', email: 'admin@rikimaka.com', password: hash, role: 'Administrativo' }); console.log('Usuario administrador creado'); process.exit(); }
createAdmin();
3. En la terminal, ejecute: node createAdmin.js 4. Una vez creado, elimine el archivo createAdmin.js por seguridad.
Las credenciales generadas serán: Correo: admin@rikimaka.com Contraseña: admin123
## 8. Acceso a la Aplicación
Abra un navegador e ingrese:
http://localhost:5500/index.html
Inicie sesión con el usuario administrador que creó. Desde el panel podrá crear usuarios, proyectos, revisar worklogs y aprobar vacaciones.
## 9. Uso General del Sistema
- Módulo de Proyectos: Crear y asignar miembros. - Worklogs: Programadores pueden reportar horas. - Vacaciones: Solicitud y aprobación. - Feriados: Gestionados por el administrador. - Reportes: Horas por proyecto y productividad por usuario.
## 10. Notas Finales
Este sistema está diseñado para manejar la gestión interna de recursos humanos de manera integral. Puede expandirse con nuevos módulos, dashboards o integraciones según sea necesario.