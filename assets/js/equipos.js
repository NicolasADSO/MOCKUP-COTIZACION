// ============================================================
// ⚙️ EQUIPOS - Gadier Sistemas (Versión simple CRUD + localStorage + Datos Base)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formAgregarEquipo");
  const nombreInput = document.getElementById("nombreEquipo");
  const denominacionInput = document.getElementById("denominacionEquipo");
  const precioInput = document.getElementById("precioEquipo");
  const tablaBody = document.querySelector("#tablaEquipos tbody");

  /* ======================================================
     🔥 DATOS BASE - EQUIPOS QUEMADOS
  ====================================================== */
  const equiposBase = [
    { nombre: "Computador", denominacion: "Básico", precio: 400000 },
    { nombre: "Computador", denominacion: "Medio", precio: 600000 },
    { nombre: "Computador", denominacion: "Especializado", precio: 1200000 },
    { nombre: "Scanner", denominacion: "Básico", precio: 80000 },
    { nombre: "Scanner", denominacion: "Medio", precio: 150000 },
    { nombre: "Scanner", denominacion: "Especializado", precio: 230000 },
    { nombre: "Lector", denominacion: "Básico", precio: 26000 },
    { nombre: "Lector", denominacion: "Medio", precio: 50000 },
    { nombre: "Lector", denominacion: "Especializado", precio: 95000 },
    { nombre: "Impresora rotuladora", denominacion: "Básico", precio: 42000 },
    { nombre: "Impresora rotuladora", denominacion: "Medio", precio: 86000 },
    { nombre: "Impresora rotuladora", denominacion: "Especializado", precio: 107000 },
  ];

  // === Inicializar localStorage con datos base si está vacío ===
  let equipos = JSON.parse(localStorage.getItem("equipos_data")) || [];
  if (equipos.length === 0) {
    equipos = [...equiposBase];
    localStorage.setItem("equipos_data", JSON.stringify(equipos));
    console.log("✅ Datos base de equipos cargados automáticamente.");
  }

  // === Render inicial ===
  renderTabla();

  /* ======================================================
     ➕ Agregar nuevo equipo manualmente
  ====================================================== */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = nombreInput.value.trim();
    const denominacion = denominacionInput.value.trim();
    const precio = parseFloat(precioInput.value) || 0;

    if (!nombre || !denominacion || precio <= 0) {
      alert("⚠️ Complete todos los campos correctamente.");
      return;
    }

    // Evitar duplicados (mismo nombre + denominación)
    const existe = equipos.some(
      (eq) =>
        eq.nombre.toLowerCase() === nombre.toLowerCase() &&
        eq.denominacion.toLowerCase() === denominacion.toLowerCase()
    );
    if (existe) {
      alert("⚠️ Este equipo con esa denominación ya existe.");
      return;
    }

    equipos.push({ nombre, denominacion, precio });
    guardarDatos();
    renderTabla();
    form.reset();
  });

  /* ======================================================
     📋 Renderizar tabla
  ====================================================== */
  function renderTabla() {
    tablaBody.innerHTML = "";
    if (equipos.length === 0) {
      tablaBody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#777;">No hay equipos registrados.</td></tr>`;
      return;
    }

    equipos.forEach((eq, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${eq.nombre}</td>
        <td>${eq.denominacion}</td>
        <td>$${eq.precio.toLocaleString()}</td>
        <td>
          <button class="btn-eliminar" data-index="${index}"
            style="background:#990f0c;color:#fff;border:none;border-radius:6px;padding:4px 10px;cursor:pointer;">
            🗑️ Eliminar
          </button>
        </td>`;
      tablaBody.appendChild(tr);
    });
  }

  /* ======================================================
     💾 Guardar datos en localStorage
  ====================================================== */
  function guardarDatos() {
    localStorage.setItem("equipos_data", JSON.stringify(equipos));
  }

  /* ======================================================
     🗑️ Eliminar equipo
  ====================================================== */
  tablaBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-eliminar")) {
      const i = e.target.dataset.index;
      if (confirm(`¿Eliminar el equipo "${equipos[i].nombre}" (${equipos[i].denominacion})?`)) {
        equipos.splice(i, 1);
        guardarDatos();
        renderTabla();
      }
    }
  });
});
