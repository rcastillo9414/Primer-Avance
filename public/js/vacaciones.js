// Función que se ejecuta cuando el usuario envía el formulario de vacaciones
async function submitVacation(e){
  e.preventDefault(); // Evita que la página se recargue al enviar el formulario

  const f = e.target; // Obtiene el formulario que se envió
  
  // Crea un objeto con los datos del formulario: fechas y motivo
  const body = { 
    startDate: f.startDate.value, // Fecha de inicio de vacaciones
    endDate: f.endDate.value,     // Fecha de fin de vacaciones
    reason: f.reason.value        // Motivo de la solicitud
  };

  // Envía los datos al servidor usando fetch con método POST
  const res = await fetch('/api/vacations', {
    method:'POST', // Método para enviar datos nuevos
    headers:{
      'Content-Type':'application/json', // Indica que enviamos JSON
      'Authorization':'Bearer ' + localStorage.token // Token para verificar quién es el usuario
    },
    body: JSON.stringify(body) // Convierte los datos a formato JSON para enviar
  });

  // Si la respuesta del servidor es exitosa (código 200-299)
  if (res.ok) { 
    f.reset(); // Limpia el formulario
    alert('Solicitud enviada'); // Muestra mensaje de éxito
  } else {
    const j = await res.json(); // Si hay error, obtiene el mensaje del servidor
    alert(j.msg || 'Error'); // Muestra el mensaje de error
  }
}

// Función para cargar y mostrar mis vacaciones actuales
async function loadMyVacations() {
  // Hace una petición para obtener las vacaciones del usuario
  const res = await fetch('/api/vacations/me', {
    headers:{ 'Authorization':'Bearer ' + localStorage.token } // Usa el token para autenticarse
  });

  // Si la respuesta no es exitosa
  if (!res.ok) {
    alert('Error'); // Muestra un error
    return; // Sale de la función
  }

  // Obtiene la lista de vacaciones en formato JSON
  const list = await res.json();

  // Busca en la página el elemento donde mostrar las vacaciones
  const out = document.getElementById('myVacations');

  // Muestra la lista en formato de texto (JSON bonito)
  out.innerHTML = JSON.stringify(list, null, 2);
}

// Cuando la página termina de cargar
document.addEventListener('DOMContentLoaded', ()=> {
  const f = document.getElementById('vacationForm'); // Busca el formulario
  
  // Si existe el formulario, le pone la función al enviar
  if (f) f.addEventListener('submit', submitVacation);
  
  // Si existe el elemento para mostrar vacaciones, carga las vacaciones al inicio
  if (document.getElementById('myVacations')) loadMyVacations();
});