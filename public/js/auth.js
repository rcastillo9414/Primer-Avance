// Función para hacer llamadas a la API
async function api(path, options = {}) {
  // Si no hay encabezados en options, los crea vacíos
  options.headers = options.headers || {};
  // Define que el contenido será en formato JSON
  options.headers['Content-Type'] = 'application/json';
  // Si hay un token guardado en localStorage, lo añade en el encabezado de autorización
  if (localStorage.token) {
    options.headers['Authorization'] = 'Bearer ' + localStorage.token;
  }
  // Hace la petición fetch a la API con la ruta y las opciones
  const res = await fetch(path, options);
  // Si la respuesta es 401 (no autorizado), muestra alerta y redirige a login
  if (res.status === 401) {
    alert('Acceso restringido, revise sus credenciales');
    window.location = '/public/html/login.html'; // revisar cuando se termine y ajustar la ubicacion
    throw new Error('Acceso restringido'); // Detiene la ejecución si no está autorizado
  }
  // Devuelve la respuesta para que pueda ser procesada después
  return res;
}

// Función para manejar el login
async function handleLogin(e) {
  e.preventDefault(); // Previene que el formulario se envíe de forma tradicional
  const form = e.target; // Obtiene el formulario que disparó el evento
  // Crea un objeto con email y password desde los campos del formulario
  const body = { 
    email: form.email.value, 
    password: form.password.value 
  };
  // Hace la llamada a la API de login 
  const res = await api('/api/auth/login', { method: 'POST', body: JSON.stringify(body) });
  const json = await res.json(); // Convierte la respuesta en JSON
  // Si la respuesta fue exitosa y contiene un token
  if (res.ok && json.token) {
    // Guarda el token y el nombre de usuario en localStorage
    localStorage.setItem('token', json.token);
    localStorage.setItem('userName', json.user?.name || '');
    // Redirige a la página del dashboard
    window.location = '/public/html/dashboard.html'; // revisar cuando se termine y ajustar la ubicacion
  } else {
    // Si hubo error, muestra un mensaje
    alert(json.error || json.msg || 'Login failed');
  }
}

// Función para cerrar sesión
function logout() {
  // Elimina el token y el nombre de usuario del localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  // Redirige a la página de login
  window.location = '../public/index.html';  // revisar cuando se termine y ajustar la ubicacion
}