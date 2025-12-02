document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const isAdmin = user.role === "Administrativo" || user.role === "ATH";

  // Mostrar panel solo para administradores
  if (isAdmin) {
    const panel = document.getElementById("adminProjectPanel");
    if (panel) panel.style.display = "block";
  }

  // Cargar proyectos al inicio
  loadProjects();

  // Crear proyecto
  const form = document.getElementById("createProjectForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!isAdmin) return alert("No tienes permisos para crear proyectos.");

      const body = {
        code: document.getElementById("code").value,
        name: document.getElementById("name").value,
        description: document.getElementById("description")?.value || "",
        budget: Number(document.getElementById("budget").value) || 0,
        resources: Number(document.getElementById("resources").value) || 0
      };

      if (!body.code || !body.name) {
        return alert("Nombre y código son obligatorios");
      }

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(body)
      });

      const json = await res.json();

      if (!res.ok) {
        return alert(json.msg || "Error al crear el proyecto");
      }

      alert("Proyecto creado correctamente");
      form.reset();
      loadProjects();
    });
  }
});

//  CARGAR LISTA DE PROYECTOS
async function loadProjects() {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/projects", {
    headers: { "Authorization": "Bearer " + token }
  });

  const projects = await res.json();

  const tbody = document.getElementById("projectsTbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user.role === "Administrativo" || user.role === "ATH";

  projects.forEach((p) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.code}</td>
      <td>${p.name}</td>
      <td>${p.budget || 0}</td>
      <td>${p.resources || 0}</td>
      <td>${(p.members || []).map(m => m.email).join(", ")}</td>
      <td>
        ${isAdmin ? `
          <button class="btn btn-sm btn-primary" onclick="assignMembers('${p._id}')">
            Asignar Programadores
          </button>
        ` : `<span class="text-muted">No autorizado</span>`}
      </td>
    `;

    tbody.appendChild(tr);
  });
}

//  ASIGNAR MIEMBROS AL PROYECTO
async function assignMembers(projectId) {
  const emails = prompt("Ingresa correos separados por coma:");

  if (!emails) return;

  const token = localStorage.getItem("token");

  const res = await fetch(`/api/projects/${projectId}/members`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      members: emails.split(",").map(e => e.trim())
    })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.msg || "Error actualizando miembros");
    return;
  }

  alert("Miembros actualizados");
  loadProjects();
}
