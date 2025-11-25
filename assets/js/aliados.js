document.addEventListener("DOMContentLoaded", () => {

  // ========= REFERENCIAS ===========  
  const inputNombre = document.getElementById("inputNombre");
  const inputTipo = document.getElementById("inputTipo");
  const inputCorreo = document.getElementById("inputCorreo");
  const inputTelefono = document.getElementById("inputTelefono");
  const btnGuardar = document.getElementById("btnGuardarAliado");

  const gridAliados = document.getElementById("gridAliados");
  const panelDetalle = document.getElementById("detalleAliado");
  const btnVolver = document.getElementById("btnVolver");

  const detalleNombre = document.getElementById("detalleNombre");
  const detalleTipo = document.getElementById("detalleTipo");
  const detalleCorreo = document.getElementById("detalleCorreo");
  const detalleTelefono = document.getElementById("detalleTelefono");

  // === FORMULARIO DE SERVICIOS ===
  const listaServicios = document.getElementById("listaServicios");
  const btnAgregarServicio = document.getElementById("btnAgregarServicio");
  const formServicio = document.getElementById("formServicio");
  const servicioNombre = document.getElementById("servicioNombre");
  const servicioValor = document.getElementById("servicioValor");
  const btnGuardarServicio = document.getElementById("btnGuardarServicio");

  // ========= DATA ==========
  let aliados = JSON.parse(localStorage.getItem("aliados_data")) || [];
  let editIndex = null;


  // ============================================================
  // 💾 GUARDAR / EDITAR ALIADO
  // ============================================================
  function guardar() {
    const obj = {
      nombre: inputNombre.value.trim(),
      tipo: inputTipo.value.trim(),
      correo: inputCorreo.value.trim(),
      telefono: inputTelefono.value.trim(),
      servicios: aliados[editIndex]?.servicios || [] 
    };

    if (editIndex !== null) {
      aliados[editIndex] = obj;
    } else {
      aliados.push(obj);
    }

    localStorage.setItem("aliados_data", JSON.stringify(aliados));

    inputNombre.value = "";
    inputTipo.value = "";
    inputCorreo.value = "";
    inputTelefono.value = "";
    editIndex = null;

    renderCards();
  }


  // ============================================================
  // ❌ ELIMINAR ALIADO
  // ============================================================
  function eliminar(index) {
    if (!confirm("¿Eliminar este aliado?")) return;

    aliados.splice(index, 1);
    localStorage.setItem("aliados_data", JSON.stringify(aliados));

    renderCards();
    panelDetalle.classList.add("oculto");
  }


  // ============================================================
  // 🟧 ABRIR DETALLE
  // ============================================================
  function abrirDetalle(i) {
    const a = aliados[i];

    detalleNombre.textContent = a.nombre;
    detalleTipo.textContent = a.tipo;
    detalleCorreo.textContent = a.correo || "N/A";
    detalleTelefono.textContent = a.telefono || "N/A";

    panelDetalle.dataset.index = i;

    // 🔥 Ocultar formulario SIEMPRE al entrar al detalle
    formServicio.classList.add("oculto");

    // Cargar lista de servicios
    renderServicios(i);

    panelDetalle.classList.remove("oculto");
    gridAliados.classList.add("oculto");
  }


  // ============================================================
  // 🟫 RENDERIZAR SERVICIOS
  // ============================================================
  function renderServicios(index) {
    const ali = aliados[index];
    listaServicios.innerHTML = "";

    ali.servicios.forEach((srv, i) => {
      const li = document.createElement("li");

      li.innerHTML = `
        ${srv.nombre} — <strong>$${srv.valor.toLocaleString()}</strong>
        <button class="btn-mini-eliminar" data-delserv="${i}">🗑</button>
      `;

      li.querySelector("button").addEventListener("click", () => {
        ali.servicios.splice(i, 1);
        localStorage.setItem("aliados_data", JSON.stringify(aliados));
        renderServicios(index);
      });

      listaServicios.appendChild(li);
    });
  }


  // ============================================================
  // ➕ GUARDAR SERVICIO (evento global)
  // ============================================================
  btnGuardarServicio.addEventListener("click", () => {
    const index = panelDetalle.dataset.index;
    const ali = aliados[index];

    const nombre = servicioNombre.value.trim();
    const valor = Number(servicioValor.value.trim());

    if (!nombre || isNaN(valor)) {
      alert("Complete todos los campos del servicio.");
      return;
    }

    ali.servicios.push({ nombre, valor });

    localStorage.setItem("aliados_data", JSON.stringify(aliados));

    servicioNombre.value = "";
    servicioValor.value = "";

    formServicio.classList.add("oculto");

    renderServicios(index);
  });


  // ============================================================
  // 🔙 VOLVER A LISTA
  // ============================================================
  btnVolver.addEventListener("click", () => {
    panelDetalle.classList.add("oculto");
    gridAliados.classList.remove("oculto");
  });


  // ============================================================
  // Mostrar/Ocultar formulario de servicio
  // ============================================================
  btnAgregarServicio.addEventListener("click", () => {
    formServicio.classList.toggle("oculto");
  });


  // ============================================================
  // 🟦 RENDERIZAR CARDS
  // ============================================================
  function renderCards() {
    gridAliados.innerHTML = "";

    aliados.forEach((a, i) => {
      const card = document.createElement("div");
      card.className = "aliado-card";

      card.innerHTML = `
        <h3>🤝 ${a.nombre}</h3>
        <p>${a.tipo}</p>
        <p class="mas-info">Ver más →</p>

        <div class="acciones-card">
          <button class="btn-mini-editar" data-edit="${i}">✏️</button>
          <button class="btn-mini-eliminar" data-del="${i}">🗑</button>
        </div>
      `;

      // Abrir detalle
      card.addEventListener("click", (e) => {
        if (e.target.dataset.edit || e.target.dataset.del) return;
        abrirDetalle(i);
      });

      // Editar aliado
      card.querySelector(".btn-mini-editar").addEventListener("click", () => {
        editIndex = i;

        inputNombre.value = a.nombre;
        inputTipo.value = a.tipo;
        inputCorreo.value = a.correo;
        inputTelefono.value = a.telefono;

        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      // Eliminar aliado
      card.querySelector(".btn-mini-eliminar").addEventListener("click", () => {
        eliminar(i);
      });

      gridAliados.appendChild(card);
    });
  }


  // ============================================================
  // EVENTOS
  // ============================================================
  btnGuardar.addEventListener("click", guardar);

  // Inicialización
  renderCards();

});
