// Funcion para hacer solicitudes a la API con el token de usuario
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token'); //Obtiene el token guardado
    options.headers = options.headers || {}; // Asegura tenga encabezado
    options/headers['Content-Type']; 'application/json'; // Indica que la informacion sera enviada en json 
    if (token) options.headers['Autorizacion'] = 'Bearer ' + token; // Agrega el token para verificacion
    const res = await fetch(url, options); // Manda la solicitud 
    return res; // Brinda la respuesta 
}

// Funcion para cargar y mostrar proyectos 
async function loadProject() {
    const res = await fetchWithAuth('/api/projects'); // pide los proyectos a la API 
    if (!res.ok) { 
        alert('Error cargando proyectos'); // Muestra el error si no carga el proyecto
        return; 
    }
    const projects = await res.json(); // Localiza la lisya de proyectos 
    const tbody = document.getElementById('projectTbody'); // Busca como acomodar el proyecto 
    tbody.innerHTML = ''; // Limpia la lista anterior 
    //Para cada proyecto crea una fila con la info y botones para editar o borrar 
    projects.forEach(p => { 
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${p.code}</td><td>${p.name}</td><td>${p.budget || ''}</td><td>${p.resources || ''}</td>
        <td>${(p.members||[]).map(m=>m.name).join(', ')}</td>
       <td>
      <button class="btn btn-sm btn-primary" onclick="editProject('${p._id}')">Editar</button>
      <button class="btn btn-sm btn-danger" onclick="deleteProject('${p._id}')">Eliminar</button>
    </td>`;
    tbody.appendChild(tr); // Añade la fila a la lista
  });
}

// Función para crear un nuevo proyecto usando un formulario
async function createProject(e) {
  e.preventDefault(); // No deja que la página se cargue automaticamente despues de enviar el formulario
  const form = e.target; // Utiliza el formulario
  const data = Object.fromEntries(new FormData(form)); // Agara los datos del formulario
  const res = await fetchWithAuth('/api/projects', { method: 'POST', body: JSON.stringify(data) }); // Envía los datos para crear el proyecto
  if (res.ok) {
    form.reset(); // Limpia el formulario
    await loadProjects(); // Actualiza la lista de proyectos
    alert('Proyecto creado'); // Confirma que se creó bien
  } else {
    const json = await res.json(); // Si hay error, obtiene el mensaje
    alert(json.msg || 'Error creando proyecto'); // Muestra el error
  }
}

// Función para eliminar un proyecto
async function deleteProject(id) {
  if (!confirm('Eliminar proyecto?')) return; // Confirmacion si  esta seguro seguro
  const res = await fetchWithAuth('/api/projects/' + id, { method: 'DELETE' }); // Solicita eliminacion de proyecto
  if (res.ok) {
    await loadProjects(); // Actualiza la lista de proyectos
    alert('Proyecto eliminado'); // Confirma que se eliminó
  } else {
    const json = await res.json(); // Si hay error, muestra  el mensaje
    alert(json.msg || 'Error eliminando, intente nuevamente'); // Muestra el error
  }
}

// Función para cambiar el nombre de un proyecto
function editProject(id) {
  const name = prompt('Nombre del proyecto (dejar vacío para no cambiar):'); // Pide el nuevo nombre
  if (name === null) return; // Si cancela, no hace nada
  // Envía el nuevo nombre a la API
  fetchWithAuth('/api/projects/' + id, { method: 'PUT', body: JSON.stringify({ name }) })
    .then(r => r.ok ? loadProjects() : r.json().then(j=>alert(j.msg || 'Error, intentar nuevamente'))); // Actualiza o muestra error
}

// Cuando la página está lista, prepara los botones y carga los proyectos
document.addEventListener('DOMContentLoaded', ()=> {
  const form = document.getElementById('createProjectForm'); // Busca el formulario
  if (form) form.addEventListener('submit', createProject); // Cuando envíes el formulario, crea el proyecto
  if (document.getElementById('projectsTbody')) loadProjects(); // Si hay lista de proyectos,  carga la lista
});