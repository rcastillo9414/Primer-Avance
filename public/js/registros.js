// Cargar mis worklogs
async function loadMyWorklogs() {
  const res = await fetch('/api/worklogs/mine', {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  });

  if (!res.ok) {
    alert('Error al cargar los registros');
    return;
  }

  const logs = await res.json();
  const tbody = document.getElementById('worklogsTbody');
  tbody.innerHTML = '';

  if (logs.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="5" class="text-center text-muted">No hay registros</td></tr>
    `;
    return;
  }

  logs.forEach(l => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(l.date).toLocaleDateString()}</td>
      <td>${l.project?.name || 'Sin proyecto'}</td>
      <td>${l.hours || 0}</td>
      <td>${l.description || ''}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteLog('${l._id}')">
          Eliminar
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Guardar un nuevo worklog
async function submitWorklog(e) {
  e.preventDefault();
  const form = e.target;

  const data = {
    project: form.project.value,
    date: form.date.value,
    description: form.description.value,
    hours: Number(form.hours.value)
  };

  const res = await fetch('/api/worklogs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    form.reset();
    loadMyWorklogs();
  } else {
    const j = await res.json();
    alert(j.msg || 'Error guardando registro');
  }
}

// Eliminar worklog
async function deleteLog(id) {
  if (!confirm('¿Eliminar este registro?')) return;

  const res = await fetch('/api/worklogs/' + id, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  });

  if (res.ok) {
    loadMyWorklogs();
  } else {
    alert('Error eliminando el registro');
  }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('worklogForm');
  if (form) form.addEventListener('submit', submitWorklog);

  if (document.getElementById('worklogsTbody')) loadMyWorklogs();
});
