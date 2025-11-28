// Función para obtener y mostrar un reporte desde una API
async function fetchReport(path, outId) {
  // Hace una petición a la URL especificada (path) y pasa un token de autorización
  const res = await fetch(path, { headers: { 'Authorization': 'Bearer ' + localStorage.token }});
  
  // Si la respuesta no fue exitosa, muestra un mensaje de error y termina la función
  if (!res.ok) { 
    alert('Error fetching report'); 
    return; 
  }
  
  // Convierte la respuesta en datos JSON que podemos usar
  const data = await res.json();
  
  // Busca en la página el elemento con el ID dado (outId)
  // y coloca allí los datos en formato legible
  document.getElementById(outId).textContent = JSON.stringify(data, null, 2);
}

// Cuando la página ya está cargada
document.addEventListener('DOMContentLoaded', ()=> {
  // Busca un botón en la página que tiene el ID 'btnLoadHours'
  const btn = document.getElementById('btnLoadHours');
  
  // Si encuentra ese botón, le pone una acción cuando se hace clic:
  // llama a la función fetchReport para cargar horas por proyecto
  if (btn) btn.addEventListener('click', ()=> fetchReport('/api/reports/hours-per-project', 'outHours'));
  
  // Busca otro botón con el ID 'btnLoadProd'
  const btn2 = document.getElementById('btnLoadProd');
  
  // Si existe, le asigna la función para cargar productividad por usuario
  if (btn2) btn2.addEventListener('click', ()=> fetchReport('/api/reports/productivity-per-user', 'outProd'));
});