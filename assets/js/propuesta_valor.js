// ============================================================
// 💼 PROPUESTA DE VALOR — GADIER SISTEMAS
// (Versión limpia, optimizada y sin errores de scope)
// ============================================================

window.nombreSubprocesoEstandar = {
  "areas": "Áreas",
  "alistamiento": "Alistamiento",
  "indexacion": "Indexación",
  "tiempo completo": "Tiempo completo",
  "parcial": "Parcial",
  "básicos": "Básicos",
  "medios": "Medios",
  "especializados": "Especializados",
};

// ============= UTILIDADES GLOBALES ==========================
document.addEventListener("DOMContentLoaded", () => {
  console.log("🧾 [PropuestaValor] Inicializado correctamente");

  window.normalizarTexto = (str) =>
    !str ? "" :
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  window.nombreSeguroArchivo = (nombre) =>
    (nombre || "Cliente")
      .replace(/[\\/:*?\"<>|]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 40);

  window.encontrarSubproceso = function (diccionario, nombreVisible) {
    if (!diccionario) return null;

    const visibleNorm = normalizarTexto(nombreVisible);

    let claveReal = Object.keys(diccionario).find(
      k => normalizarTexto(k) === visibleNorm
    );
    if (claveReal)
      return { nombre: claveReal, descripcion: diccionario[claveReal] };

    claveReal = Object.keys(diccionario).find(
      k =>
        normalizarTexto(k).includes(visibleNorm) ||
        visibleNorm.includes(normalizarTexto(k))
    );
    if (claveReal)
      return { nombre: claveReal, descripcion: diccionario[claveReal] };

    return { nombre: nombreVisible, descripcion: "— Sin descripción registrada —" };
  };
});

function columnasVisiblesResumen() {

  // Valores por defecto (igual que PDF)
  const columnasPorDefecto = {
    0: true,  // Descripción
    1: true,  // Unidad
    2: true,  // Cantidad
    3: true,  // Valor unitario
    4: true,  // Total
    5: true   // Tiempo
  };

  // Cargar columnas visibles guardadas por el usuario
  let columnasVisibles = JSON.parse(localStorage.getItem("columnas_visibles")) || {};

  // Mezclar defaults + guardadas
  columnasVisibles = { ...columnasPorDefecto, ...columnasVisibles };

  // Retornar en formato usado por PPT
  return {
    unidad: columnasVisibles[1] !== false,
    cantidad: columnasVisibles[2] !== false,
    valorUnitario: columnasVisibles[3] !== false,
    total: columnasVisibles[4] !== false,
    tiempo: columnasVisibles[5] !== false,
  };
}


// ============================================================
// 🟦 MODAL UNIVERSAL — DATOS DEL CLIENTE (PDF + PPT)
// (USAMOS modalDatosCliente DEL HTML)
// ============================================================

// Estado global donde guardamos lo que viene del modal
window.datosClienteGlobal = window.datosClienteGlobal || null;

// Solo definimos si no existe para evitar conflictos
if (!window.abrirModalDatosCliente) {
  window.abrirModalDatosCliente = function (modo) {
    const modal = document.getElementById("modalDatosCliente");
    if (!modal) {
      console.warn("⚠ No se encontró #modalDatosCliente en el DOM.");
      return;
    }

    const inputNombre = modal.querySelector("#modalNombreCliente");
    const inputCorreo = modal.querySelector("#modalCorreoCliente");
    const inputTelefono = modal.querySelector("#modalTelefonoCliente");
    const inputDestinatario = modal.querySelector("#modalDestinatario");
    const radioRUNT = modal.querySelector("#identRUNT");
    const radioCC = modal.querySelector("#identCC");
    const inputNumeroIdent = modal.querySelector("#modalNumeroIdent");

    const btnCancelar = modal.querySelector("#btnModalCancelar");
    const btnContinuar = modal.querySelector("#btnModalContinuar");

    // Restaurar datos previos si existen
    try {
      const guardado = sessionStorage.getItem("datosClienteGadier");
      if (guardado) {
        const d = JSON.parse(guardado);
        if (d.nombre) inputNombre.value = d.nombre;
        if (d.correo) inputCorreo.value = d.correo;
        if (d.telefono) inputTelefono.value = d.telefono;
        if (d.destinatario) inputDestinatario.value = d.destinatario;
        if (d.tipoIdent === "RUNT") {
          radioRUNT.checked = true;
        } else if (d.tipoIdent === "Documento de identidad") {
          radioCC.checked = true;
        }
        if (d.numeroIdent) {
          inputNumeroIdent.value = d.numeroIdent;
          inputNumeroIdent.style.display = "block";
        }
      }
    } catch (e) {
      console.warn("⚠ Error leyendo datosClienteGadier de sessionStorage:", e);
    }

    // Mostrar/ocultar input de número según radio
    function actualizarVisibilidadNumero() {
      if (radioRUNT.checked || radioCC.checked) {
        inputNumeroIdent.style.display = "block";
      } else {
        inputNumeroIdent.style.display = "none";
        inputNumeroIdent.value = "";
      }
    }

    radioRUNT?.addEventListener("change", actualizarVisibilidadNumero);
    radioCC?.addEventListener("change", actualizarVisibilidadNumero);

    actualizarVisibilidadNumero();

    // Mostrar modal
    modal.style.display = "flex";
    document.body.classList.add("modal-activo");

    // Limpiar handlers previos para evitar múltiples binds
    btnCancelar.onclick = null;
    btnContinuar.onclick = null;

    btnCancelar.onclick = () => {
      modal.style.display = "none";
      document.body.classList.remove("modal-activo");
    };

    btnContinuar.onclick = () => {
      const nombre = (inputNombre.value || "").trim() || "Cliente";
      const correo = (inputCorreo.value || "").trim() || "sin_correo@gadiersistemas.com";
      const telefono = (inputTelefono.value || "").trim() || "Sin especificar";
      const destinatario = (inputDestinatario.value || "").trim();

      let tipoIdent = "";
      if (radioRUNT.checked) tipoIdent = "RUNT";
      else if (radioCC.checked) tipoIdent = "Documento de identidad";

      const numeroIdent = (inputNumeroIdent.value || "").trim();

      // Guardar global + sessionStorage
      const datos = {
        nombre,
        correo,
        telefono,
        destinatario,
        tipoIdent,
        numeroIdent
      };
      window.datosClienteGlobal = datos;
      try {
        sessionStorage.setItem("datosClienteGadier", JSON.stringify(datos));
      } catch (e) {
        console.warn("⚠ No se pudo guardar datosClienteGadier en sessionStorage:", e);
      }

      modal.style.display = "none";
      document.body.classList.remove("modal-activo");

      // Disparar acción según modo
      if (modo === "PPT" && typeof window.generarPPTConDatos === "function") {
        window.generarPPTConDatos();
      } else if (modo === "PDF" && typeof window.generarPDFConDatos === "function") {
        window.generarPDFConDatos();
      }
    };
  };
}

// ============================================================
// 🔥 CLICK EN BOTÓN PPT → ABRE MODAL UNIVERSAL
// ============================================================
document.addEventListener("click", (e) => {
  const btn = e.target.closest("#btnPropuestaValor");
  if (!btn) return;

  if (!window.resumen || window.resumen.length === 0) {
    alert("⚠ No hay elementos seleccionados.");
    return;
  }

  const visiblesCheck = window.resumen.filter(r => r.visible !== false);
  if (!visiblesCheck.length) {
    alert("⚠ Todos los elementos están ocultos.");
    return;
  }

  // Abrimos modal universal en modo PPT
  window.abrirModalDatosCliente("PPT");
});

// ============================================================
// 🟥 FUNCIÓN — GENERAR PPT USANDO LOS DATOS DEL MODAL UNIVERSAL
// ============================================================
window.generarPPTConDatos = async function () {
  if (!window.resumen || window.resumen.length === 0) {
    alert("⚠ No hay elementos seleccionados.");
    return;
  }

  const visibles = window.resumen.filter(r => r.visible !== false);
  if (visibles.length === 0) {
    alert("⚠ Todos los elementos están ocultos.");
    return;
  }

  const col = columnasVisiblesResumen();

  const datos = window.datosClienteGlobal || {};
  const nombreCliente = datos.nombre || "Cliente";
  const correo = datos.correo || "";
  const telefono = datos.telefono || "";
  const destinatario = datos.destinatario || "";
  const tipoIdent = datos.tipoIdent || "";
  const numeroIdent = datos.numeroIdent || "";

  const fechaGeneracion = new Date().toLocaleDateString("es-CO");

  // ============================================================
  // 🧮 REDISTRIBUCIÓN INVERSA
  // ============================================================
  const gastosAdicionales = parseFloat(
    document.getElementById("gastosInput")?.dataset.real || "0"
  );

  const chkG = document.getElementById("ocultarGastos");
  const ocultarGastos = chkG ? chkG.checked : false;

  let subtotalTotal = 0;
  window.resumen.forEach(r => {
    const valorUnit = r.valor || 0;
    const costo = r.costo ?? (r.cantidad * valorUnit);
    subtotalTotal += costo;
  });

  let subtotalVisible = 0;
  visibles.forEach(r => {
    const valorUnit = r.valor || 0;
    const costo = r.costo ?? (r.cantidad * valorUnit);
    subtotalVisible += costo;
  });

  subtotalVisible = Math.round(subtotalVisible);
  const costoOcultos = subtotalTotal - subtotalVisible;

  let pesos = [];
  let sumaPesos = 0;

  visibles.forEach(r => {
    const valorUnit = r.valor || 0;
    const costoBase = r.costo ?? (r.cantidad * valorUnit);

    const peso = 1 / costoBase; // inverso: barato = mayor peso
    pesos.push({ r, peso, costoBase });
    sumaPesos += peso;
  });

  const obtenerCostoFinal = (r) => {
    const valorUnit = r.valor || 0;
    const costoBase = r.costo ?? (r.cantidad * valorUnit);

    const pesoObj = pesos.find(p => p.r === r);
    if (!pesoObj || sumaPesos === 0) return costoBase;

    const extra = (pesoObj.peso / sumaPesos) * costoOcultos;
    return Math.round(costoBase + extra);
  };

  // ============================================================
  // 📌 PROCESOS + SUBPROCESOS
  // ============================================================
  const obtenerProcesoBase = (r) => (r.proceso || "").split(" - ")[0].trim();

  const procesosUnicos = [
    ...new Set(visibles.filter(r => r.proceso).map(obtenerProcesoBase))
  ];

  const propuesta = procesosUnicos
    .map(nombre => {
      const plantilla = plantillasProcesos[nombre];
      if (!plantilla) return null;

      const subprocesosVisibles = [
        ...new Set(
          visibles
            .filter(r => obtenerProcesoBase(r) === nombre)
            .flatMap(r => {
              if (r.isGlobal) return [];
              if (Array.isArray(r.subprocesos) && r.subprocesos.length)
                return r.subprocesos;

              const partes = (r.proceso || "").split(" - ");
              return partes[1] ? [partes[1]] : [];
            })
            .filter(Boolean)
        )
      ];

      const detallesSubprocesos = subprocesosVisibles.map(sp =>
        window.encontrarSubproceso(plantilla.subprocesos || {}, sp)
      );

      return {
        nombre,
        descripcion: plantilla.descripcion?.trim() || "",
        subprocesos: detallesSubprocesos,
        beneficios: plantilla.beneficios || [],
        esGlobal: visibles.some(r => obtenerProcesoBase(r) === nombre && r.isGlobal)
      };
    })
    .filter(Boolean);

  if (!propuesta.length) {
    alert("⚠ Ningún proceso tiene plantilla disponible.");
    return;
  }

  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";

  // ============================================================
  // 🟥 PORTADA
  // ============================================================
  const slidePortada = pptx.addSlide();
  try { slidePortada.background = { path: "assets/img/portada-propuesta.png" }; } catch { }

  try {
    slidePortada.addImage({
      path: "assets/img/logo-blanco-sin-fondo.png",
      x: 6.4, y: 3.1, w: 3.8, h: 2.1
    });
  } catch { }

  const textoDirigido = destinatario || nombreCliente;

  slidePortada.addText(`Dirigido a: ${textoDirigido}`, {
    x: 1.0, y: 4.2, w: 8.5, fontSize: 20, color: "222222"
  });

  slidePortada.addText(`Fecha: ${fechaGeneracion}`, {
    x: 1.0, y: 4.6, w: 8.5, fontSize: 18, color: "333333"
  });

  // Línea con identificación (RUNT / Documento) + contacto
  let lineasContacto = [];
  if (tipoIdent && numeroIdent) {
    lineasContacto.push(`${tipoIdent}: ${numeroIdent}`);
  }
  if (telefono) {
    lineasContacto.push(`Tel: ${telefono}`);
  }
  if (correo) {
    lineasContacto.push(`Correo: ${correo}`);
  }

  if (lineasContacto.length) {
    slidePortada.addText(lineasContacto.join("   •   "), {
      x: 1.0, y: 5.0, w: 8.5, fontSize: 12, color: "555555"
    });
  }

  slidePortada.addText("Gadier Sistemas • marketing@gadiersistemas.com • gadiersistemas.com", {
    x: 0.8, y: 6.1, w: 8.4, fontSize: 10, color: "666666", align: "center"
  });

  // ============================================================
  // 💼 SLIDE RESUMEN – IGUAL QUE PDF (con columnas dinámicas)
  // ============================================================
  const slideResumen = pptx.addSlide();
  try { slideResumen.background = { path: "assets/img/textos-propuesto.png" }; } catch { }

  slideResumen.addText("📄 Resumen de la Propuesta de Valor", {
    x: 0.5, y: 0.6, w: 9, h: 0.6,
    fontSize: 30, bold: true, color: "990f0c", align: "center",
  });

  // ---- 1. Crear encabezado según visibilidad ----
  let encabezado = [
    { text: "Descripción", options: { bold: true, fill: { color: "990f0c" }, color: "FFFFFF" } }
  ];

  if (col.unidad)
    encabezado.push({ text: "Unidad", options: { bold: true, fill: { color: "990f0c" }, color: "FFFFFF", align: "center" } });
  if (col.cantidad)
    encabezado.push({ text: "Cant.", options: { bold: true, fill: { color: "990f0c" }, color: "FFFFFF", align: "center" } });
  if (col.valorUnitario)
    encabezado.push({ text: "Valor unitario", options: { bold: true, fill: { color: "990f0c" }, color: "FFFFFF", align: "right" } });
  if (col.tiempo)
    encabezado.push({ text: "Tiempo", options: { bold: true, fill: { color: "990f0c" }, color: "FFFFFF", align: "center" } });
  if (col.total)
    encabezado.push({ text: "Total", options: { bold: true, fill: { color: "990f0c" }, color: "FFFFFF", align: "right" } });

  let filas = [encabezado];

  // ---- 2. Filas de ítems ----
  visibles.forEach(r => {
    const costoFinal = Math.round(obtenerCostoFinal(r));

    let fila = [
      { text: r.proceso }
    ];

    if (col.unidad) {
      const txtUnidad = (r.unidad && r.unidad.trim() !== "") ? r.unidad : "";
      fila.push({ text: txtUnidad, options: { align: "center" } });
    }

    if (col.cantidad)
      fila.push({ text: (r.cantidad || 1) + "", options: { align: "center" } });

    if (col.valorUnitario)
      fila.push({ text: `$${(r.valor || 0).toLocaleString("es-CO")}`, options: { align: "right" } });

    if (col.tiempo)
      fila.push({ text: r.tiempo || "-", options: { align: "center" } });

    if (col.total)
      fila.push({ text: `$${costoFinal.toLocaleString("es-CO")}`, options: { align: "right", bold: true } });

    filas.push(fila);
  });

  // ---- 3. Totales dinámicos ----
  const subtotalFinal = visibles.reduce((acc, r) => acc + Math.round(obtenerCostoFinal(r)), 0);
  const dPct = parseFloat(document.getElementById("descuentoInput")?.value || 0);
  const dVal = subtotalFinal * (dPct / 100);
  const subtotalDesc = subtotalFinal - dVal;
  const aplicarIVA = document.getElementById("chkIVA")?.checked || false;
  const iva = aplicarIVA ? subtotalDesc * 0.19 : 0;

  const totalFinal = subtotalDesc + iva + gastosAdicionales;

  const numCols = encabezado.length;
  const span = numCols - 1;

  filas.push([
    { text: "SUBTOTAL", options: { bold: true, align: "right", colspan: span } },
    { text: `$${subtotalFinal.toLocaleString("es-CO")}`, options: { bold: true, align: "right" } }
  ]);

  if (dPct > 0) {
    filas.push([
      { text: `DESCUENTO (${dPct}%)`, options: { bold: true, align: "right", color: "7d0c0a", colspan: span } },
      { text: `-$${dVal.toLocaleString("es-CO")}`, options: { bold: true, align: "right", color: "7d0c0a" } }
    ]);
  }

  if (aplicarIVA) {
    filas.push([
      { text: "IVA (19%)", options: { bold: true, align: "right", colspan: span } },
      { text: `$${iva.toLocaleString("es-CO")}`, options: { bold: true, align: "right" } }
    ]);
  }

  if (!ocultarGastos && gastosAdicionales > 0) {
    filas.push([
      { text: "Gastos adicionales", options: { bold: true, align: "right", colspan: span } },
      { text: `$${gastosAdicionales.toLocaleString("es-CO")}`, options: { bold: true, align: "right" } }
    ]);
  }

  filas.push([
    { text: "TOTAL FINAL", options: { bold: true, align: "right", fill: { color: "990f0c" }, color: "FFFFFF", colspan: span } },
    { text: `$${totalFinal.toLocaleString("es-CO")}`, options: { bold: true, align: "right", fill: { color: "990f0c" }, color: "FFFFFF" } }
  ]);

  // ---- DEFINIR COLUMNAS SEGÚN VISIBILIDAD ----
  let columnas = ["descripcion"];
  if (col.unidad) columnas.push("unidad");
  if (col.cantidad) columnas.push("cantidad");
  if (col.valorUnitario) columnas.push("valorUnitario");
  if (col.tiempo) columnas.push("tiempo");
  if (col.total) columnas.push("total");


  // ---- 4. Column widths dinámicos ----
  let colW = [];

  columnas.forEach(c => {
    if (c === "descripcion") colW.push(4.2);   // Igual que PDF, ancho estable
    else if (c === "unidad") colW.push(1.0);
    else if (c === "cantidad") colW.push(0.8);
    else if (c === "valorUnitario") colW.push(1.4);
    else if (c === "tiempo") colW.push(1.0);
    else if (c === "total") colW.push(1.4);
  });

  slideResumen.addTable(filas, {
    x: 0.5,
    y: 1.5,
    colW,
    fontSize: 13,
    w: "auto",
    autoPageRow: true,

    // 🔥 QUITAMOS TODAS LAS LÍNEAS INTERNAS
    border: {
      type: "none"
    },

    // 🔥 AGREGAMOS SOLO BORDES EXTERNOS
    outerBorder: {
      type: "solid",
      color: "AAAAAA",
      width: 0.8
    }
  });

  // ============================================================
  // 🖋 SLIDE FINAL
  // ============================================================
  const slideFin = pptx.addSlide();
  try { slideFin.background = { path: "assets/img/cierre-presupuesto.png" }; } catch { }

  slideFin.addText("Gracias por confiar en Gadier Sistemas", {
    x: 0.8, y: 1.6, w: 8.4,
    fontSize: 30, bold: true, color: "990f0c", align: "center"
  });

  slideFin.addText("Sistemas Profesionales de Información Ltda.", {
    x: 0.8, y: 2.2, w: 8.4,
    fontSize: 18, italic: true, color: "333333", align: "center"
  });

  slideFin.addText("📞  +57 320 555 8296\n✉️  marketing@gadiersistemas.com\n🌐  gadiersistemas.com", {
    x: 0.8, y: 4.7, w: 8.4,
    fontSize: 15, color: "990f0c", align: "center"
  });

  // ============================================================
  // 💾 GUARDAR ARCHIVO
  // ============================================================
  const fileName = `Propuesta_Gadier_${window.nombreSeguroArchivo(nombreCliente)}_${new Date().toISOString().split("T")[0]}.pptx`;
  await pptx.writeFile({ fileName });
};
