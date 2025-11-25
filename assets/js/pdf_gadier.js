// ============================================================
// 📄 PDF CORPORATIVO - GADIER SISTEMAS
// (Solo ítems visibles + IVA y descuento incluidos)
// ============================================================

document.addEventListener("click", async (e) => {
  const btn = e.target.closest("#btnPDF");
  if (!btn) return;

  if (!window.resumen || window.resumen.length === 0) {
    alert("⚠️ No hay elementos en la cotización para generar el PDF.");
    return;
  }

  // === Obtener datos del modal elegante para PDF ===
  const datosPDF = await obtenerDatosPDF();
  if (!datosPDF) return;

  const cliente = datosPDF.nombre;
  const correo = datosPDF.correo;
  const telefono = datosPDF.telefono;


  //------------------------------------------------------
  // 🟥 MODAL BONITO PARA PDF — GADIER SISTEMAS
  //------------------------------------------------------
  async function obtenerDatosPDF() {
    return new Promise((resolve) => {
      const modal = document.getElementById("modalPDF");
      const inputNombre = document.getElementById("pdfNombre");
      const inputCorreo = document.getElementById("pdfCorreo");
      const inputTelefono = document.getElementById("pdfTelefono");

      const btnAceptar = document.getElementById("btnPDFAceptar");
      const btnCancelar = document.getElementById("btnPDFCancelar");

      modal.style.display = "flex";
      document.body.classList.add("modal-activo");

      btnCancelar.onclick = () => {
        modal.style.display = "none";
        document.body.classList.remove("modal-activo");
        resolve(null);
      };

      btnAceptar.onclick = () => {
        const nombre = inputNombre.value.trim() || "Cliente";
        const correo = inputCorreo.value.trim() || "sin_correo@gadiersistemas.com";
        const telefono = inputTelefono.value.trim() || "Sin especificar";

        modal.style.display = "none";
        document.body.classList.remove("modal-activo");

        resolve({ nombre, correo, telefono });
      };
    });
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const ROJO = "#990f0c";
  const ROJO_OSCURO = "#7d0c0a";

  // === Fondo plantilla Canva Gadier ===
  try {
    // Carpeta donde está el archivo actual (cotizacion.html)
    const rutaCarpeta = window.location.href.substring(
      0,
      window.location.href.lastIndexOf("/") + 1
    );

    // Carga correcta de la plantilla PDF
    const plantilla = await toBase64(rutaCarpeta + "assets/img/formato-pdf.png");

    doc.addImage(plantilla, "PNG", 0, 0, pageWidth, pageHeight);
  } catch (err) {
    console.warn("⚠️ No se pudo cargar la plantilla Gadier:", err);
  }


  // === Título principal ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(ROJO);
  doc.text("COTIZACIÓN OFICIAL", pageWidth / 2 + 40, 85, { align: "center" });

  // === Datos del cliente ===
  doc.setFont("helvetica", "bold");
  doc.setTextColor(ROJO);
  doc.text("Datos del cliente", 320, 130);

  doc.setTextColor("#000000");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Cliente: ${cliente}`, 320, 150);
  doc.text(`Teléfono: ${telefono}`, 320, 165);
  doc.text(`Correo: ${correo}`, 320, 180);
  doc.text(`Fecha: ${new Date().toLocaleDateString("es-CO")}`, 320, 195);

  // === Texto introductorio ===
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor("#333333");
  const textoIntro = `
Nos complace presentarle esta propuesta elaborada con dedicación para ofrecerle una solución que aporte valor real a su organización.

En Gadier Sistemas creemos que la tecnología es más que herramientas: es un puente hacia la eficiencia y la excelencia. Nuestro compromiso es acompañarle con cercanía, profesionalismo y transparencia.

`;
  doc.text(textoIntro, 80, 230, { maxWidth: pageWidth - 160, lineHeightFactor: 1.5 });

  // ============================================================
  // 📊 Tabla principal (solo elementos visibles) — Con redistribución inversa
  // ============================================================
  const visibles = window.resumen.filter(r => r.visible !== false);
  if (visibles.length === 0) {
    alert("⚠️ Todos los elementos están ocultos. No hay nada para exportar al PDF.");
    return;
  }

  // ---------------------------------------------
  // 1. CALCULAR SUBTOTAL TOTAL (incluye ocultos)
  // ---------------------------------------------
  let subtotalTotal = 0;
  window.resumen.forEach(r => {
    const valorUnitario = r.valor || 0;
    const costo = r.costo ?? (r.cantidad * valorUnitario);
    subtotalTotal += costo;
  });

  // ---------------------------------------------
  // 2. SUBTOTAL SOLO VISIBLES
  // ---------------------------------------------
  let subtotalVisible = 0;
  visibles.forEach(r => {
    const valorUnitario = r.valor || 0;
    const costo = r.costo ?? (r.cantidad * valorUnitario);
    subtotalVisible += costo;
  });

  // ---------------------------------------------
  // 3. COSTOS OCULTOS A REPARTIR
  // ---------------------------------------------
  const costoOcultos = subtotalTotal - subtotalVisible;

  // ============================================================
  // 🔥 4. REPARTICIÓN INVERSA (más peso a procesos baratos)
  // ============================================================
  let pesos = [];
  let sumaPesos = 0;

  visibles.forEach(r => {
    const valorUnitario = r.valor || 0;
    const costoBase = r.costo ?? (r.cantidad * valorUnitario);

    const peso = 1 / costoBase; // inverso: barato = mayor peso
    pesos.push({ r, peso, costoBase });
    sumaPesos += peso;
  });

  // -----------------------------------------------------------
  // 5. FUNCIÓN PARA OBTENER EL COSTO FINAL REDISTRIBUIDO
  // -----------------------------------------------------------
  const obtenerCostoFinal = (r) => {
    const valorUnitario = r.valor || 0;
    const costoBase = r.costo ?? (r.cantidad * valorUnitario);

    const pesoObj = pesos.find(p => p.r === r);
    if (!pesoObj || sumaPesos === 0) return costoBase;

    const parteExtra = (pesoObj.peso / sumaPesos) * costoOcultos;
    return costoBase + parteExtra;
  };

  // -----------------------------------------------------------
  // 6. ARMAR TABLA PARA PDF CON COSTO FINAL REAL
  // -----------------------------------------------------------
  const tableData = visibles.map((r) => [
    r.proceso || "",
    r.cantidad || 1,
    `$${(r.valor || 0).toLocaleString("es-CO")}`,
    `$${Math.round(obtenerCostoFinal(r)).toLocaleString("es-CO")}`,
  ]);

  // -----------------------------------------------------------
  // 7. TOTALES (usando costo redistribuido)
  // -----------------------------------------------------------
  const descuento = parseFloat(document.getElementById("descuentoInput")?.value || 0);
  const aplicarIVA = document.getElementById("chkIVA")?.checked || false;

  const subtotal = visibles.reduce((acc, r) => acc + obtenerCostoFinal(r), 0);

  const valorDescuento = subtotal * (descuento / 100);
  const subtotalConDescuento = subtotal - valorDescuento;

  const valorIVA = aplicarIVA ? subtotalConDescuento * 0.19 : 0;

  const totalFinal = subtotalConDescuento + valorIVA;

  // -----------------------------------------------------------
  // 8. AUTOTABLE (igual que tu versión original)
  // -----------------------------------------------------------
  doc.autoTable({
    startY: 350,
    tableWidth: "auto",
    head: [["Descripción", "Cant.", "Valor unitario", "Total"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [153, 15, 12], textColor: 255, halign: "center", fontStyle: "bold" },
    styles: { fontSize: 10, cellPadding: 5, halign: "center" },
    columnStyles: {
      0: { halign: "left", cellWidth: 220 },
      1: { halign: "center", cellWidth: 60 },
      2: { halign: "right", cellWidth: 90 },
      3: { halign: "right", cellWidth: 90 },
    },
  });


  // ============================================================
  // 💰 Totales con IVA y Descuento
  // ============================================================
  let y = doc.lastAutoTable.finalY + 25;
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#000000");
  doc.setFontSize(11);

  doc.text(`SUBTOTAL: $${subtotal.toLocaleString("es-CO")}`, 380, y);
  y += 15;

  if (descuento > 0) {
    doc.setTextColor(ROJO_OSCURO);
    doc.text(`DESCUENTO (${descuento}%): -$${valorDescuento.toLocaleString("es-CO")}`, 380, y);
    y += 15;
  }

  if (aplicarIVA) {
    doc.setTextColor("#000000");
    doc.text(`IVA (19%): $${valorIVA.toLocaleString("es-CO")}`, 380, y);
    y += 15;
  }

  // TOTAL FINAL
  doc.setFillColor(153, 15, 12);
  doc.setTextColor("#FFFFFF");
  doc.rect(370, y, 160, 25, "F");
  doc.text(`TOTAL FINAL: $${totalFinal.toLocaleString("es-CO")}`, 380, y + 17);

  // ============================================================
  // ✒️ Texto de cierre + Firma
  // ============================================================
  const textoCierre = `
Agradecemos la oportunidad de presentarle esta cotización. 
Nuestro equipo está disponible para resolver cualquier inquietud y ajustar la propuesta según sus necesidades.

Gracias por confiar en Gadier Sistemas.
`;
  doc.setTextColor("#333333");
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text(textoCierre, 80, y + 60, { maxWidth: pageWidth - 160, lineHeightFactor: 1.4 });

  // Firma
  const firmaLineaY = pageHeight - 125;
  const firmaTextoY = firmaLineaY + 17;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.6);
  doc.line(80, firmaLineaY, 260, firmaLineaY);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#000000");
  doc.text("Firma responsable", 80, firmaTextoY);
  doc.setFont("helvetica", "bold");
  doc.text("GADIER SISTEMAS", 80, firmaTextoY + 15);

  // === Abrir vista previa ===
  const pdfUrl = doc.output("bloburl");
  window.open(pdfUrl, "_blank");
});

// ============================================================
// 🔧 Utilidad: convertir imagen a Base64
// ============================================================
function toBase64(url) {
  return fetch(url)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result;
            window._plantillaBase64 = base64;
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );
}
