document.addEventListener("DOMContentLoaded", async () => {
  /* ======================================================
     🔥 DATOS BASE - SUMINISTROS QUEMADOS
  ====================================================== */
  const suministrosBase = [
    { nombre: "Caja x100", precio: 3000 },
    { nombre: "Cajas x200", precio: 6000 },
    { nombre: "Cajas x300", precio: 9000 },
    { nombre: "Rótulos", precio: 500 },
    { nombre: "Carpetas", precio: 1500 },
    { nombre: "Ganchos", precio: 200 },
    { nombre: "Multifolders", precio: 5000 },
  ];

  // Si no existen datos previos en localStorage, se crean automáticamente
  if (!localStorage.getItem("suministros_data")) {
    localStorage.setItem("suministros_data", JSON.stringify(suministrosBase));
    localStorage.setItem("suministros", JSON.stringify(suministrosBase.map(s => s.nombre)));
    console.log("✅ Datos base de suministros cargados automáticamente.");
  }

  /* ======================================================
     🔄 Migrar datos antiguos si existen (versión previa)
  ====================================================== */
  const antiguos = JSON.parse(localStorage.getItem("suministros")) || [];
  const actuales = JSON.parse(localStorage.getItem("suministros_data")) || [];

  if (antiguos.length && actuales.length === 0) {
    const nuevos = antiguos.map(nombre => ({
      nombre,
      precio: 0 // sin precio asignado todavía
    }));
    localStorage.setItem("suministros_data", JSON.stringify(nuevos));
    console.log("✅ Migrados suministros antiguos a formato con precio base.");
  }

  /* ======================================================
     🧭 Cargar Sidebar
  ====================================================== */
  const container = document.getElementById("sidebar-container");
  try {
    const response = await fetch("../../includes/sidebar.html");
    const html = await response.text();
    container.innerHTML = html;
    const script = document.createElement("script");
    script.src = "../js/sidebar.js";
    document.body.appendChild(script);
  } catch (err) {
    console.error("Error cargando sidebar:", err);
  }

  /* ======================================================
     🔧 Referencias principales
  ====================================================== */
  const modalOverlay = document.getElementById("modalOverlay");
  const btnMostrarModal = document.getElementById("btnMostrarModal");
  const btnCerrarModal = document.getElementById("btnCerrarModal");
  const btnCancelar = document.getElementById("btnCancelar");
  const btnGuardar = document.getElementById("btnGuardarSuministro");
  const inputNombre = document.getElementById("nombreSuministro");
  const tablaBody = document.querySelector("#tablaSuministros tbody");

  // Crear campo de precio dinámicamente
  const modalBody = document.querySelector(".modal-body");
  const labelPrecio = document.createElement("label");
  labelPrecio.textContent = "Precio base del suministro:";
  const inputPrecio = document.createElement("input");
  inputPrecio.type = "number";
  inputPrecio.id = "precioBase";
  inputPrecio.placeholder = "Ej. 2500";
  inputPrecio.min = "0";
  inputPrecio.style.marginTop = "8px";
  inputPrecio.style.marginBottom = "10px";
  modalBody.appendChild(labelPrecio);
  modalBody.appendChild(inputPrecio);

  /* ======================================================
     🧾 Cargar tabla de suministros
  ====================================================== */
  function cargarSuministros() {
    const data = JSON.parse(localStorage.getItem("suministros_data")) || [];
    tablaBody.innerHTML = "";

    if (data.length === 0) {
      tablaBody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#777;padding:10px;">Sin suministros registrados</td></tr>`;
      return;
    }

    data.forEach((item, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${item.nombre}</td>
        <td>$${item.precio.toLocaleString()}</td>
        <td style="text-align:center;">
          <button class="btn-eliminar" data-index="${i}" 
            style="background:#990f0c;color:#fff;border:none;border-radius:6px;padding:4px 10px;cursor:pointer;">
            🗑️
          </button>
        </td>`;
      tablaBody.appendChild(tr);
    });

    // === Botones eliminar ===
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
      btn.addEventListener("click", e => {
        const idx = parseInt(e.target.dataset.index);
        const lista = JSON.parse(localStorage.getItem("suministros_data")) || [];
        if (confirm(`¿Eliminar el suministro "${lista[idx].nombre}"?`)) {
          lista.splice(idx, 1);
          localStorage.setItem("suministros_data", JSON.stringify(lista));
          localStorage.setItem("suministros", JSON.stringify(lista.map(s => s.nombre)));
          cargarSuministros();
        }
      });
    });
  }

  /* ======================================================
     🧱 Modal Abrir / Cerrar
  ====================================================== */
  btnMostrarModal.addEventListener("click", () => {
    modalOverlay.classList.add("activo");
    document.body.classList.add("modal-abierto");
    inputNombre.value = "";
    inputPrecio.value = "";
    inputNombre.focus();
  });

  [btnCerrarModal, btnCancelar].forEach(btn => {
    btn.addEventListener("click", () => {
      modalOverlay.classList.remove("activo");
      document.body.classList.remove("modal-abierto");
    });
  });

  /* ======================================================
     💾 Guardar suministro
  ====================================================== */
  btnGuardar.addEventListener("click", () => {
    let nombre = inputNombre.value.trim();
    const precio = parseFloat(inputPrecio.value) || 0;

    if (!nombre) {
      alert("⚠️ Ingrese el nombre del suministro.");
      inputNombre.focus();
      return;
    }
    if (precio <= 0) {
      alert("⚠️ Ingrese un precio base válido.");
      inputPrecio.focus();
      return;
    }

    // Normalizar: primera letra en mayúscula
    nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();

    const lista = JSON.parse(localStorage.getItem("suministros_data")) || [];

    if (lista.some(s => s.nombre.toLowerCase() === nombre.toLowerCase())) {
      alert("⚠️ Este suministro ya existe.");
      return;
    }

    lista.push({ nombre, precio });
    localStorage.setItem("suministros_data", JSON.stringify(lista));
    localStorage.setItem("suministros", JSON.stringify(lista.map(s => s.nombre)));

    alert(`✅ Suministro "${nombre}" agregado correctamente.`);
    modalOverlay.classList.remove("activo");
    document.body.classList.remove("modal-abierto");
    cargarSuministros();
  });

  /* ======================================================
     🚀 Cargar al iniciar
  ====================================================== */
  cargarSuministros();

  console.log("📦 suministros_data:", localStorage.getItem("suministros_data"));
  console.log("📋 suministros:", localStorage.getItem("suministros"));
});
