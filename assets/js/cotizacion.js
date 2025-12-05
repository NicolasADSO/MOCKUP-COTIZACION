// ============================================================
// 🧾 COTIZACIÓN PRINCIPAL — GADIER SISTEMAS (Mock9)
// Procesos + Subprocesos, integrados con tabla_resumen y módulos extra
// ============================================================

// ============================================================
// 🔎 VARIABLES PARA COTIZACIONES QUE VIENEN DESDE OTRA PÁGINA
// ============================================================
const cotizacionAbrir = localStorage.getItem("cotizacion_a_abrir");
const cotComb = localStorage.getItem("cotizacion_combinada");


document.addEventListener("DOMContentLoaded", () => {
  console.log(
    "%c🚀 Inicializando módulo de Cotización - Gadier Sistemas (Mock9)",
    "color:#990f0c;font-weight:bold;"
  );

  // ===========================================
  // 📌 CLIENTES GUARDADOS — Memoria local
  // ===========================================
  let clientesGuardados = JSON.parse(localStorage.getItem("clientes_guardados")) || [];


  // 🚫 PROCESOS QUE NO DEBEN MOSTRAR "UNIDAD" EN LA TABLA RESUMEN
  const PROCESOS_SIN_UNIDAD = [
    "Diagnóstico",
    "Administración In House",
    "Elaboración de Instrumentos Archivísticos",
    "Consultas",
    "Traslado de archivos"
  ];

  // ============================================================
  // 💰 FORMATEO COP AUXILIAR (solo para inputs de subprocesos)
  // ============================================================
  function formatoCOP(valor) {
    const num = Number(valor) || 0;
    return num.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });
  }

  // ===========================================
  // 💾 Guardar cliente en memoria
  // ===========================================
  function guardarClienteEnMemoria(datos) {
    let clientes = JSON.parse(localStorage.getItem("clientes_guardados")) || [];

    // Usamos correo como identificador único
    const existente = clientes.find(c => c.correo === datos.correo);

    if (existente) {
      existente.nombre = datos.nombre;
      existente.telefono = datos.telefono;
      existente.destinatario = datos.destinatario;
      existente.tipoIdent = datos.tipoIdent;
      existente.numeroIdent = datos.numeroIdent;
    } else {
      clientes.push({
        id: "CLI-" + Date.now(),
        ...datos
      });
    }

    localStorage.setItem("clientes_guardados", JSON.stringify(clientes));
  }


  // ===========================================
  // 📤 Cargar clientes al select del modal
  // ===========================================
  function cargarClientesGuardadosEnSelect() {
    const select = document.getElementById("clienteExistenteSelect");
    if (!select) return;

    const clientes = JSON.parse(localStorage.getItem("clientes_guardados")) || [];

    select.innerHTML = `<option value="">Cliente nuevo</option>`;

    clientes.forEach(c => {
      const option = document.createElement("option");
      option.value = c.id;
      option.textContent = `${c.nombre} (${c.empresa})`;
      select.appendChild(option);
    });
  }

  // ===========================================
  // ✏️ Autocompletar datos del cliente
  // ===========================================
  function activarAutocompletarCliente() {
    const select = document.getElementById("clienteExistenteSelect");
    if (!select) return;

    select.addEventListener("change", e => {
      const id = e.target.value;

      if (!id) {
        document.getElementById("modalNombreCliente").value = "";
        document.getElementById("modalCorreoCliente").value = "";
        document.getElementById("modalTelefonoCliente").value = "";
        document.getElementById("modalDestinatario").value = "";
        document.getElementById("modalNumeroIdent").value = "";
        return;
      }

      const clientes = JSON.parse(localStorage.getItem("clientes_guardados")) || [];
      const cliente = clientes.find(c => c.id === id);

      if (cliente) {
        document.getElementById("modalNombreCliente").value = cliente.nombre;
        document.getElementById("modalCorreoCliente").value = cliente.correo;
        document.getElementById("modalTelefonoCliente").value = cliente.telefono;
        document.getElementById("modalDestinatario").value = cliente.destinatario;
        document.getElementById("modalNumeroIdent").value = cliente.numeroIdent;

        // Seleccionar el tipo Ident
        if (cliente.tipoIdent === "RUNT")
          document.getElementById("identRUNT").checked = true;
        else if (cliente.tipoIdent === "Documento")
          document.getElementById("identCC").checked = true;
      }
    });
  }




  // ============================================================
  // 🧱 MANEJADOR UNIFICADO DE CLIC EN FILAS DE SUBPROCESO
  // Evita que selects/inputs activen o desactiven la fila.
  // ============================================================
  function bindRowClick(rowElement, checkboxSelector = ".chk-subproceso") {
    rowElement.addEventListener("click", (e) => {

      // ❌ Si hacen clic dentro de cualquier control editable → NO togglear
      if (
        e.target.classList.contains("cantidad-sub") ||
        e.target.classList.contains("valor-subproceso") ||
        e.target.classList.contains("unidad-sub") ||
        e.target.classList.contains("duracion-sub") ||
        e.target.tagName === "SELECT" ||
        e.target.tagName === "INPUT"
      ) {
        return;
      }

      // Toggle normal
      const chk = rowElement.querySelector(checkboxSelector);
      if (!chk) return;

      chk.checked = !chk.checked;
      rowElement.classList.toggle("selected", chk.checked);
    });
  }


  // ============================================================
  // 🧩 Normalización corporativa de nombres de subprocesos
  // ============================================================
  const nombreSubprocesoEstandar = {
    "areas": "Áreas",
    "áreas": "Áreas",
    "alistamiento": "Alistamiento",
    "indexacion": "Indexación",
    "indexación": "Indexación",
    "clasificacion": "Clasificación",
    "ordenacion": "Ordenación",
    "descripcion": "Descripción",
    "básicos": "Básicos",
    "medios": "Medios",
    "especializados": "Especializados"
  };

  // Helper para centralizar cómo agregamos al resumen,
  // usando agregarOActualizarResumen si existe (tabla_resumen.js)
  function agregarAlResumen(item) {
    window.resumen = window.resumen || [];

    // 🩹 Normalizador: garantizar que todas las filas tengan tiempo
    if (!item.tiempo || item.tiempo.trim() === "") {
      item.tiempo = "—";
    }

    if (typeof window.agregarOActualizarResumen === "function") {
      window.agregarOActualizarResumen(item);
    } else {
      item.visible = true;
      window.resumen.push(item);
      if (typeof window.renderTabla === "function") window.renderTabla();
    }
  }


  // 🔧 Variables globales por carga de proceso
  let chkTodoProcesoRef = null;
  let cantidadGeneralProcesoRef = null;
  let valorGeneralProcesoRef = null;
  let unidadGeneralProcesoRef = null;
  let duracionGeneralProcesoRef = null;


  const dataProcesos = window.dataProcesos;
  const dataSubprocesos = window.dataSubprocesos;

  // ============================================================
  // 🌍 VARIABLES GLOBALES Y ELEMENTOS UI
  // ============================================================
  const areaSelect = document.getElementById("areaSelect");
  const procesoSelect = document.getElementById("procesoSelect");
  const subprocesosContainer = document.getElementById("subprocesosContainer");
  const subprocesosList = document.getElementById("subprocesosList");

  // Bloque de proceso personalizado
  const otroProcesoContainer = document.getElementById("otroProcesoContainer");
  const nombreOtroProceso = document.getElementById("nombreOtroProceso");
  const nombreSubprocesoManual = document.getElementById("nombreSubproceso");
  const precioSubprocesoManual = document.getElementById("precioSubproceso");
  const listaSubprocesosManuales = document.getElementById("listaSubprocesosManuales");
  const btnAgregarProcesoManual = document.getElementById("btnAgregarProcesoManual");

  window.resumen = window.resumen || [];

  // ============================================================
  // 🧮 FUNCIÓN BASE64 AUXILIAR (usada por PDF / PPT)
  // ============================================================
  window.toBase64 = function (url) {
    return fetch(url)
      .then((r) => r.blob())
      .then(
        (b) =>
          new Promise((res, rej) => {
            const reader = new FileReader();
            reader.onloadend = () => res(reader.result);
            reader.onerror = rej;
            reader.readAsDataURL(b);
          })
      );
  };

  // ============================================================
  // 🧭 SELECCIÓN DE ÁREA Y PROCESO
  // ============================================================
  if (areaSelect && procesoSelect) {
    areaSelect.addEventListener("change", () => {
      const area = areaSelect.value?.trim();

      // Reset de combos/subcontenedores
      procesoSelect.innerHTML = `<option value="">Seleccione proceso...</option>`;
      procesoSelect.disabled = true;

      if (subprocesosContainer) {
        subprocesosContainer.style.display = "none";
        subprocesosList.innerHTML = "";
      }

      if (otroProcesoContainer) {
        otroProcesoContainer.style.display = "none";
      }

      const listaProcesos = dataProcesos[area] || [];
      if (listaProcesos.length > 0) {
        listaProcesos.forEach((proc) => {
          const opt = document.createElement("option");
          opt.value = proc;
          opt.textContent = proc;
          procesoSelect.appendChild(opt);
        });

        // 🔥 Insertar opción destacada al final
        const optPers = document.createElement("option");
        optPers.value = "Proceso personalizado";
        optPers.textContent = "➕ Crear proceso personalizado";
        optPers.style.fontWeight = "bold";
        optPers.style.color = "#990f0c";
        procesoSelect.appendChild(optPers);

        procesoSelect.disabled = false;
      } else {
        console.warn(`⚠️ No hay procesos definidos para el área: ${area}`);
      }
    });
  }

  // ============================================================
  // 📂 CARGA DE SUBPROCESOS — UNIVERSAL + MODO GLOBAL "TODO"
  // ============================================================
  procesoSelect.addEventListener("change", () => {
    const proceso = procesoSelect.value;
    if (!subprocesosList || !subprocesosContainer) return;

    // Reset
    subprocesosList.innerHTML = "";
    subprocesosContainer.style.display = "none";
    if (otroProcesoContainer) otroProcesoContainer.style.display = "none";

    // Caso: Proceso personalizado
    if (proceso === "Proceso personalizado" || proceso === "Otro") {
      otroProcesoContainer.style.display = "block";
      return;
    }
    if (!proceso) return;

    const subps = dataSubprocesos[proceso] || [];
    if (subps.length === 0) {
      return;
    }

    subprocesosContainer.style.display = "block";

    // ============================================================
    // 🚫 CASO ESPECIAL — ALQUILER DE EQUIPOS (HORAS / DÍAS / MESES)
    // ============================================================
    if (proceso === "Alquiler de Equipos") {
      subps.forEach((sp) => {
        const div = document.createElement("div");
        div.className = "subproceso-row";

        div.innerHTML = `
          <div style="flex:2;display:flex;align-items:center;gap:6px;">
    <input type="checkbox" value="${sp.nombre}" class="chk-subproceso">
    <span>${sp.nombre}</span>
    </div>

    <select class="duracion-sub" style="width:110px;">
        <option value="Único">Único</option>
        <option value="Diario">Diario</option>
        <option value="Semanal">Semanal</option>
        <option value="Mensual">Mensual</option>
        <option value="Anual">Anual</option>
    </select>

    <input type="number" class="cantidad-sub"
      placeholder="Cant." min="1"
      style="width:90px;text-align:center;">

    <input type="text" class="valor-subproceso"
      value="${formatoCOP(sp.valor)}"
      data-real="${sp.valor}"
      style="width:100px;text-align:right;">
            `;

        bindRowClick(div);

        div.style.cssText =
          "display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 8px;border:1px solid #ddd;border-radius:6px;margin-bottom:6px;background:#fafafa;";
        subprocesosList.appendChild(div);
      });

      // Botón agregar
      const acciones = document.createElement("div");
      acciones.style.cssText = `
        display:flex;
        justify-content:flex-end;
        margin-top:15px;
        padding-top:10px;
        border-top:2px solid #990f0c;
      `;

      acciones.innerHTML = `
        <button id="btnAgregarUniversal"
          style="background:#990f0c;color:white;border:none;padding:10px 18px;
          border-radius:6px;cursor:pointer;font-weight:600;">
          ➕ Agregar al resumen
        </button>
      `;

      subprocesosList.appendChild(acciones);

      const btn = acciones.querySelector("#btnAgregarUniversal");

      btn.addEventListener("click", () => {
        const area = areaSelect.value;

        const seleccionados = Array.from(
          subprocesosList.querySelectorAll(".chk-subproceso:checked")
        )
          .map((chk) => {
            const fila = chk.closest(".subproceso-row");

            return {
              nombre: chk.value,
              unidad: fila.querySelector(".unidad-sub")
                ? fila.querySelector(".unidad-sub").value
                : "",
              cantidad: parseInt(
                fila.querySelector(".cantidad-sub").value || "0",
                10
              ),
              valor: parseFloat(
                fila.querySelector(".valor-subproceso").dataset.real || "0"
              ),
            };
          })

          .filter((sp) => sp.cantidad > 0 && sp.valor > 0);

        if (!seleccionados.length) {
          return alert("⚠️ Seleccione subprocesos con cantidades válidas.");
        }

        seleccionados.forEach((sp) => {
          const fila = subprocesosList.querySelector(
            `.chk-subproceso[value="${sp.nombre}"]`
          ).closest(".subproceso-row");

          const duracion = fila.querySelector(".duracion-sub")?.value || "Único";

          agregarAlResumen({
            area,
            proceso: proceso,
            unidad: PROCESOS_SIN_UNIDAD.includes(proceso) ? "" : sp.unidad,
            cantidad: sp.cantidad,
            valor: sp.valor,
            costo: sp.valor * sp.cantidad,
            tiempo: duracion,
            subprocesos: [sp.nombre],
          });
        });
      });

      return; // 🔚 Terminamos rama especial de Alquiler de Equipos
    }

    // ============================================================
    // ✔ SI HAY MÁS DE 1 SUBPROCESO → MODO GLOBAL + SUBPROCESOS
    // ============================================================
    if (subps.length > 1) {
      const divGeneral = document.createElement("div");
      divGeneral.className = "subproceso-row";
      divGeneral.style.cssText =
        "display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px;border:2px solid #990f0c;border-radius:6px;margin-bottom:12px;background:#fff7f7;";

      divGeneral.innerHTML = `
      <div style="flex:2;display:flex;align-items:center;gap:8px;">
        <input type="checkbox" id="chkTodoProceso" class="chk-general">
        <strong>Todo el proceso</strong>
      </div>

      <select id="unidadGeneralProceso"
        class="unidad-sub"
        style="width:100px;opacity:0.5;"
        disabled>
          <option value="Documentos">Documentos</option>
          <option value="Carpetas">Carpetas</option>
          <option value="Folder">Folder</option>
          <option value="Acbetas">Acbetas</option>
          <option value="Cajas">Cajas</option>
      </select>

      <select id="duracionGeneralProceso"
        class="duracion-sub"
        style="width:110px;opacity:0.5;"
        disabled>
          <option value="Único">Único</option>
          <option value="Diario">Diario</option>
          <option value="Semanal">Semanal</option>
          <option value="Mensual">Mensual</option>
          <option value="Anual">Anual</option>
      </select>

      <input type="number" id="cantidadGeneralProceso"
        class="cantidad-sub"
        placeholder="Cant."
        min="1"
        style="width:90px;text-align:center;opacity:0.5;"
        disabled>

      <input type="text" id="valorGeneralProceso"
        placeholder="Valor unitario"
        style="width:120px;text-align:right;opacity:0.5;"
        disabled>
      `;


      subprocesosList.appendChild(divGeneral);
      bindRowClick(divGeneral, "#chkTodoProceso");


      chkTodoProcesoRef = divGeneral.querySelector("#chkTodoProceso");
      cantidadGeneralProcesoRef =
        divGeneral.querySelector("#cantidadGeneralProceso");
      valorGeneralProcesoRef = divGeneral.querySelector("#valorGeneralProceso");
      unidadGeneralProcesoRef = divGeneral.querySelector("#unidadGeneralProceso");
      duracionGeneralProcesoRef = divGeneral.querySelector("#duracionGeneralProceso");

      if (PROCESOS_SIN_UNIDAD.includes(proceso)) {
        unidadGeneralProcesoRef.style.display = "none";
      } else {
        unidadGeneralProcesoRef.style.display = "inline-block";
      }


      chkTodoProcesoRef.addEventListener("change", () => {
        const activar = chkTodoProcesoRef.checked;

        // 1️⃣ Habilitar / deshabilitar inputs del modo global
        cantidadGeneralProcesoRef.disabled = !activar;
        valorGeneralProcesoRef.disabled = !activar;
        unidadGeneralProcesoRef.disabled = !activar;
        duracionGeneralProcesoRef.disabled = !activar;

        cantidadGeneralProcesoRef.style.opacity = activar ? "1" : "0.5";
        valorGeneralProcesoRef.style.opacity = activar ? "1" : "0.5";
        unidadGeneralProcesoRef.style.opacity = activar ? "1" : "0.5";
        duracionGeneralProcesoRef.style.opacity = activar ? "1" : "0.5";

        // 2️⃣ Deshabilitar TODOS los subprocesos individuales excepto el bloque global
        subprocesosList.querySelectorAll(".chk-subproceso").forEach(chk => {
          chk.disabled = activar;
        });

        subprocesosList.querySelectorAll(".cantidad-sub").forEach(inp => {
          if (inp.id !== "cantidadGeneralProceso") inp.disabled = activar;
        });

        subprocesosList.querySelectorAll(".valor-subproceso").forEach(inp => {
          if (inp.id !== "valorGeneralProceso") inp.disabled = activar;
        });

        subprocesosList.querySelectorAll(".duracion-sub").forEach(sel => {
          if (sel.id !== "duracionGeneralProceso") sel.disabled = activar;
        });

        subprocesosList.querySelectorAll(".unidad-sub").forEach(sel => {
          if (sel.id !== "unidadGeneralProceso") sel.disabled = activar;
        });

        // 3️⃣ Si activan "Todo el proceso", limpiar selección individual
        if (activar) {
          subprocesosList.querySelectorAll(".chk-subproceso").forEach(chk => {
            chk.checked = false;
            chk.closest(".subproceso-row")?.classList.remove("selected");
          });
        }
      });


    }

    // ============================================================
    // 🔲 SUBPROCESOS NORMALES (UNO O VARIOS)
    // ============================================================
    subps.forEach((sp) => {
      const div = document.createElement("div");
      div.className = "subproceso-row";



      let htmlUnidad = "";

      if (!PROCESOS_SIN_UNIDAD.includes(proceso)) {
        htmlUnidad = `
          <select class="unidad-sub" style="width:100px;">
            <option value="Documentos">Documentos</option>
            <option value="Carpetas">Carpetas</option>
            <option value="Folder">Folder</option>
            <option value="Acbetas">Acbetas</option>
            <option value="Cajas">Cajas</option>
          </select>
        `;
      }

      // Casos sin unidad
      else {
        htmlUnidad = `<span style="width:100px;text-align:center;color:#666;">—</span>`;
      }


      div.innerHTML = `
        <div style="flex:2;display:flex;align-items:center;gap:6px;">
          <input type="checkbox" value="${sp.nombre}" class="chk-subproceso">
          <span>${sp.nombre}</span>
        </div>

        ${htmlUnidad}

        <select class="duracion-sub" style="width:110px;">
          <option value="Único">Único</option>
          <option value="Diario">Diario</option>
          <option value="Semanal">Semanal</option>
          <option value="Mensual">Mensual</option>
          <option value="Anual">Anual</option>
        </select>

        <input type="number" class="cantidad-sub"
          placeholder="Cant." min="1"
          style="width:90px;text-align:center;">

        <input type="text" class="valor-subproceso"
          value="${formatoCOP(sp.valor)}"
          data-real="${sp.valor}"
          style="width:100px;text-align:right;">
      `;

      bindRowClick(div);

      div.style.cssText =
        "display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 8px;border:1px solid #ddd;border-radius:6px;margin-bottom:6px;background:#fafafa;";
      subprocesosList.appendChild(div);
    });

    // ============================================================
    // 🔘 BOTÓN ÚNICO (GLOBAL O INDIVIDUAL SEGÚN ESTADO)
    // ============================================================
    const acciones = document.createElement("div");
    acciones.style.cssText = `
      display:flex;
      justify-content:flex-end;
      margin-top:15px;
      padding-top:10px;
      border-top:2px solid #990f0c;
    `;

    acciones.innerHTML = `
      <button id="btnAgregarUniversal"
        style="background:#990f0c;color:white;border:none;padding:10px 18px;
        border-radius:6px;cursor:pointer;font-weight:600;">
        ➕ Agregar al resumen
      </button>
    `;

    subprocesosList.appendChild(acciones);

    const btnAgregarUniversal = acciones.querySelector("#btnAgregarUniversal");

    // ============================================================
    // 🎯 LÓGICA DEL BOTÓN ÚNICO
    // ============================================================
    btnAgregarUniversal.addEventListener("click", () => {
      const area = areaSelect.value;

      // ======= MODO GLOBAL =======
      if (chkTodoProcesoRef && chkTodoProcesoRef.checked) {
        const cantidad = parseInt(
          cantidadGeneralProcesoRef.value || "0",
          10
        );
        if (cantidad <= 0)
          return alert("⚠️ Ingrese cantidad global válida.");

        const rawValor = valorGeneralProcesoRef.value.replace(/\D/g, "");
        const valorUnitario = parseFloat(rawValor || "0");
        if (valorUnitario <= 0)
          return alert("⚠️ Ingrese valor unitario válido.");

        const costo = cantidad * valorUnitario;

        const duracion = duracionGeneralProcesoRef.value || "Único";

        agregarAlResumen({
          area,
          proceso,
          unidad: unidadGeneralProcesoRef.value,
          cantidad,
          valor: valorUnitario,
          costo,
          tiempo: duracion,
          subprocesos: ["Todo el proceso"],
          isGlobal: true,
        });

        return;
      }

      // =========== MODO INDIVIDUAL ============
      const seleccionados = Array.from(
        subprocesosList.querySelectorAll(".chk-subproceso:checked")
      )
        .map((chk) => {
          const fila = chk.closest(".subproceso-row");
          return {
            nombre: chk.value,
            unidad: fila.querySelector(".unidad-sub")
              ? fila.querySelector(".unidad-sub").value
              : "",
            cantidad: parseInt(
              fila.querySelector(".cantidad-sub").value || "0",
              10
            ),
            valor: parseFloat(
              fila.querySelector(".valor-subproceso").dataset.real || "0"
            ),
          };
        })
        .filter((sp) => sp.cantidad > 0 && sp.valor > 0);

      if (!seleccionados.length) {
        return alert("⚠️ Seleccione subprocesos y cantidades válidas.");
      }

      seleccionados.forEach((sp) => {
        const key = sp.nombre
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();

        const nombreLimpio = nombreSubprocesoEstandar[key] || sp.nombre;

        const fila = subprocesosList.querySelector(
          `.chk-subproceso[value="${sp.nombre}"]`
        ).closest(".subproceso-row");

        agregarAlResumen({
          area,
          proceso: proceso,
          unidad: PROCESOS_SIN_UNIDAD.includes(proceso)
            ? ""
            : fila.querySelector(".unidad-sub")?.value || "",
          cantidad: sp.cantidad,
          valor: sp.valor,
          costo: sp.valor * sp.cantidad,
          tiempo: fila.querySelector(".duracion-sub")?.value || "Único",
          subprocesos: [nombreLimpio],
        });
      });
    });
  });

  // ============================================================
  // ✏️ FORMATEO EN VIVO DE CAMPOS valor-subproceso
  // ============================================================
  document.addEventListener("input", (e) => {
    if (e.target.classList.contains("valor-subproceso")) {
      const limpio = e.target.value.replace(/\D/g, "");
      e.target.dataset.real = limpio;
      e.target.value = formatoCOP(limpio);
    }
  });

  // ============================================================
  // ✏️ FORMATEO EN VIVO DEL VALOR GLOBAL (TODO EL PROCESO)
  // ============================================================
  document.addEventListener("input", (e) => {
    if (e.target.id === "valorGeneralProceso") {
      const limpio = e.target.value.replace(/\D/g, "");
      e.target.dataset.real = limpio;
      e.target.value = formatoCOP(limpio);
    }
  });

  // ============================================================
  // 🧩 PROCESO PERSONALIZADO MANUAL
  // ============================================================
  if (btnAgregarProcesoManual) {
    btnAgregarProcesoManual.addEventListener("click", () => {
      const area = areaSelect.value || "Archivístico";
      const nombreProceso = (nombreOtroProceso.value || "").trim();
      const nombreSub = (nombreSubprocesoManual.value || "").trim();
      const precio = parseFloat(precioSubprocesoManual.value || "0");

      if (!nombreProceso) {
        return alert("⚠️ Escriba el nombre del proceso personalizado.");
      }
      if (precio <= 0) {
        return alert("⚠️ Ingrese un valor válido para el subproceso.");
      }

      agregarAlResumen({
        area,
        proceso: nombreProceso,
        cantidad: 1,
        valor: precio,
        costo: precio,
        tiempo: "—", // <--- AGREGADO
        subprocesos: nombreSub ? [nombreSub] : [],
      });


      // Podrías listar los subprocesos manuales en la UL si quieres verlos:
      listaSubprocesosManuales.innerHTML = "";
      if (nombreSub) {
        const li = document.createElement("li");
        li.textContent = `${nombreSub} — ${formatoCOP(precio)}`;
        listaSubprocesosManuales.appendChild(li);
      }

      // Reset campos
      // (dejamos el nombre del proceso por si quiere agregar más cosas con mismo título)
      nombreSubprocesoManual.value = "";
      precioSubprocesoManual.value = "";
    });
  }

  // ============================================================
  // 🤝 ALIADOS ESTRATÉGICOS — INTEGRACIÓN A COTIZACIÓN
  // ============================================================
  console.log("🤝 Cargando módulo de Aliados en Cotización...");

  const selectAliado = document.getElementById("selectAliado");
  const selectServicioAliado = document.getElementById("selectServicioAliado");
  const btnAgregarAliado = document.getElementById("btnAgregarAliado");

  if (selectAliado && selectServicioAliado && btnAgregarAliado) {
    // === 1️⃣ cargar aliados desde localStorage ===
    const aliadosLS = JSON.parse(localStorage.getItem("aliados_data")) || [];

    aliadosLS.forEach((ali, i) => {
      const opt = document.createElement("option");
      opt.value = i; // índice
      opt.textContent = ali.nombre;
      selectAliado.appendChild(opt);
    });

    // === 2️⃣ cuando selecciono un aliado, cargar sus servicios ===
    selectAliado.addEventListener("change", () => {
      const index = selectAliado.value;

      selectServicioAliado.innerHTML = `<option value="">Seleccione servicio...</option>`;

      if (!index && index !== 0) return;

      const ali = aliadosLS[index];

      (ali.servicios || []).forEach((srv, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = `${srv.nombre} — $${srv.valor.toLocaleString()}`;
        opt.dataset.valor = srv.valor;
        opt.dataset.nombre = srv.nombre;
        selectServicioAliado.appendChild(opt);
      });
    });

    // === 3️⃣ agregar al resumen ===
    btnAgregarAliado.addEventListener("click", () => {
      const indexAli = selectAliado.value;
      const indexSrv = selectServicioAliado.value;

      if (!indexAli && indexAli !== 0) {
        return alert("Seleccione un aliado.");
      }
      if (!indexSrv && indexSrv !== 0) {
        return alert("Seleccione un servicio del aliado.");
      }

      const ali = aliadosLS[indexAli];
      const srv = ali.servicios[indexSrv];

      agregarAlResumen({
        area: "Aliados",
        proceso: `${ali.nombre} — ${srv.nombre}`,
        cantidad: 1,
        valor: srv.valor,
        costo: srv.valor,
        tiempo: "—", // <--- AGREGADO
      });

      // Reset visual
      selectAliado.value = "";
      selectServicioAliado.innerHTML = `<option value="">Seleccione servicio...</option>`;
    });
  }

  // ============================================================
  // 🔄 CARGAR UNA COTIZACIÓN GUARDADA EN LA TABLA RESUMEN
  // ============================================================
  window.cargarCotizacionEnEditor = function (cot) {
    if (!cot) return;

    // 1️⃣ Vaciar resumen actual
    window.resumen = [];

    // 2️⃣ Cargar cada item al resumen
    cot.items.forEach(item => {
      window.resumen.push({
        area: item.area,
        proceso: item.proceso,
        subprocesos: item.subprocesos || [],
        unidad: item.unidad,
        cantidad: item.cantidad,
        valor: item.valor,
        costo: item.costo,
        tiempo: item.tiempo,
        visible: true
      });
    });

    // 3️⃣ Renderizar tabla resumen
    if (typeof window.renderTabla === "function") {
      window.renderTabla();
    }

    // 4️⃣ Cargar datos del cliente en el modal universal
    window.datosClienteGlobal = { ...cot.cliente };

    alert("✔ Cotización cargada para edición.");
  };


  // ============================================================
  // 📦 OBTENER COTIZACIÓN ACTUAL (Para guardar PDF / PPT)
  // ============================================================
  window.obtenerCotizacionActual = function () {

    if (!window.resumen || window.resumen.length === 0) return null;

    const visibles = window.resumen.filter(r => r.visible !== false);

    // --- Datos del cliente ---
    const d = window.datosClienteGlobal || {};

    // --- Gastos, IVA, Descuento ---
    const gastos = parseFloat(document.getElementById("gastosInput")?.dataset.real || 0) || 0;
    const descuento = parseFloat(document.getElementById("descuentoInput")?.value || 0) || 0;
    const aplicarIVA = document.getElementById("chkIVA")?.checked || false;

    // --- Totales ---
    let subtotal = 0;
    visibles.forEach(r => {
      const base = r.costo ?? (r.cantidad * (r.valor || 0));
      subtotal += base;
    });

    const descValor = subtotal * (descuento / 100);
    const subDesc = subtotal - descValor;
    const iva = aplicarIVA ? subDesc * 0.19 : 0;
    const totalFinal = subDesc + iva + gastos;

    return {
      id: "COT-" + Date.now(),
      fecha: new Date().toLocaleString("es-CO"),
      cliente: {
        nombre: d.nombre || "",
        correo: d.correo || "",
        telefono: d.telefono || "",
        destinatario: d.destinatario || "",
        tipoIdent: d.tipoIdent || "",
        numeroIdent: d.numeroIdent || ""
      },
      configuracion: {
        descuento,
        gastos,
        aplicarIVA
      },
      items: visibles.map(r => ({
        area: r.area,
        proceso: r.proceso,
        subprocesos: r.subprocesos || [],
        unidad: r.unidad,
        cantidad: r.cantidad,
        valor: r.valor,
        costo: r.costo ?? (r.cantidad * r.valor),
        tiempo: r.tiempo
      })),
      subtotal,
      descValor,
      iva,
      totalFinal
    };
  };

  // ============================================================
  // 💾 GUARDAR COTIZACIÓN EN HISTORIAL
  // ============================================================
  window.guardarCotizacion = function (cotizacion) {

    if (!cotizacion) return;

    const guardadas = JSON.parse(localStorage.getItem("cotizaciones_guardadas")) || [];

    guardadas.push(cotizacion);

    localStorage.setItem("cotizaciones_guardadas", JSON.stringify(guardadas));

    console.log("💾 Cotización guardada:", cotizacion.id);
  };



  // ============================================================
  // 🟦 PROCESAR COTIZACIÓN INDIVIDUAL
  // ============================================================
  if (cotizacionAbrir) {
    const cot = JSON.parse(cotizacionAbrir);
    localStorage.removeItem("cotizacion_a_abrir");
    window.cargarCotizacionEnEditor(cot);
  }

  // ============================================================
  // 🟩 PROCESAR COTIZACIÓN COMBINADA
  // ============================================================
  if (cotComb) {
    const cot = JSON.parse(cotComb);
    localStorage.removeItem("cotizacion_combinada");
    window.cargarCotizacionEnEditor(cot);
  }



});
