document.addEventListener("DOMContentLoaded", () => {
  loadProjects();

  const form = document.getElementById("worklogForm");
  if (form) form.addEventListener("submit", submitWorklog);

  if (document.getElementById("worklogsTbody")) loadMyWorklogs();
});

const token = localStorage.getItem("token");

// CARGAR LISTA DE PROYECTOS
async function loadProjects() {
  const res = await fetch("/api/projects", {
    headers: { "Authorization": "Bearer " + token }
  });

  const list = await res.json();
  const sel = document.getElementById("project");

  sel.innerHTML = '<option value="">Seleccione...</option>';

  list.forEach(p => {
    sel.innerHTML += `<option value="${p._id}">${p.name}</option>`;
  });
}

// CARGAR MIS WORKLOGS
async function loadMyWorklogs() {
  const res = await fetch("/api/worklogs/me", {
    headers: { "Authorization": "Bearer " + token }
  });

  const logs = await res.json();
  const tbody = document.getElementById("worklogsTbody");

  tbody.innerHTML = "";

  logs.forEach(l => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${new Date(l.date).toLocaleDateString()}</td>
      <td>${l.project?.name || "Sin proyecto"}</td>
      <td>${l.totalHours}</td>
      <td>
        ${(l.activities || [])
          .map(a => `${a.description} (${a.hours}h)`)
          .join("<br>")}
      </td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteLog('${l._id}')">
          Eliminar
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ENVIAR NUEVO WORKLOG
async function submitWorklog(e) {
  e.preventDefault();
  const form = e.target;

  // Validación mínima
  if (!form.project.value || !form.date.value || !form.activity.value || !form.hours.value) {
    return alert("Todos los campos son obligatorios.");
  }

  const data = {
    project: form.project.value,
    date: form.date.value,
    activities: [
      {
        description: form.activity.value,
        hours: Number(form.hours.value),
        status: "FINALIZADO" // ← VALOR CORRECTO DEL ENUM
      }
    ],
    notes: form.notes.value || ""
  };

  const res = await fetch("/api/worklogs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const j = await res.json();
    return alert(j.msg || "Error guardando worklog");
  }

  alert("Registro guardado correctamente.");

  form.reset();
  loadMyWorklogs();
}

// ELIMINAR WORKLOG
async function deleteLog(id) {
  if (!confirm("¿Eliminar registro?")) return;

  await fetch("/api/worklogs/" + id, {
    method: "DELETE",
    headers: { "Authorization": "Bearer " + token }
  });

  loadMyWorklogs();
}
