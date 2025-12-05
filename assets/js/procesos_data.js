// ============================================================
// 📚 DATA PROCESOS Y SUBPROCESOS — GADIER SISTEMAS (OFICIAL)
// Fuente única para cotización, PDF, PPT y módulos futuros
// ============================================================

window.dataProcesos = {
  Archivístico: [
    "Diagnóstico",
    "Actualización de Archivos Electrónicos",
    "Administración In House",
    "Alquiler de Equipos",
    "Asesoría y cumplimiento de la ley",
    "Consultoría",
    "Elaboración de Instrumentos Archivísticos",
    "Organización",
    "Consultas",
    "Traslado de archivos",
    "Depuración",
    "Eliminación",
    "Custodia",
  ],

  Bibliotecología: [
    "Proceso personalizado"
  ]
};

window.dataSubprocesos = {
  Diagnóstico: [{ nombre: "Áreas", valor: 18000 }],

  "Actualización de Archivos Electrónicos": [
    { nombre: "Alistamiento", valor: 18000 },
    { nombre: "Indexación", valor: 25000 }
  ],

  "Administración In House": [
    { nombre: "Tiempo completo", valor: 35000 },
    { nombre: "Parcial", valor: 22000 }
  ],

  "Alquiler de Equipos": [
    { nombre: "Básicos", valor: 12000 },
    { nombre: "Medios", valor: 18000 },
    { nombre: "Especializados", valor: 25000 }
  ],

  "Asesoría y cumplimiento de la ley": [
    { nombre: "Registro de activos de información", valor: 40000 },
    { nombre: "Índice de información clasificada y reservada", valor: 45000 },
    { nombre: "Esquema de publicación de infomración", valor: 50000 }
  ],

  Consultoría: [
    { nombre: "Análisis de Requerimientos", valor: 42000 },
    { nombre: "Diseño de Políticas Documentales", valor: 48000 },
    { nombre: "Gestión de Riesgos Archivísticos", valor: 46000 },
    { nombre: "Evaluación de Cumplimiento", valor: 44000 }
  ],

  "Elaboración de Instrumentos Archivísticos": [
    { nombre: "PINAR", valor: 18000 },
    { nombre: "TRD-CCD", valor: 25000 },
    { nombre: "INVENTARIOS", valor: 20000 },
    { nombre: "TVD", valor: 22000 },
    { nombre: "PGD", valor: 30000 },
    { nombre: "ID", valor: 27000 },
    { nombre: "RGD", valor: 25000 },
    { nombre: "MPA", valor: 32000 },
  ],

  Organización: [
    { nombre: "Clasificacion", valor: 22000 },
    { nombre: "Ordenación", valor: 24000 },
    { nombre: "Descripción", valor: 28000 }
  ],

  "Consultas": [
    { nombre: "En sede con transporte", valor: 25000 },
    { nombre: "En sede sin transporte", valor: 15000 },
    { nombre: "Fisica urgente con transporte", valor: 35000 },
    { nombre: "Fisica urgente sin transporte", valor: 20000 },
    { nombre: "Fisica normal con transporte", valor: 22000 },
    { nombre: "Fisica normal sin transporte", valor: 12000 },
    { nombre: "Digital", valor: 8000 }
  ],

  "Traslado de archivos": [
    { nombre: "Cajas", valor: 15000 },
  ],


  "Depuración": [
    { nombre: "Servicio de depuración documental", valor: 20000 },

  ],

  "Eliminación": [
    { nombre: "Servicio de eliminación documental", valor: 20000 },

  ],

  Custodia: [
    { nombre: "Recepción y verificación de fondos documentales", valor: 20000 },
    { nombre: "Clasificación por series y unidades de conservación", valor: 22000 },
    { nombre: "Rotulación y codificación de cajas o contenedores", valor: 21000 },
    { nombre: "Ingreso en sistema de control de depósitos", valor: 23000 },
    { nombre: "Ubicación física en estantería o depósito", valor: 20000 },
    { nombre: "Seguimiento y control periódico de conservación", valor: 24000 },
    { nombre: "Entrega o retiro bajo acta de custodia", valor: 25000 }
  ]
};

// ============================================================
// 🔄 LIVE SYNC: INTEGRAR SUBPROCESOS CREADOS EN "PLANTILLAS"
// ============================================================
(function () {
  try {
    const edits = JSON.parse(localStorage.getItem("plantillasEditadas") || "{}");

    // Recorrer cada proceso editado
    Object.keys(edits).forEach(proceso => {
      // Si tiene subprocesos definidos
      if (edits[proceso].subprocesos) {
        const nuevosNombres = Object.keys(edits[proceso].subprocesos);

        // Verificar si el proceso existe en dataSubprocesos, si no, crearlo
        if (!window.dataSubprocesos[proceso]) {
          window.dataSubprocesos[proceso] = [];
        }

        // Obtener nombres existentes para evitar duplicados
        const existentes = window.dataSubprocesos[proceso].map(item => item.nombre);

        nuevosNombres.forEach(nuevo => {
          if (!existentes.includes(nuevo)) {
            // Agregar el nuevo subproceso a la lista de opciones para cotizar
            // Se le asigna valor 0 por defecto ya que el editor de texto no gestiona precios
            console.log(`➕ Agregando nuevo subproceso desde plantillas: [${proceso}] -> ${nuevo}`);
            window.dataSubprocesos[proceso].push({ nombre: nuevo, valor: 0 });
          }
        });
      }
    });
  } catch (e) {
    console.warn("Error sincronizando subprocesos de plantillas:", e);
  }
})();
