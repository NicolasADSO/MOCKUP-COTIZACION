// ============================================================
// 🧾 COTIZACIÓN PRINCIPAL — GADIER SISTEMAS (Mock9)
// Procesos + Subprocesos, integrados con tabla_resumen y módulos extra
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  console.log(
    "%c🚀 Inicializando módulo de Cotización - Gadier Sistemas (Mock9)",
    "color:#990f0c;font-weight:bold;"
  );

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

  // Helper para centralizar cómo agregamos al resumen,
  // usando agregarOActualizarResumen si existe (tabla_resumen.js)
  function agregarAlResumen(item) {
    window.resumen = window.resumen || [];
    if (typeof window.agregarOActualizarResumen === "function") {
      window.agregarOActualizarResumen(item);
    } else {
      item.visible = true;
      window.resumen.push(item);
      if (typeof window.renderTabla === "function") window.renderTabla();
    }
  }

  // ============================================================
  // 📚 CATÁLOGO DE PROCESOS Y SUBPROCESOS — ÁREA ARCHIVÍSTICO
  // ============================================================

  const procesosConCantidadIndividual = [
    "Diagnóstico",
    "Elaboración de Instrumentos Archivísticos",
  ];

  // 🔹 Puedes extender esto luego con más áreas (Bibliotecología, etc.)
  const dataProcesos = {
    Archivístico: [
      "Diagnóstico",
      "Actualización de Archivos Electrónicos",
      "Administración In House",
      "Alquiler de Equipos",
      "Asesoría y cumplimiento de la ley",
      "Consultoría",
      "Elaboración de Instrumentos Archivísticos",
      "Organización",
      "Depuración y Eliminación",
      "Custodia",
      "Proceso personalizado", // Para activar el bloque manual
    ],
    Bibliotecología: [
      // Por ahora solo dejamos el proceso personalizado
      "Proceso personalizado",
    ],
  };

  const dataSubprocesos = {
    Diagnóstico: [{ nombre: "areas", valor: 18000 }],

    "Actualización de Archivos Electrónicos": [
      { nombre: "Alistamiento", valor: 18000 },
      { nombre: "Indexación", valor: 25000 },
    ],

    "Administración In House": [
      { nombre: "Tiempo completo", valor: 35000 },
      { nombre: "Parcial", valor: 22000 },
    ],

    "Alquiler de Equipos": [
      { nombre: "Básicos", valor: 12000 },
      { nombre: "Medios", valor: 18000 },
      { nombre: "Especializados", valor: 25000 },
    ],

    "Asesoría y cumplimiento de la ley": [
      { nombre: "Registro de activos de información", valor: 40000 },
      { nombre: "Índice de información clasificada y reservada", valor: 45000 },
      { nombre: "Esquema de publicación de infomración", valor: 50000 },
    ],

    Consultoría: [
      { nombre: "Análisis de Requerimientos", valor: 42000 },
      { nombre: "Diseño de Políticas Documentales", valor: 48000 },
      { nombre: "Gestión de Riesgos Archivísticos", valor: 46000 },
      { nombre: "Evaluación de Cumplimiento", valor: 44000 },
    ],

    "Elaboración de Instrumentos Archivísticos": [
      { nombre: "PINAR", valor: 18000 },
      { nombre: "TRD", valor: 25000 },
      { nombre: "INVENTARIOS", valor: 20000 },
      { nombre: "TVD", valor: 22000 },
      { nombre: "PGD", valor: 30000 },
      { nombre: "ID", valor: 27000 },
      { nombre: "RGD", valor: 25000 },
      { nombre: "MPA", valor: 32000 },
      { nombre: "CCD", valor: 28000 },
    ],

    Organización: [
      { nombre: "Clasificacion", valor: 22000 },
      { nombre: "Ordenación", valor: 24000 },
      { nombre: "Descripción", valor: 28000 },
    ],

    "Depuración y Eliminación": [
      { nombre: "Revisión de series documentales", valor: 20000 },
      { nombre: "Aplicación de Tablas de Retención Documental (TRD)", valor: 23000 },
      { nombre: "Identificación de expedientes para eliminación", valor: 22000 },
      { nombre: "Elaboración de actas de eliminación", valor: 24000 },
      { nombre: "Gestión de aprobación ante comité evaluador", valor: 26000 },
      { nombre: "Destrucción física o digital controlada", valor: 28000 },
      { nombre: "Informe final de eliminación documental", valor: 25000 },
    ],

    Custodia: [
      { nombre: "Recepción y verificación de fondos documentales", valor: 20000 },
      {
        nombre: "Clasificación por series y unidades de conservación",
        valor: 22000,
      },
      { nombre: "Rotulación y codificación de cajas o contenedores", valor: 21000 },
      { nombre: "Ingreso en sistema de control de depósitos", valor: 23000 },
      { nombre: "Ubicación física en estantería o depósito", valor: 20000 },
      {
        nombre: "Seguimiento y control periódico de conservación",
        valor: 24000,
      },
      { nombre: "Entrega o retiro bajo acta de custodia", valor: 25000 },
    ],
  };

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
        procesoSelect.disabled = false;
      } else {
        console.warn(`⚠️ No hay procesos definidos para el área: ${area}`);
      }
    });
  }

  // ============================================================
  // 📂 CARGA DE SUBPROCESOS SEGÚN PROCESO SELECCIONADO
  // ============================================================

  if (procesoSelect) {
    procesoSelect.addEventListener("change", () => {
      const proceso = procesoSelect.value;
      if (!subprocesosList || !subprocesosContainer) return;

      // Limpiar vistas
      subprocesosList.innerHTML = "";
      subprocesosContainer.style.display = "none";
      if (otroProcesoContainer) {
        otroProcesoContainer.style.display = "none";
      }

      // Caso: Proceso personalizado → mostramos el bloque manual
      if (proceso === "Proceso personalizado") {
        if (otroProcesoContainer) {
          otroProcesoContainer.style.display = "block";
        }
        return;
      }

      if (!proceso) return;

      const subps = dataSubprocesos[proceso] || [];

      // === CASO ESPECIAL: Elaboración de Instrumentos Archivísticos ===
      if (proceso === "Elaboración de Instrumentos Archivísticos") {
        if (!subps.length) return;
        subprocesosContainer.style.display = "block";

        subps.forEach((sp) => {
          const div = document.createElement("div");
          div.className = "subproceso-row";
          div.innerHTML = `
            <div style="flex:2;display:flex;align-items:center;gap:6px;">
              <input type="checkbox" value="${sp.nombre}" class="chk-subproceso">
              <span>${sp.nombre}</span>
            </div>
            <input type="number" class="cantidad-area" placeholder="Cant. áreas" min="1"
              style="width:90px;text-align:center;">
            <input type="text" class="valor-subproceso"
              value="${formatoCOP(sp.valor)}"
              data-real="${sp.valor}"
              style="width:100px;text-align:right;">
          `;
          div.style.cssText =
            "display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 8px;border:1px solid #ddd;border-radius:6px;margin-bottom:6px;background:#fafafa;";
          subprocesosList.appendChild(div);
        });

        const btn = document.createElement("button");
        btn.textContent = "➕ Agregar seleccionados al resumen";
        btn.style.cssText =
          "background:#990f0c;color:white;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;font-weight:600;margin-top:10px;float:right;";
        subprocesosList.appendChild(btn);

        btn.addEventListener("click", () => {
          const area = areaSelect.value;
          const seleccionados = Array.from(
            subprocesosList.querySelectorAll(".chk-subproceso:checked")
          )
            .map((chk) => {
              const fila = chk.closest(".subproceso-row");
              const inputValor = fila.querySelector(".valor-subproceso");
              const valor = parseFloat(inputValor.dataset.real || inputValor.value || 0);
              const cantidad =
                parseInt(fila.querySelector(".cantidad-area").value, 10) || 0;
              return { nombre: chk.value, valor, cantidad };
            })
            .filter((sp) => sp.cantidad > 0 && sp.valor > 0);

          if (!seleccionados.length) {
            return alert("⚠️ Debe seleccionar al menos un subproceso válido.");
          }

          seleccionados.forEach((sp) => {
            const procesoCompuesto = `${proceso} - ${sp.nombre}`;
            const costo = sp.valor * sp.cantidad;

            agregarAlResumen({
              area,
              proceso: procesoCompuesto,
              cantidad: sp.cantidad,
              valor: sp.valor,
              costo,
              subprocesos: [sp.nombre],
            });
          });
        });

        return;
      }

      // === CASO GENERAL (con posible cantidad individual por subproceso) ===
      if (subps.length > 0) {
        subprocesosContainer.style.display = "block";

        subps.forEach((sp) => {
          const div = document.createElement("div");
          div.className = "subproceso-row";

          const requiereCantidadIndividual =
            procesosConCantidadIndividual.includes(proceso);

          div.innerHTML = `
            <div style="flex:2;display:flex;align-items:center;gap:6px;">
              <input type="checkbox" value="${sp.nombre}" class="chk-subproceso">
              <span>${sp.nombre}</span>
            </div>
            ${
              requiereCantidadIndividual
                ? `<input type="number" class="cantidad-area" placeholder="Cant." min="1" style="width:90px;text-align:center;">`
                : ``
            }
            <input type="text" class="valor-subproceso"
              value="${formatoCOP(sp.valor)}"
              data-real="${sp.valor}"
              style="width:100px;text-align:right;">
          `;

          div.style.cssText =
            "display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 8px;border:1px solid #ddd;border-radius:6px;margin-bottom:6px;background:#fafafa;";
          subprocesosList.appendChild(div);
        });

        // === Bloque de cantidad + botón general ===
        const bloqueAccion = document.createElement("div");
        bloqueAccion.style.cssText = `
          display:flex;
          justify-content:flex-end;
          align-items:center;
          gap:10px;
          margin-top:15px;
          padding:10px;
          border-top:2px solid #990f0c;
        `;
        bloqueAccion.innerHTML = `
          <input type="number" id="cantidadGeneral" placeholder="Cantidad" min="1"
            style="width:90px;text-align:center;border:1px solid #ccc;border-radius:6px;">
          <button id="btnAgregarSubprocesos"
            style="background:#990f0c;color:white;border:none;padding:8px 14px;
            border-radius:6px;cursor:pointer;font-weight:600;">
            ➕ Agregar seleccionados al resumen
          </button>
        `;
        subprocesosList.appendChild(bloqueAccion);

        // === Lógica del botón de agregar ===
        bloqueAccion
          .querySelector("#btnAgregarSubprocesos")
          .addEventListener("click", () => {
            const area = areaSelect.value;
            const cantidadGeneral =
              parseInt(document.getElementById("cantidadGeneral").value, 10) || 1;

            const requiereCantidadIndividual =
              procesosConCantidadIndividual.includes(proceso);

            const seleccionados = Array.from(
              subprocesosList.querySelectorAll(".chk-subproceso:checked")
            )
              .map((chk) => {
                const fila = chk.closest(".subproceso-row");
                const inputValor = fila.querySelector(".valor-subproceso");
                const inputCantidad = fila.querySelector(".cantidad-area");

                return {
                  nombre: chk.value,
                  valor: parseFloat(inputValor.dataset.real || 0),
                  cantidad: requiereCantidadIndividual
                    ? parseInt(inputCantidad?.value || "0", 10)
                    : null,
                };
              })
              .filter((sp) => sp.valor > 0);

            if (!seleccionados.length) {
              return alert("⚠️ Debe seleccionar al menos un subproceso válido.");
            }

            // 🔥 Cálculo correcto según el tipo de proceso
            let costoNuevo = 0;
            let valorUnitario = 0;
            let cantidadFinal = 0;
            const nombresSubprocesos = seleccionados.map((sp) => sp.nombre);

            if (requiereCantidadIndividual) {
              // PROCESOS CON CANTIDAD POR SUBPROCESO
              seleccionados.forEach((sp) => {
                if (sp.cantidad && sp.cantidad > 0) {
                  costoNuevo += sp.valor * sp.cantidad;
                  cantidadFinal += sp.cantidad;
                }
              });

              if (cantidadFinal > 0) {
                valorUnitario = costoNuevo / cantidadFinal;
              }
            } else {
              // PROCESOS NORMALES
              valorUnitario = seleccionados.reduce(
                (sum, sp) => sum + sp.valor,
                0
              );
              cantidadFinal = cantidadGeneral;
              costoNuevo = valorUnitario * cantidadFinal;
            }

            if (cantidadFinal <= 0 || costoNuevo <= 0) {
              return alert("⚠️ Verifique cantidades y valores ingresados.");
            }

            agregarAlResumen({
              area,
              proceso,
              cantidad: cantidadFinal,
              valor: valorUnitario,
              costo: costoNuevo,
              subprocesos: nombresSubprocesos,
            });
          });
      }
    });
  }

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
      });

      // Reset visual
      selectAliado.value = "";
      selectServicioAliado.innerHTML = `<option value="">Seleccione servicio...</option>`;
    });
  }

});
