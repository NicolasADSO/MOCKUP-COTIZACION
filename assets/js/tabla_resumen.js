// ============================================================
// 🧮 TABLA DE RESUMEN — GADIER SISTEMAS
// (Render, eliminación, ocultar/mostrar, vaciado, descuento e IVA)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  const tablaBody = document.querySelector("#tablaResumen tbody");
  const totalGeneralEl = document.getElementById("totalGeneral");
  const descuentoInput = document.getElementById("descuentoInput");
  const btnVaciar = document.getElementById("btnVaciar");

  let aplicarIVA = false;

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

    const descuentoBox = descuentoInput.closest(".descuento-box");
    if (descuentoBox) descuentoBox.insertAdjacentElement("afterend", ivaBox);

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
  // 🧩 MERGE AUTOMÁTICO DE SUBPROCESOS
  // ============================================================
  window.agregarOActualizarResumen = function (nuevo) {
    if (!window.resumen) window.resumen = [];

    const existente = window.resumen.find(
      r => r.area === nuevo.area && r.proceso === nuevo.proceso
    );

    if (existente) {
      existente.cantidad += nuevo.cantidad;
      existente.costo += nuevo.costo;
      existente.valor = nuevo.valor;
      existente.visible = true;
    } else {
      nuevo.visible = true;
      window.resumen.push(nuevo);
    }

    renderTabla();
  };

  // ============================================================
  // 🧾 RENDER PRINCIPAL DE LA TABLA
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
        0: true, 1: true, 2: true, 3: true, 4: true, 5: true
      };

    let subtotal = 0;
    let subtotalVisible = 0;

    // TOTAL
    window.resumen.forEach(r => {
      const costo = r.costo ?? (r.cantidad * r.valor);
      subtotal += costo;
    });

    // TOTAL VISIBLE
    window.resumen.forEach(r => {
      if (r.visible) {
        const costo = r.costo ?? (r.cantidad * r.valor);
        subtotalVisible += costo;
      }
    });

    const costoOcultos = subtotal - subtotalVisible;

    // PESOS INVERSOS
    let pesos = [];
    let sumaPesos = 0;
    window.resumen.forEach(r => {
      if (!r.visible) return;
      const costoBase = r.costo ?? (r.cantidad * r.valor);
      const peso = 1 / costoBase;
      pesos.push({ r, peso });
      sumaPesos += peso;
    });

    // DESCUENTO / IVA
    const descuentoP = (parseFloat(descuentoInput.value) || 0) / 100;
    const descuentoValor = subtotal * descuentoP;
    const subtotalConDescuento = subtotal - descuentoValor;
    const ivaValor = aplicarIVA ? subtotalConDescuento * 0.19 : 0;
    const totalFinal = subtotalConDescuento + ivaValor;

    // RENDER DE FILAS
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

      // REPARTO INVERSO
      let parteExtra = 0;
      const pesoObj = pesos.find(p => p.r === r);
      if (pesoObj && sumaPesos) {
        parteExtra = (pesoObj.peso / sumaPesos) * costoOcultos;
      }

      const costoFinal = Math.round(costoBase + parteExtra);

      const tr = document.createElement("tr");
      let html = "";

      // COLUMNA 0: PROCESO
      if (columnasVisibles[0] !== false)
        html += `<td>${r.proceso}</td>`;

      // COLUMNA 1: UNIDAD
      if (columnasVisibles[1] !== false)
        html += `<td style="text-align:center;">${r.unidad || "Und"}</td>`;

      // COLUMNA 2: CANTIDAD
      if (columnasVisibles[2] !== false)
        html += `<td style="text-align:center;">${r.cantidad}</td>`;

      // COLUMNA 3: VALOR
      if (columnasVisibles[3] !== false)
        html += `<td style="text-align:right;">$${valor.toLocaleString()}</td>`;

      // COLUMNA 4: COSTO
      if (columnasVisibles[4] !== false)
        html += `<td style="text-align:right;color:#990f0c;font-weight:600;">
                  $${costoFinal.toLocaleString()}
                </td>`;

      // COLUMNA 5: ACCIONES
      if (columnasVisibles[5] !== false)
        html += `
          <td style="text-align:center;">
            <button class="btn-eliminar-fila" data-id="${i}">🗑️</button>
            <button class="btn-ocultar-fila" data-id="${i}">👁️</button>
          </td>
        `;

      tr.innerHTML = html;
      tablaBody.appendChild(tr);
    });

    // TOTAL
    totalGeneralEl.innerHTML = `
      <div style="text-align:right;">
        <div>Subtotal: <strong>$${subtotal.toLocaleString()}</strong></div>
        ${descuentoValor ? `<div>Descuento: <strong>-$${descuentoValor.toLocaleString()}</strong></div>` : ""}
        ${aplicarIVA ? `<div>IVA (19%): <strong>$${ivaValor.toLocaleString()}</strong></div>` : ""}
        <div style="margin-top:4px;border-top:1px solid #ccc;padding-top:4px;color:#990f0c;font-weight:700;">
          Total Final: $${totalFinal.toLocaleString()}
        </div>
      </div>
    `;

    ocultosPanel.style.display = listaOcultos.children.length ? "block" : "none";
    btnVaciar.disabled = !window.resumen.length;

    // Aplicar visibilidad guardada nuevamente
    Object.entries(columnasVisibles).forEach(([col, visible]) => {
      ocultarColumna(parseInt(col), visible);
    });
  };

  // ============================================================
  // 🌙 EVENTOS DE BOTONES (eliminar, ocultar, mostrar)
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
  // 💾 GUARDAR / CARGAR ESTADO DE COLUMNAS
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

      // 🔒 Fuerza visibilidad de PROCESO (0) y ACCIÓN (5)
      estado[0] = true;
      estado[5] = true;

      document.querySelectorAll(".col-toggle").forEach(chk => {
          const col = chk.dataset.col;

          // Deshabilitar los checkboxes 0 y 5 en el modal
          if (col == "0" || col == "5") {
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
  // 🔳 FUNCIÓN OCULTAR/MOSTRAR COLUMNA
  // ============================================================
  function ocultarColumna(index, mostrar) {
  const tabla = document.getElementById("tablaResumen");

  // Oculta el TH correcto
  const th = tabla.querySelector(`thead th:nth-child(${index + 1})`);
  if (th) th.style.display = mostrar ? "" : "none";

  // Oculta todas las celdas de esa columna
  tabla.querySelectorAll("tbody tr").forEach(tr => {
    const td = tr.querySelector(`td:nth-child(${index + 1})`);
    if (td) td.style.display = mostrar ? "" : "none";
  });
}

 



});
