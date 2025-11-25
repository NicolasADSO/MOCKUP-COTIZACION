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
  // ✅ AGREGAR CHECKBOX IVA (solo la primera vez)
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
    if (descuentoBox) {
      descuentoBox.insertAdjacentElement("afterend", ivaBox);
    }

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
  // 🧩 FUNCIÓN GLOBAL: MERGE AUTOMÁTICO
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
  // 🧾 RENDER PRINCIPAL (con repartición inversa de costos ocultos)
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

    let subtotal = 0;
    let subtotalVisible = 0;

    // ===== CALCULAR SUBTOTAL TOTAL =====
    window.resumen.forEach(r => {
      const valorUnitario = r.valor || 0;
      const costo = r.costo ?? (r.cantidad * valorUnitario);
      subtotal += costo;
    });

    // ===== CALCULAR SUBTOTAL SOLO VISIBLES =====
    window.resumen.forEach(r => {
      if (r.visible) {
        const valorUnitario = r.valor || 0;
        const costo = r.costo ?? (r.cantidad * valorUnitario);
        subtotalVisible += costo;
      }
    });

    // ===== CUÁNTO DINERO OCULTO HAY =====
    const costoOcultos = subtotal - subtotalVisible;

    // =====================================================
    //  🧠 REPARTO INVERSO — más peso a procesos baratos
    // =====================================================
    let pesos = [];
    let sumaPesos = 0;

    window.resumen.forEach(r => {
      if (r.visible) {
        const valorUnitario = r.valor || 0;
        const costoBase = r.costo ?? (r.cantidad * valorUnitario);

        const peso = 1 / costoBase; // 🔥 inverso: barato = peso alto
        pesos.push({ r, peso, costoBase });
        sumaPesos += peso;
      }
    });

    // ===== DESCUENTO, IVA Y TOTAL =====
    const descuentoPorcentaje = (parseFloat(descuentoInput.value) || 0) / 100;
    const descuentoValor = subtotal * descuentoPorcentaje;
    const subtotalConDescuento = subtotal - descuentoValor;
    const ivaValor = aplicarIVA ? subtotalConDescuento * 0.19 : 0;
    const totalFinal = subtotalConDescuento + ivaValor;

    // ===== TABLA DE RENDER =====
    window.resumen.forEach((r, i) => {
      const valorUnitario = r.valor || 0;
      const costoBase = r.costo ?? (r.cantidad * valorUnitario);

      if (r.visible) {

        // =====================================================
        //    🔥 CÁLCULO DE LA PARTE QUE LE TOCA DEL OCULTO
        // =====================================================
        let parteExtra = 0;
        const pesoObj = pesos.find(p => p.r === r);

        if (pesoObj && sumaPesos > 0) {
          parteExtra = (pesoObj.peso / sumaPesos) * costoOcultos;
        }

        const costoFinal = costoBase + parteExtra;

        const tr = document.createElement("tr");

        let cantidadHTML = r.cantidad;

        tr.innerHTML = `
          <td>${r.proceso}</td>
          <td style="text-align:center;">${cantidadHTML}</td>
          <td style="text-align:right;">$${valorUnitario.toLocaleString()}</td>
          <td style="text-align:right;color:#990f0c;font-weight:600;">
            $${Math.round(costoFinal).toLocaleString()}
          </td>
          <td style="text-align:center;">
            <button class="btn-eliminar-fila" data-id="${i}">🗑️</button>
            <button class="btn-ocultar-fila" data-id="${i}">👁️</button>
          </td>
        `;

        tablaBody.appendChild(tr);

      } else {
        // Ocultos → lista lateral
        const li = document.createElement("li");
        li.innerHTML = `
          🔒 ${r.proceso} — ${r.cantidad} × $${valorUnitario.toLocaleString()}
          <button class="btn-mostrar-fila" data-id="${i}"
            style="background:none;border:none;color:#990f0c;cursor:pointer;">
            Mostrar
          </button>
        `;
        listaOcultos.appendChild(li);
      }
    });

    // ===== TOTAL FINAL =====
    totalGeneralEl.innerHTML = `
      <div style="text-align:right;">
        <div>Subtotal: <strong>$${subtotal.toLocaleString()}</strong></div>
        ${descuentoValor > 0 ? `<div>Descuento: <strong>-$${descuentoValor.toLocaleString()}</strong></div>` : ""}
        ${aplicarIVA ? `<div>IVA (19%): <strong>$${ivaValor.toLocaleString()}</strong></div>` : ""}
        <div style="margin-top:4px;border-top:1px solid #ccc;padding-top:4px;color:#990f0c;font-weight:700;">
          Total Final: $${totalFinal.toLocaleString()}
        </div>
      </div>
    `;

    ocultosPanel.style.display = listaOcultos.children.length > 0 ? "block" : "none";
    btnVaciar.disabled = window.resumen.length === 0;
  };



  // ============================================================
  // 🧩 EVENTOS: eliminar / ocultar / mostrar / vaciar
  // ============================================================
  document.addEventListener("click", e => {

    const btnEliminar = e.target.closest(".btn-eliminar-fila");
    const btnOcultar = e.target.closest(".btn-ocultar-fila");
    const btnMostrar = e.target.closest(".btn-mostrar-fila");

    if (btnEliminar) {
      const id = parseInt(btnEliminar.dataset.id);
      if (confirm("¿Eliminar este elemento de la cotización?")) {
        window.resumen.splice(id, 1);
        renderTabla();
      }
      return;
    }

    if (btnOcultar) {
      const id = parseInt(btnOcultar.dataset.id);
      window.resumen[id].visible = false;
      renderTabla();
      return;
    }

    if (btnMostrar) {
      const id = parseInt(btnMostrar.dataset.id);
      window.resumen[id].visible = true;
      renderTabla();
      return;
    }
  });

  // Descuento dinámico
  descuentoInput.addEventListener("input", renderTabla);

  // Vaciar tabla
  btnVaciar.addEventListener("click", () => {
    if (!window.resumen.length) return alert("⚠️ No hay elementos.");
    if (!confirm("¿Vaciar toda la cotización?")) return;

    window.resumen = [];
    renderTabla();
  });

});
