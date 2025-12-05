// ============================================================
// 📄 PDF CORPORATIVO - GADIER SISTEMAS (Versión B FINAL)
// Compatible con modal universal + gastos adicionales + columnas dinámicas
// ============================================================

document.addEventListener("click", async (e) => {
  const btn = e.target.closest("#btnPDF");
  if (!btn) return;

  // Abrir modal universal
  abrirModalDatosCliente("PDF");
});

// ============================================================
// 🟥 FUNCIÓN PRINCIPAL QUE GENERA EL PDF
// ============================================================

window.generarPDFConDatos = async function () {

  if (!window.resumen || window.resumen.length === 0) {
    alert("⚠️ No hay elementos en la cotización para generar el PDF.");
    return;
  }

  // Validación de datos del cliente desde modal universal
  const {
    nombre: cliente,
    correo,
    telefono,
    destinatario,
    tipoIdent,
    numeroIdent
  } = window.datosClienteGlobal || {};

  if (!cliente) {
    alert("⚠ Faltan los datos del cliente.");
    return;
  }

  const visibles = window.resumen.filter(r => r.visible !== false);
  if (visibles.length === 0) {
    alert("⚠ Todos los elementos están ocultos. No hay nada para exportar.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const ROJO = "#990f0c";
  const ROJO_OSCURO = "#7d0c0a";

  // ============================================================
  // 🖼 Fondo Canva Gadier
  // ============================================================
  try {
    const rutaCarpeta = window.location.href.substring(
      0,
      window.location.href.lastIndexOf("/") + 1
    );

    const plantilla = await toBase64(rutaCarpeta + "assets/img/formato-pdf.png");
    doc.addImage(plantilla, "PNG", 0, 0, pageWidth, pageHeight);
  } catch (err) {
    console.warn("⚠️ No se pudo cargar la plantilla para el PDF:", err);
  }

  // ============================================================
  // 📌 TÍTULO PRINCIPAL
  // ============================================================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(ROJO);
  doc.text("COTIZACIÓN", pageWidth / 2 + 40, 85, { align: "center" });

  // ============================================================
  // 📌 DATOS DEL CLIENTE
  // ============================================================
  doc.setFont("helvetica", "bold");
  doc.setTextColor(ROJO);
  doc.text("Datos del cliente", 320, 130);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor("#000");

  doc.text(`Cliente: ${cliente}`, 320, 150);
  doc.text(`Teléfono: ${telefono || "—"}`, 320, 165);
  doc.text(`Correo: ${correo || "—"}`, 320, 180);
  doc.text(`Fecha: ${new Date().toLocaleDateString("es-CO")}`, 320, 195);

  if (destinatario) doc.text(`Dirigido a: ${destinatario}`, 320, 210);

  if (tipoIdent && numeroIdent) {
    doc.text(`${tipoIdent}: ${numeroIdent}`, 320, 225);
  }

  // ============================================================
  // 📝 Texto Introductorio
  // ============================================================
  const intro = `
Nos complace presentarle esta propuesta elaborada con dedicación para ofrecerle una solución que aporte valor real a su organización.

En Gadier Sistemas creemos que la tecnología es más que herramientas: es un puente hacia la eficiencia y la excelencia.
  `;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#333");
  doc.text(intro, 80, 240, { maxWidth: pageWidth - 160, lineHeightFactor: 1.5 });

  // ============================================================
  // 🔥 REDISTRIBUCIÓN INVERSA (incluye gastos adicionales)
  // ============================================================

  const config = window.configuracionGlobal || {};

  const gastosAdicionales = config.gastosAdicionales !== undefined
    ? parseFloat(config.gastosAdicionales)
    : parseFloat(document.getElementById("gastosInput")?.dataset.real || "0");

  const ocultarGastos = config.ocultarGastos !== undefined
    ? config.ocultarGastos
    : (document.getElementById("ocultarGastos")?.checked || false);

  // 1️⃣ Subtotal total incluyendo ocultos + gastos
  let subtotalTotal = 0;
  window.resumen.forEach(r => {
    const base = r.costo ?? (r.cantidad * (r.valor || 0));
    subtotalTotal += base;
  });

  subtotalTotal += gastosAdicionales;

  // 2️⃣ Subtotal visible
  let subtotalVisible = 0;
  visibles.forEach(r => {
    const base = r.costo ?? (r.cantidad * (r.valor || 0));
    subtotalVisible += base;
  });

  const costoOcultos = subtotalTotal - subtotalVisible;

  // 3️⃣ Pesos inversos
  let pesos = [];
  let sumaPesos = 0;

  visibles.forEach(r => {
    const base = r.costo ?? (r.cantidad * (r.valor || 0));
    const peso = 1 / base;

    pesos.push({ r, peso, base });
    sumaPesos += peso;
  });

  const obtenerCostoFinal = (r) => {
    const base = r.costo ?? (r.cantidad * (r.valor || 0));
    const w = pesos.find(p => p.r === r);
    if (!w || sumaPesos === 0) return base;
    return Math.round(base + (w.peso / sumaPesos) * costoOcultos);
  };

  // ============================================================
  // 🎯 CALCULAR VALORES QUE FALTABAN (AQUÍ ESTABA EL ERROR)
  // ============================================================

  const descuento = config.descuento !== undefined
    ? parseFloat(config.descuento)
    : parseFloat(document.getElementById("descuentoInput")?.value || 0);

  const aplicarIVA = config.incluirIVA !== undefined
    ? config.incluirIVA
    : (document.getElementById("chkIVA")?.checked || false);

  const subtotal = visibles.reduce((acc, r) => acc + obtenerCostoFinal(r), 0);

  const valorDescuento = subtotal * (descuento / 100);
  const subtotalConDescuento = subtotal - valorDescuento;

  const valorIVA = aplicarIVA ? subtotalConDescuento * 0.19 : 0;

  const totalFinal = subtotalConDescuento + valorIVA;

  // ============================================================
  // 📊 TABLA DINÁMICA (AUTO TABLE)
  // ============================================================

  // 🔧 Asegurar que SIEMPRE existan las 6 columnas por defecto,
  // incluso si localStorage tiene datos incompletos
  const columnasPorDefecto = {
    0: true,  // Descripción
    1: true,  // Unidad
    2: true,  // Cant.
    3: true,  // Valor unitario
    4: true,  // Total
    5: true   // Tiempo (¡clave!)
  };

  // Cargar columnas almacenadas, si existen
  let columnasVisibles = JSON.parse(localStorage.getItem("columnas_visibles")) || {};

  // Mezclar defaults + columnas guardadas
  columnasVisibles = { ...columnasPorDefecto, ...columnasVisibles };


  const encabezados = {
    0: "Descripción",
    1: "Unidad",
    2: "Cant.",
    3: "Valor unitario",
    4: "Total",
    5: "Tiempo"
  };

  // Construir encabezado dinámico
  const head = [
    Object.keys(encabezados)
      .filter(c => columnasVisibles[c] !== false)
      .map(c => encabezados[c])
  ];

  // Construir filas dinámicas
  const body = visibles.map(r => {
    const costoFinal = obtenerCostoFinal(r);
    const fila = [];

    if (columnasVisibles[0]) fila.push(r.proceso || "");
    if (columnasVisibles[1]) fila.push(r.unidad || "");
    if (columnasVisibles[2]) fila.push(r.cantidad || 1);
    if (columnasVisibles[3]) fila.push(`$${(r.valor || 0).toLocaleString("es-CO")}`);
    if (columnasVisibles[4]) fila.push(`$${costoFinal.toLocaleString("es-CO")}`);
    if (columnasVisibles[5]) fila.push(r.tiempo || "-");

    return fila;
  });

  // Ajuste de anchos de columna (versión estable)
  const columnStyles = {};
  let idx = 0;

  Object.keys(encabezados)
    .filter(c => columnasVisibles[c] !== false)
    .forEach(c => {
      c = parseInt(c);

      if (c === 0) columnStyles[idx] = { halign: "left", cellWidth: 175 }; // Descripción
      else if (c === 1) columnStyles[idx] = { halign: "center", cellWidth: 65 }; // Unidad
      else if (c === 2) columnStyles[idx] = { halign: "center", cellWidth: 35 }; // Cantidad
      else if (c === 3) columnStyles[idx] = { halign: "right", cellWidth: 75 }; // Valor unitario
      else if (c === 4) columnStyles[idx] = { halign: "right", cellWidth: 75 }; // Total
      else if (c === 5) columnStyles[idx] = { halign: "center", cellWidth: 60 }; // Tiempo

      idx++;
    });



  // Render final de AutoTable
  doc.autoTable({
    startY: 350,
    margin: { left: 80 },
    tableWidth: "wrap",
    tableLineWidth: 0.1,
    tableLineColor: "#999",
    drawCell: function (data) {
      const cell = data.cell;

      // Si es la última columna → quitamos el borde derecho
      if (data.column.index === data.table.columns.length - 1) {
        cell.styles.lineWidthRight = 0;
      }
    },
    head,
    body,
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 5, overflow: "linebreak" },
    headStyles: {
      fillColor: [153, 15, 12],
      textColor: 255,
      fontStyle: "bold",
      halign: "center"
    },
    columnStyles,
    horizontalPageBreak: true,
  });


  // ============================================================
  // 💰 Totales alineados sin desbordarse
  // ============================================================

  let y = doc.lastAutoTable.finalY + 25;

  const tablaX = doc.lastAutoTable.finalX || 80;
  const tablaW = doc.lastAutoTable.width || 380;

  const posX = tablaX + tablaW - 160;

  doc.setFont("helvetica", "bold");
  doc.setTextColor("#000000");
  doc.setFontSize(11);

  // SUBTOTAL
  doc.text(`SUBTOTAL: $${subtotal.toLocaleString("es-CO")}`, posX, y);
  y += 15;

  // DESCUENTO
  if (descuento > 0) {
    doc.setTextColor(ROJO_OSCURO);
    doc.text(
      `DESCUENTO (${descuento}%): -$${valorDescuento.toLocaleString("es-CO")}`,
      posX,
      y
    );
    y += 15;
    doc.setTextColor("#000000");
  }

  // GASTOS ADICIONALES
  if (!ocultarGastos && gastosAdicionales > 0) {
    doc.text(
      `Gastos adicionales: $${gastosAdicionales.toLocaleString("es-CO")}`,
      posX,
      y
    );
    y += 15;
  }

  // IVA
  if (aplicarIVA) {
    doc.text(
      `IVA (19%): $${valorIVA.toLocaleString("es-CO")}`,
      posX,
      y
    );
    y += 15;
  }

  // TOTAL FINAL
  doc.setFillColor(153, 15, 12);
  doc.setTextColor("#FFFFFF");
  doc.rect(posX - 10, y - 12, 180, 25, "F");
  doc.text(
    `TOTAL FINAL: $${totalFinal.toLocaleString("es-CO")}`,
    posX,
    y + 5
  );


  // ============================================================
  // 💾 GUARDAR COTIZACIÓN EN HISTORIAL
  // ============================================================
  try {
    const cot = window.obtenerCotizacionActual();
    window.guardarCotizacion(cot);
    console.log("💾 Cotización guardada desde PDF:", cot);
  } catch (e) {
    console.warn("⚠ No se pudo guardar la cotización:", e);
  }


  // ============================================================
  // ✒ FIRMA + CIERRE
  // ============================================================

  const textoCierre = `
Agradecemos la oportunidad de presentarle esta cotización.
Nuestro equipo está disponible para resolver cualquier inquietud.
  `;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor("#333");
  doc.text(textoCierre, 80, y + 50, { maxWidth: pageWidth - 160 });

  const lineaY = pageHeight - 125;
  doc.setDrawColor(0, 0, 0);
  doc.line(80, lineaY, 260, lineaY);
  doc.text("Firma responsable", 80, lineaY + 17);
  doc.setFont("helvetica", "bold");
  doc.text("GADIER SISTEMAS", 80, lineaY + 32);

  // Mostrar PDF
  const pdfUrl = doc.output("bloburl");
  window.open(pdfUrl, "_blank");
};

// ============================================================
// 🔧 Convertir imagen a Base64
// ============================================================
function toBase64(url) {
  return fetch(url)
    .then(r => r.blob())
    .then(blob =>
      new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onloadend = () => res(reader.result);
        reader.onerror = rej;
        reader.readAsDataURL(blob);
      })
    );
}
