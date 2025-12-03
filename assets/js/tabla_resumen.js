// ============================================================
// 🧮 TABLA DE RESUMEN — GADIER SISTEMAS
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  const tablaBody = document.querySelector("#tablaResumen tbody");
  const totalGeneralEl = document.getElementById("totalGeneral");
  const descuentoInput = document.getElementById("descuentoInput");
  const btnVaciar = document.getElementById("btnVaciar");

  let aplicarIVA = false;
  let ocultarGastos = false;


  // ============================================================
  // 🆕 CASILLA "Gastos Adicionales"
  // (Ahora SIEMPRE añadimos listener porque YA existe en el HTML)
  // ============================================================

  const gastosInput = document.getElementById("gastosInput");

  if (gastosInput) {
    gastosInput.addEventListener("input", (e) => {
      const limpio = e.target.value.replace(/\D/g, "");
      e.target.dataset.real = limpio || 0;
      e.target.value = Number(limpio || 0).toLocaleString("es-CO");
      renderTabla();
    });
  }

  // Listener para ocultar gastos adicionales
  const chkOcultarGastos = document.getElementById("ocultarGastos");
  if (chkOcultarGastos) {
    chkOcultarGastos.addEventListener("change", () => {
      ocultarGastos = chkOcultarGastos.checked;
      renderTabla();
    });
  }



  // ============================================================
  // ✅ CHECKBOX IVA
  // ============================================================
  if (!document.querySelector(".iva-box")) {
    const ivaBox = document.createElement("div");
    ivaBox.className = "form-group iva-box";
    ivaBox.innerHTML = `
      <label style="display:flex;align-items:center;gap:8px;font-weight:500;margin-top:5px;">
        <input type="checkbox" id="chkIVA" style="transform:scale(1.2);cursor:pointer;">
        Aplicar IVA (19%)
      </label>
    `;

    const gastosBox = document.querySelector(".gastos-box");
    if (gastosBox) gastosBox.insertAdjacentElement("afterend", ivaBox);

    document.getElementById("chkIVA").addEventListener("change", e => {
      aplicarIVA = e.target.checked;
      renderTabla();
    });
  }

  // ============================================================
  // 👁️ PANEL DE ELEMENTOS OCULTOS
  // ============================================================
  const ocultosPanel = document.createElement("div");
  ocultosPanel.id = "ocultosPanel";
  ocultosPanel.style.cssText = `
    margin-top:15px;
    border-top:1px solid #ccc;
    padding-top:8px;
    font-size:13px;
    color:#555;
  `;
  ocultosPanel.innerHTML = `
    <details>
      <summary style="cursor:pointer;color:#990f0c;font-weight:600;">
        👁️ Elementos ocultos
      </summary>
      <ul id="listaOcultos" style="list-style:none;padding-left:15px;margin-top:5px;"></ul>
    </details>
  `;
  document.querySelector(".columna-resumen").appendChild(ocultosPanel);


  // ============================================================
  // ➕ AGREGAR / ACTUALIZAR PROCESO
  // ============================================================
  window.agregarOActualizarResumen = function (nuevo) {
    if (!window.resumen) window.resumen = [];

    // 🔎 Gastos adicionales NO se mergean
    if (nuevo.tipo !== "gastos") {
      const existente = window.resumen.find(
        r => r.area === nuevo.area && r.proceso === nuevo.proceso
      );

      if (existente) {
        existente.cantidad += nuevo.cantidad;
        existente.costo += nuevo.costo;
        existente.valor = nuevo.valor;
        existente.visible = true;
        existente.tiempo = nuevo.tiempo || existente.tiempo || "-";
      } else {
        nuevo.visible = true;
        nuevo.tiempo = nuevo.tiempo || "-";
        window.resumen.push(nuevo);
      }
    } else {
      nuevo.visible = true;
      nuevo.unidad = "N/A";
      nuevo.cantidad = 1;
      nuevo.tiempo = "-";
      window.resumen.push(nuevo);
    }

    renderTabla();
  };


  // ============================================================
  // 🧾 RENDER PRINCIPAL
  // ============================================================
  window.renderTabla = function () {
    tablaBody.innerHTML = "";
    const listaOcultos = document.getElementById("listaOcultos");
    listaOcultos.innerHTML = "";

    if (!window.resumen || !window.resumen.length) {
      totalGeneralEl.textContent = "$0";
      btnVaciar.disabled = true;
      return;
    }

    const columnasVisibles =
      JSON.parse(localStorage.getItem("columnas_visibles")) || {
        0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true
      };

    let subtotal = 0;
    let subtotalVisible = 0;

    // SUBTOTAL
    window.resumen.forEach(r => {
      const costo = r.costo ?? (r.cantidad * r.valor);
      subtotal += costo;
    });

    // SUBTOTAL VISIBLE
    window.resumen.forEach(r => {
      if (r.visible) {
        const costo = r.costo ?? (r.cantidad * r.valor);
        subtotalVisible += costo;
      }
    });

    const costoOcultos = subtotal - subtotalVisible;

    // PESOS INVERSOS PARA REPARTO
    let pesos = [];
    let sumaPesos = 0;
    window.resumen.forEach(r => {
      if (!r.visible) return;
      const costoBase = r.costo ?? (r.cantidad * r.valor);
      const peso = 1 / costoBase;
      pesos.push({ r, peso });
      sumaPesos += peso;
    });

    // 🆕 GASTOS ADICIONALES
    const gastosAdicionales = parseFloat(
      (document.getElementById("gastosInput")?.dataset.real || "0")
    );

    // DESCUENTO / IVA
    const descuentoP = (parseFloat(descuentoInput.value) || 0) / 100;
    const descuentoValor = subtotal * descuentoP;
    const subtotalConDescuento = subtotal - descuentoValor;
    const ivaValor = aplicarIVA ? subtotalConDescuento * 0.19 : 0;
    const totalFinal = subtotalConDescuento + ivaValor + gastosAdicionales;



   // ============================================================
  // 🔁 RENDER DE CADA FILA (SIEMPRE 7 COLUMNAS)
  // ============================================================
  window.resumen.forEach((r, i) => {
    const valor = r.valor || 0;
    const costoBase = r.costo ?? (r.cantidad * valor);

    if (!r.visible) {
      const li = document.createElement("li");
      li.innerHTML = `
        🔒 ${r.proceso} — ${r.cantidad} × $${valor.toLocaleString()}
        <button class="btn-mostrar-fila" data-id="${i}"
          style="background:none;border:none;color:#990f0c;cursor:pointer;">
          Mostrar
        </button>
      `;
      listaOcultos.appendChild(li);
      return;
    }

    // Reparto inverso
    let parteExtra = 0;
    const pesoObj = pesos.find(p => p.r === r);
    if (pesoObj && sumaPesos) {
      parteExtra = (pesoObj.peso / sumaPesos) * costoOcultos;
    }

    const costoFinal = Math.round(costoBase + parteExtra);

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="col-0">${r.proceso}</td>
      <td class="col-1" style="text-align:center;">${r.unidad || "Und"}</td>
      <td class="col-2" style="text-align:center;">${r.cantidad}</td>
      <td class="col-3" style="text-align:right;">$${valor.toLocaleString()}</td>
      <td class="col-4" style="text-align:right;color:#990f0c;font-weight:600;">
        $${costoFinal.toLocaleString()}
      </td>
      <td class="col-5" style="text-align:center;">${r.tiempo || "-"}</td>
      <td class="col-6" style="text-align:center;">
        <button class="btn-eliminar-fila" data-id="${i}">🗑️</button>
        <button class="btn-ocultar-fila" data-id="${i}">👁️</button>
      </td>
    `;

    tablaBody.appendChild(tr);
  });


    // TOTAL FINAL VISUAL
    totalGeneralEl.innerHTML = `
      <div style="text-align:right;">
        <div>Subtotal: <strong>$${subtotal.toLocaleString()}</strong></div>
        
        ${descuentoValor ? `
          <div>Descuento: <strong>-$${descuentoValor.toLocaleString()}</strong></div>` : ""}
        
        ${(!ocultarGastos && gastosAdicionales > 0) ? `
          <div>Gastos adicionales: <strong>$${gastosAdicionales.toLocaleString()}</strong></div>` : ""}

        
        ${aplicarIVA ? `
          <div>IVA (19%): <strong>$${ivaValor.toLocaleString()}</strong></div>` : ""}
        
        <div style="margin-top:4px;border-top:1px solid #ccc;padding-top:4px;color:#990f0c;font-weight:700;">
          Total Final: $${totalFinal.toLocaleString()}
        </div>
      </div>
    `;


    ocultosPanel.style.display = listaOcultos.children.length ? "block" : "none";
    btnVaciar.disabled = !window.resumen.length;

    // Aplicar visibilidad al volver a renderizar
    Object.entries(columnasVisibles).forEach(([col, visible]) => {
      ocultarColumna(parseInt(col), visible);
    });
  };

  // ============================================================
  // 🔘 EVENTOS
  // ============================================================
  document.addEventListener("click", e => {
    const el = e.target;

    if (el.closest(".btn-eliminar-fila")) {
      const id = el.dataset.id;
      if (confirm("¿Eliminar este elemento?")) {
        window.resumen.splice(id, 1);
        renderTabla();
      }
      return;
    }

    if (el.closest(".btn-ocultar-fila")) {
      const id = el.dataset.id;
      window.resumen[id].visible = false;
      renderTabla();
      return;
    }

    if (el.closest(".btn-mostrar-fila")) {
      const id = el.dataset.id;
      window.resumen[id].visible = true;
      renderTabla();
      return;
    }
  });

  descuentoInput.addEventListener("input", renderTabla);

  btnVaciar.addEventListener("click", () => {
    if (!window.resumen.length) return;
    if (!confirm("¿Vaciar toda la cotización?")) return;
    window.resumen = [];
    renderTabla();
  });

  // ============================================================
  // 💾 CARGAR / GUARDAR ESTADO DE COLUMNAS
  // ============================================================
  function guardarColumnasEstado() {
    const estado = {};
    document.querySelectorAll(".col-toggle").forEach(chk => {
      estado[chk.dataset.col] = chk.checked;
    });
    localStorage.setItem("columnas_visibles", JSON.stringify(estado));
  }

  function cargarColumnasEstado() {
    const estado = JSON.parse(localStorage.getItem("columnas_visibles"));
    if (!estado) return;

    // 🔒 Forzar visibilidad de Proceso (0) y Acción (6)
    estado[0] = true;
    estado[6] = true;

    document.querySelectorAll(".col-toggle").forEach(chk => {
      const col = chk.dataset.col;

      if (col == "0" || col == "6") {
        chk.checked = true;
        chk.disabled = true;
      }

      if (estado[col] !== undefined) {
        chk.checked = estado[col];
        ocultarColumna(parseInt(col), estado[col]);
      }
    });
  }

  document.querySelectorAll(".col-toggle").forEach(chk => {
    chk.addEventListener("change", () => {
      const col = parseInt(chk.dataset.col);
      const visible = chk.checked;
      guardarColumnasEstado();
      ocultarColumna(col, visible);
    });
  });

  cargarColumnasEstado();

  // ============================================================
  // 🔳 OCULTAR COLUMNA
  // ============================================================
  function ocultarColumna(index, mostrar) {
    const tabla = document.getElementById("tablaResumen");

    // Encabezado
    const th = tabla.querySelector(`thead th:nth-child(${index + 1})`);
    if (th) th.style.display = mostrar ? "" : "none";

    // Celdas
    tabla.querySelectorAll(`.col-${index}`).forEach(td => {
      td.style.display = mostrar ? "" : "none";
    });
  }

});
