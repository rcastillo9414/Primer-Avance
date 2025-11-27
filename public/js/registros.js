// Función para cargar los registros de trabajo del usuario
async function loadMyWorklogs() {
  // Hace una solicitud a la API para obtener los registros del usuario
  const res = await fetch('/api/worklogs/me', { headers: { 'Authorization': 'Bearer ' + localStorage.token }});
  
  // Si hay un error en la respuesta, muestra un mensaje y detiene la función
  if (!res.ok) { alert('Error loading worklogs'); return; }
  
  // Convierte la respuesta en JSON (lista de registros)
  const logs = await res.json();
  
  // Busca en la página la tabla donde se mostrarán los registros
  const tbody = document.getElementById('worklogsTbody');
  // Limpia la tabla para cargar los nuevos datos
  tbody.innerHTML = '';
  
  // Recorre cada registro y crea una fila en la tabla
  logs.forEach(l => {
    const tr = document.createElement('tr'); // Crea una fila
    // Agrega celdas con datos del registro
    tr.innerHTML = `
      <td>${new Date(l.date).toLocaleDateString()}</td> <!-- Fecha del trabajo -->
      <td>${l.project?.name||''}</td> <!-- Nombre del proyecto (si existe) -->
      <td>${l.totalHours||0}</td> <!-- Horas totales -->
      <td>${(l.activities||[]).map(a=>a.description+' ('+a.hours+'h)').join('; ')}</td> <!-- Actividades y horas -->
      <td><button class="btn btn-sm btn-danger" onclick="deleteLog('${l._id}')">Eliminar</button></td>`; // Botón para eliminar
    tbody.appendChild(tr); // Añade la fila a la tabla
  });
}

// Función para guardar un nuevo registro
async function submitWorklog(e){
  e.preventDefault(); // Evita que la página se recargue al enviar el formulario
  const form = e.target; // Obtiene el formulario
  
  // Prepara los datos para enviar
  const data = {
    project: form.project.value, // Proyecto del formulario
    date: form.date.value, // Fecha
    activities: [{ description: form.activity.value, hours: Number(form.hours.value), status: 'COMPLETADA' }], // Actividad y horas
    notes: form.notes.value // Notas
  };
  
  // Hace una solicitud POST para guardar el nuevo registro
  const res = await fetch('/api/worklogs', {
    method:'POST', // Método POST
    headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer ' + localStorage.token }, // Encabezados
    body: JSON.stringify(data) // Datos en formato JSON
  });
  
  // Si se guarda correctamente, limpia el formulario y recarga la lista
  if (res.ok) { form.reset(); loadMyWorklogs(); } 
  // Si hay error, muestra el mensaje
  else { const j = await res.json(); alert(j.msg || 'Error'); }
}

// Función para eliminar un registro
async function deleteLog(id){
  if (!confirm('Eliminar?')) return; // Pregunta si realmente quiere eliminar
  // Hace una solicitud DELETE a la API
  const res = await fetch('/api/worklogs/'+id, { method:'DELETE', headers:{ 'Authorization':'Bearer ' + localStorage.token }});
  // Si se elimina, recarga la lista
  if (res.ok) loadMyWorklogs(); 
  // Si hay error, muestra mensaje
  else alert('Error, intentelo nuevamente');
}

// Cuando la página cargue
document.addEventListener('DOMContentLoaded', ()=> {
  // Busca el formulario y le asigna la función al enviar
  const f = document.getElementById('worklogForm');
  if (f) f.addEventListener('submit', submitWorklog);
  // Si existe la tabla, carga los registros
  if (document.getElementById('worklogsTbody')) loadMyWorklogs();
});