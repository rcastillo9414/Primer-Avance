function renderChart(canvasId, labels, data, title) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  // Destruir gráfico anterior (si existe)
  if (window[canvasId] instanceof Chart) {
    try {
      window[canvasId].destroy();
    } catch (e) {
      console.warn("No se pudo destruir el gráfico anterior:", e);
    }
  }

  // Crear nuevo gráfico
  window[canvasId] = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: title,
          data,
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
