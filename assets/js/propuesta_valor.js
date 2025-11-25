// ============================================================
// 💼 PROPUESTA DE VALOR — GADIER SISTEMAS
// (Versión limpia, optimizada y sin errores de scope)
// ============================================================

// ============= UTILIDADES GLOBALES ==========================
document.addEventListener("DOMContentLoaded", () => {
  console.log("🧾 [PropuestaValor] Inicializado correctamente");

  window.normalizarTexto = (str) =>
    !str ? "" :
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  window.nombreSeguroArchivo = (nombre) =>
    (nombre || "Cliente")
      .replace(/[\\/:*?"<>|]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 40);

  // ➤ Coincidencia flexible de subprocesos
  window.encontrarSubproceso = function(diccionario, nombreVisible) {
    if (!diccionario) return null;

    const visibleNorm = normalizarTexto(nombreVisible);

    // Coincidencia exacta
    let claveReal = Object.keys(diccionario).find(
      k => normalizarTexto(k) === visibleNorm
    );
    if (claveReal)
      return { nombre: claveReal, descripcion: diccionario[claveReal] };

    // Coincidencia "contiene"
    claveReal = Object.keys(diccionario).find(
      k =>
        normalizarTexto(k).includes(visibleNorm) ||
        visibleNorm.includes(normalizarTexto(k))
    );
    if (claveReal)
      return { nombre: claveReal, descripcion: diccionario[claveReal] };

    // No encontrado
    return { nombre: nombreVisible, descripcion: "— Sin descripción registrada —" };
  };
});

// ============================================================
// 🟥 MODAL PARA OBTENER NOMBRE DESTINATARIO
// ============================================================
async function obtenerDatosCliente() {
  return new Promise((resolve) => {
    const modal = document.getElementById("modalCliente");
    const inputCliente = modal.querySelector("#inputCliente");
    const btnGuardar = modal.querySelector("#btnGuardarCliente");
    const btnCancelar = modal.querySelector("#btnCancelarCliente");

    // restaurar previo
    const previo = sessionStorage.getItem("nombreClienteGadier");
    if (previo) inputCliente.value = previo;

    modal.style.display = "flex";
    document.body.classList.add("modal-activo");

    // cancelar
    btnCancelar.onclick = () => {
      modal.style.display = "none";
      document.body.classList.remove("modal-activo");
      resolve(null);
    };

    // guardar
    btnGuardar.onclick = () => {
      const cliente = inputCliente.value.trim();
      if (!cliente) {
        alert("⚠ Debe ingresar el nombre.");
        inputCliente.focus();
        return;
      }
      sessionStorage.setItem("nombreClienteGadier", cliente);
      modal.style.display = "none";
      document.body.classList.remove("modal-activo");
      resolve({ cliente });
    };
  });
}

// ============================================================
// 🔥 GENERAR PPT
// ============================================================
document.addEventListener("click", async (e) => {
  const btn = e.target.closest("#btnPropuestaValor");
  if (!btn) return;

  if (!window.resumen || window.resumen.length === 0) {
    return alert("⚠ No hay elementos seleccionados.");
  }

  // === Visibles para contenido del PPT
  const visibles = window.resumen.filter(r => r.visible !== false);

  // ============================================================
  // 🧮 VALORES ECONÓMICOS CON REDISTRIBUCIÓN INVERSA
  // ============================================================

  // --- 1. CALCULAR SUBTOTAL TOTAL (incluye ocultos) ---
  let subtotalTotal = 0;
  window.resumen.forEach(r => {
    const valorUnit = r.valor || 0;
    const costo = r.costo ?? (r.cantidad * valorUnit);
    subtotalTotal += costo;
  });

  // --- 2. SUBTOTAL SOLO VISIBLES ---
  let subtotalVisible = 0;
  visibles.forEach(r => {
    const valorUnit = r.valor || 0;
    const costo = r.costo ?? (r.cantidad * valorUnit);
    subtotalVisible += costo;
  });

  subtotalVisible = Math.round(subtotalVisible);

  // --- 3. COSTO OCULTOS ---
  const costoOcultos = subtotalTotal - subtotalVisible;

  // ============================================================
  // 🔥 4. REPARTICIÓN INVERSA (baratos reciben más peso)
  // ============================================================
  let pesos = [];
  let sumaPesos = 0;

  visibles.forEach(r => {
    const valorUnit = r.valor || 0;
    const costoBase = r.costo ?? (r.cantidad * valorUnit);

    const peso = 1 / costoBase; // inverso: barato = más peso
    pesos.push({ r, peso, costoBase });
    sumaPesos += peso;
  });

  // ============================================================
  // 🔧 5. Función para obtener costo final redistribuido
  // ============================================================
  const obtenerCostoFinal = (r) => {
    const valorUnit = r.valor || 0;
    const costoBase = r.costo ?? (r.cantidad * valorUnit);

    const pesoObj = pesos.find(p => p.r === r);
    if (!pesoObj || sumaPesos === 0) return costoBase;

    const extra = (pesoObj.peso / sumaPesos) * costoOcultos;
    return Math.round(costoBase + extra);
  };


  if (visibles.length === 0) {
    return alert("⚠ Todos los elementos están ocultos.");
  }

  // === obtener cliente
  const datosCliente = await obtenerDatosCliente();
  if (!datosCliente) return;
  const nombreCliente = datosCliente.cliente;
  const fechaGeneracion = new Date().toLocaleDateString("es-CO");

  // ============================================================
  // 📌 PROCESAMIENTO DE PROCESOS + SUBPROCESOS
  // ============================================================

  const obtenerProcesoBase = (r) => (r.proceso || "").split(" - ")[0].trim();

  const procesosUnicos = [
    ...new Set(visibles.filter(r => r.proceso).map(obtenerProcesoBase))
  ];

  const propuesta = procesosUnicos
    .map(nombre => {
      const plantilla = plantillasProcesos[nombre];
      if (!plantilla) return null; // si no existe plantilla, ignorar

      // recolectar subprocesos visibles
      const subprocesosVisibles = [
        ...new Set(
          visibles
            .filter(r => obtenerProcesoBase(r) === nombre)
            .flatMap(r => {
              // Nuevo formato (array)
              if (Array.isArray(r.subprocesos) && r.subprocesos.length)
                return r.subprocesos;

              // Viejo formato: "Proceso - Sub"
              const partes = (r.proceso || "").split(" - ");
              return partes[1] ? [partes[1]] : [];
            })
            .filter(Boolean)
        )
      ];

      // convertir a objetos con descripción
      const detallesSubprocesos = subprocesosVisibles.map(sp =>
        window.encontrarSubproceso(plantilla.subprocesos || {}, sp)
      );

      return {
        nombre,
        descripcion: plantilla.descripcion?.trim() || "",
        subprocesos: detallesSubprocesos,
        beneficios: plantilla.beneficios || []
      };
    })
    .filter(Boolean);

  if (!propuesta.length) {
    return alert("⚠ Ningún proceso tiene plantilla disponible.");
  }

  // ============================================================
  // 🎨 CREACIÓN DEL PPT
  // ============================================================
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";

  // ============================================================
  // 🟥 PORTADA
  // ============================================================
  const slidePortada = pptx.addSlide();
  try { slidePortada.background = { path: "assets/img/portada-propuesta.png" }; } catch {}

  try {
    slidePortada.addImage({
      path: "assets/img/logo-blanco-sin-fondo.png",
      x: 6.4, y: 3.1, w: 3.8, h: 2.1
    });
  } catch {}

  slidePortada.addText(`Dirigido a: ${nombreCliente}`, {
    x: 1.0, y: 4.2, w: 8.5, fontSize: 20, color: "222222"
  });

  slidePortada.addText(`Fecha: ${fechaGeneracion}`, {
    x: 1.0, y: 4.6, w: 8.5, fontSize: 18, color: "333333"
  });

  slidePortada.addText("Gadier Sistemas • marketing@gadiersistemas.com • gadiersistemas.com", {
    x: 0.8, y: 6.1, w: 8.4, fontSize: 10, color: "666666", align: "center"
  });

  // ============================================================
  // 🎨 SLIDES DE PROCESOS
  // ============================================================
  propuesta.forEach(p => {
    // --- slide 1 ---
    const s1 = pptx.addSlide();
    try { s1.background = { path: "assets/img/textos-propuesto.png" }; } catch {}

    s1.addText(p.nombre.toUpperCase(), {
      x: 1, y: 0.8, fontSize: 28, color: "990f0c", bold: true
    });

    // ==== AJUSTE DINÁMICO DE ALTURA ====
    // medimos según caracteres
    const largo = p.descripcion.length;

    // si es muy larga → iniciar más arriba y dar más espacio
    let yDescripcion = (largo > 400) ? 1.2 : (largo > 250) ? 1.3 : 1.6;
    let altoDescripcion = (largo > 400) ? 4.8 : (largo > 250) ? 4.2 : 3.2;

    s1.addText(p.descripcion, {
      x: 1,
      y: yDescripcion,
      w: 8.4,
      h: altoDescripcion,
      fontSize: 16,
      color: "333333",
      align: "justify"
    });


        // --- slide 2 (Paginación automática de contenido) ---
    const crearSlideDetalle = () => {
        const s = pptx.addSlide();
        try { s.background = { path: "assets/img/textos-propuesto.png" }; } catch {}

        s.addText(`${p.nombre.toUpperCase()} — Detalle`, {
            x: 1, y: 0.6, fontSize: 26, bold: true, color: "990f0c"
        });

        return s;
    };

    let s2 = crearSlideDetalle();
    let y = 1.3;

    // Título subprocesos
    s2.addText("📂 Subprocesos Seleccionados:", {
        x: 1, y, fontSize: 17, bold: true, color: "7d0c0a"
    });
    y += 0.45;

    // =====================================================
    // 1️⃣ SUBPROCESOS (paginación automática)
    // =====================================================
    for (const sp of p.subprocesos) {
        if (y + 1.2 > 5.2) {
            s2 = crearSlideDetalle();
            y = 1.3;

            s2.addText("📂 Subprocesos Seleccionados:", {
                x: 1, y, fontSize: 17, bold: true, color: "7d0c0a"
            });
            y += 0.45;
        }

        s2.addShape(pptx.shapes.RECTANGLE, {
            x: 1, y, w: 8, h: 1,
            fill: { color: "FAFAFA" },
            line: { color: "DDDDDD" }
        });

        s2.addText(`• ${sp.nombre}`, {
            x: 1.2, y: y + 0.1,
            fontSize: 14, bold: true, color: "990f0c"
        });

        s2.addText(sp.descripcion, {
            x: 1.2, y: y + 0.5, w: 7.7,
            fontSize: 12, color: "333333", align: "justify"
        });

        y += 1.2;
    }

    // =====================================================
    // 2️⃣ BENEFICIOS (paginación automática)
    // =====================================================
    if (p.beneficios.length) {

        if (y + 0.8 > 5.2) {
            s2 = crearSlideDetalle();
            y = 1.3;
        }

        s2.addText("🌟 Beneficios:", {
            x: 1, y, fontSize: 17, bold: true, color: "7d0c0a"
        });
        y += 0.45;

        for (const b of p.beneficios) {

            if (y + 0.5 > 5.2) {
                s2 = crearSlideDetalle();
                y = 1.3;
                s2.addText("🌟 Beneficios:", {
                    x: 1, y, fontSize: 17, bold: true, color: "7d0c0a"
                });
                y += 0.45;
            }

            s2.addText(`• ${b}`, {
                x: 1.2, y,
                fontSize: 13, color: "444444"
            });

            y += 0.35;
        }
    }
  });

  // ============================================================
// 💰 SLIDE RESUMEN – IGUAL QUE PDF (mismos valores y filas)
// ============================================================
const slideResumen = pptx.addSlide();
try { slideResumen.background = { path: "assets/img/textos-propuesto.png" }; } catch {}

// ---- 1. Crear filas idénticas al PDF ----
const filas = [
  [
    { text: "Descripción", options: { bold: true, fill: { color: "990f0c" }, color: "FFFFFF" }},
    { text: "Cant.", options: { bold: true, fill: { color: "990f0c" }, color: "FFFFFF", align: "center" }},
    { text: "Valor unitario", options: { bold: true, fill: { color: "990f0c" }, color: "FFFFFF", align: "right" }},
    { text: "Total", options: { bold: true, fill: { color: "990f0c" }, color: "FFFFFF", align: "right" }}
  ]
];

// ---- 2. Filas de ítems visibles (misma lógica PDF) ----
visibles.forEach(r => {
  const costoFinal = Math.round(obtenerCostoFinal(r));

  filas.push([
    { text: r.proceso },
    { text: (r.cantidad || 1) + "", options: { align: "center" }},
    { text: `$${(r.valor || 0).toLocaleString("es-CO")}`, options: { align: "right" }},
    { text: `$${costoFinal.toLocaleString("es-CO")}`, options: { align: "right", bold: true }},
  ]);
});

// ---- 3. Totales (idénticos al PDF) ----
const subtotalFinal = visibles.reduce((acc, r) => acc + Math.round(obtenerCostoFinal(r)), 0);
const dPct = parseFloat(document.getElementById("descuentoInput")?.value || 0);
const dVal = subtotalFinal * (dPct / 100);
const subtotalDesc = subtotalFinal - dVal;
const aplicarIVA = document.getElementById("chkIVA")?.checked || false;
const iva = aplicarIVA ? subtotalDesc * 0.19 : 0;
const totalFinal = subtotalDesc + iva;

filas.push([
  { text: "SUBTOTAL", options: { bold: true, align: "right" }},
  { text: "" },
  { text: "" },
  { text: `$${subtotalFinal.toLocaleString("es-CO")}`, options: { bold: true, align: "right" }}
]);

if (dPct > 0) {
  filas.push([
    { text: `DESCUENTO (${dPct}%)`, options: { bold: true, align: "right", color: "7d0c0a" }},
    { text: "" },
    { text: "" },
    { text: `-$${dVal.toLocaleString("es-CO")}`, options: { bold: true, align: "right", color: "7d0c0a" }}
  ]);
}

if (aplicarIVA) {
  filas.push([
    { text: "IVA (19%)", options: { bold: true, align: "right" }},
    { text: "" },
    { text: "" },
    { text: `$${iva.toLocaleString("es-CO")}`, options: { bold: true, align: "right" }}
  ]);
}

filas.push([
  { text: "TOTAL FINAL", options: { bold: true, align: "right", fill: { color: "990f0c" }, color: "FFFFFF" }},
  { text: "", options: { fill: { color: "990f0c" }}},
  { text: "", options: { fill: { color: "990f0c" }}},
  { text: `$${totalFinal.toLocaleString("es-CO")}`, options: { bold: true, align: "right", fill: { color: "990f0c" }, color: "FFFFFF" }}
]);

// ---- 4. Dibujar tabla en el slide ----
slideResumen.addText("📄 Resumen de la Propuesta de Valor", {
  x: 0.5,
  y: 0.6,
  w: 9,
  h: 0.6,
  fontSize: 30,
  bold: true,
  color: "990f0c",
  align: "center",
});

// === TABLA ÚNICA IGUAL AL PDF ===
slideResumen.addTable(filas, {
  x: 0.5,
  y: 1.5,
  w: 9,
  colW: [4, 1, 2, 2],
  fontSize: 13,
});


  // ============================================================
  // 🖋 SLIDE FINAL
  // ============================================================
  const slideFin = pptx.addSlide();
  try { slideFin.background = { path: "assets/img/cierre-presupuesto.png" }; } catch {}

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
});
