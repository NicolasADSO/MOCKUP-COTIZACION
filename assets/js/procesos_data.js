// ============================================================
// 📚 DATA PROCESOS Y SUBPROCESOS — GADIER SISTEMAS
// (Datos base para las áreas Archivístico y Bibliotecología)
// ============================================================

const dataProcesos = {
  "Archivístico": [
    "Actualización de archivos electrónicos",
    "Administración in house",
    "Alquiler de equipos",
    "Asesoría",
    "Consultoría",
    "Eliminación y Depuración",
    "Elaboración de Instrumentos Archivisticos",
    "Diagnostico",
    "Organización",
    "Otro"
  ],
  "Bibliotecología": [
    "Catalogación",
    "Alistamiento",
    "Entrega"
  ]
};

const dataSubprocesos = {
  "Actualización de archivos electrónicos": [
    { nombre: "Alistamiento", valor: 1200 },
    { nombre: "Indexación", valor: 1800 }
  ],
  "Administración in house": [
    { nombre: "Supervisión diaria", valor: 2000 },
    { nombre: "Gestión documental", valor: 2500 }
  ],
  "Alquiler de equipos": [
    { nombre: "Básicos", valor: 2000 },
    { nombre: "Medios", valor: 2300 },
    { nombre: "Especializados", valor: 2500 }
  ],
  "Asesoría": [
    { nombre: "Consultoría técnica", valor: 2500 },
    { nombre: "Acompañamiento documental", valor: 2200 }
  ],
  "Consultoría": [
    { nombre: "Planeación estratégica", valor: 3000 },
    { nombre: "Gestión de archivos", valor: 2800 }
  ],
  "Eliminación y Depuración": [
    { nombre: "Revisión de TRD", valor: 2000 },
    { nombre: "Identificación de series a eliminar", valor: 2200 },
    { nombre: "Elaboración de inventario de eliminación", valor: 2400 },
    { nombre: "Verificación legal y técnica", valor: 2600 },
    { nombre: "Preparación física para eliminación", valor: 1800 },
    { nombre: "Destrucción física controlada", valor: 2200 },
    { nombre: "Elaboración del acta de eliminación", valor: 2100 },
    { nombre: "Registro en sistema", valor: 1900 },
    { nombre: "Reporte final de eliminación", valor: 2000 },
  ],
  "Elaboración de Instrumentos Archivisticos": [
    { nombre: "PGD", valor: 2400 },
    { nombre: "PINAR", valor: 2600 },
    { nombre: "TRD", valor: 2800 },
    { nombre: "TVD", valor: 2450 },
    { nombre: "ID", valor: 1600 },
    { nombre: "RGD", valor: 2700 },
    { nombre: "MPA", valor: 2890 },
    { nombre: "CCD", valor: 2600 },
  ],
  "Diagnóstico": [
    { nombre: "area", valor: 1500 },
  ],
  "Organización": [
    { nombre: "Clasificación", valor: 1800 },
    { nombre: "Ordenación", valor: 1800 },
    { nombre: "Descripción", valor: 2200 }
  ]
};
