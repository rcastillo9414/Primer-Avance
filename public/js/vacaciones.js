document.addEventListener("DOMContentLoaded", () => {
  const startInput = document.getElementById("startDate");
  const endInput = document.getElementById("endDate");
  const totalInput = document.getElementById("totalDays");
  const form = document.getElementById("vacationForm");

  // Calcular días automáticamente cuando cambian fechas
  function calculateDays() {
    const start = new Date(startInput.value);
    const end = new Date(endInput.value);

    if (!startInput.value || !endInput.value) {
      totalInput.value = "";
      return;
    }

    if (end < start) {
      totalInput.value = "";
      alert("La fecha final no puede ser menor que la inicial.");
      endInput.value = "";
      return;
    }

    // Calcula días incluyendo el inicio
    const diff = (end - start) / (1000 * 60 * 60 * 24) + 1;

    if (diff < 1) {
      totalInput.value = "";
      alert("El período debe ser al menos de 1 día.");
      return;
    }

    totalInput.value = diff;
  }

  startInput.addEventListener("change", calculateDays);
  endInput.addEventListener("change", calculateDays);

  // Enviar solicitud
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const body = {
      startDate: startInput.value,
      endDate: endInput.value,
      totalDays: Number(totalInput.value)
    };

    if (!body.totalDays || body.totalDays <= 0) {
      alert("Debe seleccionar fechas válidas.");
      return;
    }

    const res = await fetch("/api/vacations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || "Error al enviar solicitud");
      return;
    }

    alert("Solicitud enviada correctamente");
    form.reset();
    totalInput.value = "";
    loadMyVacations();
  });

  // Cargar solicitudes del usuario
  async function loadMyVacations() {
    const token = localStorage.getItem("token");
    const tbody = document.getElementById("myVacationsTable");

    const res = await fetch("/api/vacations", {
      headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();

    tbody.innerHTML = "";

    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center">No hay solicitudes registradas</td></tr>`;
      return;
    }

    data.forEach(v => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${v.startDate.substring(0,10)}</td>
        <td>${v.endDate.substring(0,10)}</td>
        <td>${v.totalDays}</td>
        <td>${v.status}</td>
      `;

      tbody.appendChild(tr);
    });
  }

  // Cargar solicitudes al abrir la página
  loadMyVacations();
});
