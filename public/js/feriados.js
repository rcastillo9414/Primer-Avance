// CARGAR LISTA DE FERIADOS
async function loadHolidays() {
  const tbody = document.getElementById("holidaysTbody");
  tbody.innerHTML = "<tr><td colspan='3'>Cargando...</td></tr>";

  const token = localStorage.getItem("token");

  const res = await fetch("/api/holidays", {
    headers: { "Authorization": "Bearer " + token }
  });

  const json = await res.json();

  if (!res.ok) {
    tbody.innerHTML = "<tr><td colspan='3'>No se pudo cargar</td></tr>";
    return;
  }

  tbody.innerHTML = "";

  json.forEach(h => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${h.name}</td>
      <td>${h.date.substring(0, 10)}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteHoliday('${h._id}')">Eliminar</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// CREAR FERIADO
document.getElementById("holidayForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("holidayName").value;
  const date = document.getElementById("holidayDate").value;

  const token = localStorage.getItem("token");

  const res = await fetch("/api/holidays", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ name, date })
  });

  const json = await res.json();

  if (res.ok) {
    alert("Feriado registrado");
    loadHolidays();
  } else {
    alert(json.msg || "Error al guardar");
  }
});

// ELIMINAR FERIADO
async function deleteHoliday(id) {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/holidays/" + id, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  if (res.ok) {
    loadHolidays();
  } else {
    alert("Error al eliminar");
  }
}

// INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", loadHolidays);
