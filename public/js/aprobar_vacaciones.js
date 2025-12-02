document.addEventListener("DOMContentLoaded", loadPendingRequests);

async function loadPendingRequests() {
  const token = localStorage.getItem("token");
  const tbody = document.getElementById("tbodyVacaciones");

  const res = await fetch("/api/vacations/pending", {
    headers: { "Authorization": "Bearer " + token }
  });

  const data = await res.json();

  if (!res.ok) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center">Error al cargar solicitudes</td></tr>`;
    return;
  }

  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center">No hay solicitudes pendientes</td></tr>`;
    return;
  }

  data.forEach(v => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${v.user?.name || "Usuario eliminado"}</td>
      <td>${v.startDate.substring(0, 10)}</td>
      <td>${v.endDate.substring(0, 10)}</td>
      <td>${v.totalDays}</td>
      <td>${v.status}</td>
      <td>
        <button class="btn btn-success btn-sm" onclick="approve('${v._id}')">Aprobar</button>
        <button class="btn btn-danger btn-sm ms-2" onclick="reject('${v._id}')">Rechazar</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

async function approve(id) {
  updateStatus(id, "approve");
}

async function reject(id) {
  updateStatus(id, "reject");
}

async function updateStatus(id, action) {
  const token = localStorage.getItem("token");

  const res = await fetch(`/api/vacations/${id}/${action}`, {
    method: "PATCH",
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  const data = await res.json();

  if (res.ok) {
    alert(data.msg);
    loadPendingRequests();
  } else {
    alert(data.msg || "Error al actualizar estado");
  }
}
