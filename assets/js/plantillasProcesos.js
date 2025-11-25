// ============================================================
// 🧾 PLANTILLAS DE PROCESOS — GADIER SISTEMAS
// (Descripciones, subprocesos y beneficios por proceso)
// ============================================================

const plantillasProcesos = {

  // ======================================================
  // 📂 ACTUALIZACIÓN DE ARCHIVOS ELECTRÓNICOS
  // ======================================================
  "Actualización de Archivos Electrónicos": {
    descripcion: `
En Gadier Sistemas comprendemos que la información es el corazón de toda organización moderna. 
Nuestro servicio de Actualización de Archivos Electrónicos garantiza que los documentos digitales se mantengan vigentes, organizados y seguros.

Aplicamos metodologías de control de versiones, depuración de duplicados, integración de metadatos y verificación de consistencia, asegurando que su entorno documental sea confiable, accesible y alineado con las normas de preservación digital.
    `,
    subprocesos: {
      "Alistamiento": `
        Preparamos y estandarizamos los documentos digitales antes de su actualización,
        garantizando que cumplan con los parámetros técnicos y normativos para mantener la integridad documental.
      `,
      "Indexación": `
        Asignamos metadatos y descriptores que facilitan la búsqueda rápida y precisa de la información.
        Nuestra indexación inteligente mejora la trazabilidad y el acceso en los repositorios digitales.
      `
    },
    beneficios: [
      "Mantiene su base documental digital actualizada y libre de duplicados.",
      "Optimiza el acceso y recuperación de la información institucional.",
      "Aumenta la confiabilidad y trazabilidad de sus archivos digitales."
    ]
  },

  // ======================================================
  // 🏢 ADMINISTRACIÓN IN HOUSE
  // ======================================================
  "Administración In House": {
    descripcion: `
Con la Administración Documental In House de Gadier Sistemas, su entidad contará con un equipo especializado que gestiona directamente en sus instalaciones todos los procesos archivísticos.

Ofrecemos presencia constante, control de calidad, seguimiento en tiempo real y total confidencialidad en el manejo de la información institucional.
    `,
    subprocesos: {
      "Tiempo completo": `
        Gestión documental presencial con dedicación exclusiva. Supervisión constante,
        seguimiento y ejecución directa de los procesos en las instalaciones del cliente.
      `,
      "Parcial": `
        Servicio flexible con dedicación parcial, ideal para acompañamiento y soporte técnico
        en entidades con menor volumen o frecuencia operativa.
      `
    },
    beneficios: [
      "Ejecución permanente y control directo de los procesos archivísticos.",
      "Ahorro de recursos en desplazamientos y coordinación externa.",
      "Atención inmediata ante requerimientos institucionales o auditorías."
    ]
  },

  // ======================================================
  // ⚙️ ALQUILER DE EQUIPOS
  // ======================================================
  "Alquiler de Equipos": {
    descripcion: `
Gadier Sistemas ofrece alquiler de equipos especializados para proyectos de gestión documental,
digitalización y procesamiento de archivos. Todos nuestros dispositivos cuentan con mantenimiento
preventivo y soporte técnico garantizado.
    `,
    subprocesos: {
      "Básicos": `
        Equipos para tareas de organización, descripción o captura de bajo volumen.
        Ideales para proyectos pequeños o en etapas iniciales.
      `,
      "Medios": `
        Equipos intermedios con alto rendimiento para digitalización continua
        y procesamiento de datos de mediana complejidad.
      `,
      "Especializados": `
        Equipos de alta gama para digitalización masiva, OCR o análisis documental avanzado.
      `
    },
    beneficios: [
      "Evita inversión en infraestructura propia.",
      "Garantiza disponibilidad y mantenimiento técnico continuo.",
      "Permite escalar o reducir capacidad según los requerimientos del proyecto."
    ]
  },

  // ======================================================
  // 💬 ASESORÍA
  // ======================================================
  "Asesoría": {
    descripcion: `
La Asesoría Archivística de Gadier Sistemas ofrece acompañamiento técnico y estratégico
en diagnóstico, planeación y mejora de los procesos de gestión documental.

Alineamos las prácticas de su organización con la normatividad del Archivo General de la Nación
y las mejores metodologías de conservación y acceso a la información.
    `,
    subprocesos: {
      "Diagnóstico archivístico": `
        Evaluamos la situación actual del archivo institucional y definimos líneas
        de acción para optimizar su gestión documental.
      `,
      "Diseño de políticas": `
        Elaboramos o ajustamos políticas internas y manuales de gestión documental
        de acuerdo con los lineamientos del AGN.
      `,
      "Capacitación y acompañamiento": `
        Brindamos formación y soporte técnico para asegurar la correcta implementación
        de los instrumentos archivísticos y normativos.
      `
    },
    beneficios: [
      "Asegura el cumplimiento de la Ley 594 y normas AGN.",
      "Optimiza tiempos y recursos en la gestión documental.",
      "Fortalece la cultura organizacional archivística."
    ]
  },

  // ======================================================
  // 🧭 CONSULTORÍA
  // ======================================================
  "Consultoría": {
    descripcion: `
Nuestra Consultoría Archivística transforma la gestión documental en un valor estratégico
para su institución. Desarrollamos planes, políticas e instrumentos alineados con los
estándares nacionales e internacionales.
    `,
    subprocesos: {
      "Análisis de requerimientos": `
        Identificamos oportunidades de mejora y diseñamos soluciones personalizadas
        para la estructura documental de su entidad.
      `,
      "Gestión de riesgos archivísticos": `
        Evaluamos vulnerabilidades en los procesos y establecemos controles preventivos
        para garantizar continuidad operativa y seguridad de la información.
      `,
      "Evaluación de cumplimiento": `
        Revisamos el nivel de adopción de las políticas AGN y generamos informes técnicos
        con planes de acción detallados.
      `
    },
    beneficios: [
      "Fortalece la gobernanza documental y la trazabilidad institucional.",
      "Mejora el control, acceso y preservación de los documentos.",
      "Alinea la gestión documental con los objetivos estratégicos."
    ]
  },

  // ======================================================
  // 🧾 ELABORACIÓN DE INSTRUMENTOS ARCHIVÍSTICOS
  // ======================================================
  "Elaboración de Instrumentos Archivísticos": {
    descripcion: `
Diseñamos y actualizamos los instrumentos archivísticos exigidos por el Archivo General de la Nación (AGN),
garantizando el cumplimiento normativo y la estructuración técnica de la gestión documental institucional.
    `,
    subprocesos: {
      "PINAR": "Plan Institucional de Archivos - orienta la gestión documental institucional.",
      "TRD": "Tablas de Retención Documental - define tiempos de conservación y disposición final.",
      "INVENTARIOS": "Instrumentos de control y descripción de los documentos custodiados.",
      "TVD": "Tablas de Valoración Documental - determinan el valor secundario de los archivos.",
      "PGD": "Programa de Gestión Documental - estructura la política general de archivos.",
      "ID": "Instrumentos de Descripción - mejoran el acceso a la información archivística.",
      "RGD": "Reglamento General de Archivos - define normas internas de gestión documental.",
      "MPA": "Manuales de Procedimiento Archivístico - estandarizan las operaciones técnicas.",
      "CCD": "Cuadro de Clasificación Documental - estructura funcionalmente las series documentales."
    },
    beneficios: [
      "Cumple con los lineamientos del Archivo General de la Nación.",
      "Fortalece la trazabilidad y gobernanza de la información.",
      "Facilita auditorías, seguimiento y control institucional."
    ]
  },

  // ======================================================
  // 📁 ORGANIZACIÓN DOCUMENTAL
  // ======================================================
  "Organización": {
    descripcion: `
La Organización Documental de Gadier Sistemas garantiza el orden técnico, físico y digital
de sus fondos documentales, cumpliendo con los principios de procedencia y orden original.
    `,
    subprocesos: {
      "Diagnóstico": `
        Analizamos el estado físico y normativo del archivo institucional
        para planificar una intervención adecuada.
      `,
      "Clasificación": `
        Agrupamos documentos según su origen, función y valor,
        aplicando criterios archivísticos técnicos.
      `,
      "Ordenación": `
        Establecemos una secuencia lógica y física que garantice
        el acceso rápido a los documentos.
      `,
      "Descripción": `
        Elaboramos instrumentos que facilitan la localización e identificación
        de los documentos archivísticos.
      `
    },
    beneficios: [
      "Facilita la recuperación inmediata de documentos.",
      "Garantiza cumplimiento técnico y normativo.",
      "Optimiza el uso del espacio físico y digital."
    ]
  },

  // ======================================================
  // 🧹 DEPURACIÓN Y ELIMINACIÓN
  // ======================================================
  "Depuración y Eliminación": {
    descripcion: `
Ejecutamos el proceso de depuración y eliminación documental con rigor técnico,
cumpliendo los protocolos del Archivo General de la Nación y garantizando seguridad,
confidencialidad y trazabilidad total del proceso.
    `,
    subprocesos: {
      "Revisión de series documentales": `
        Identificamos las series susceptibles de eliminación según TRD y criterios legales.
      `,
      "Aplicación de Tablas de Retención Documental": `
        Validamos tiempos de conservación y disposición final según la normativa vigente.
      `,
      "Identificación de expedientes": `
        Determinamos los documentos que han cumplido su función legal o administrativa.
      `,
      "Elaboración de actas de eliminación": `
        Documentamos el proceso con soporte técnico, legal y fotográfico.
      `,
      "Gestión de aprobación": `
        Coordinamos con el comité evaluador para la aprobación del proceso de eliminación.
      `,
      "Destrucción controlada": `
        Ejecutamos la eliminación mediante métodos certificados, preservando la confidencialidad.
      `,
      "Informe final": `
        Entregamos un informe consolidado con evidencia del proceso completo.
      `
    },
    beneficios: [
      "Cumple la Ley 594 y directrices del AGN.",
      "Optimiza espacios y recursos de almacenamiento.",
      "Garantiza transparencia y trazabilidad total del proceso."
    ]
  },

  // ======================================================
  // 🏢 CUSTODIA DOCUMENTAL
  // ======================================================
  "Custodia": {
    descripcion: `
La Custodia Documental de Gadier Sistemas ofrece almacenamiento físico y digital
bajo condiciones seguras, controladas y trazables, garantizando conservación, integridad
y disponibilidad de los fondos documentales institucionales.
    `,
    subprocesos: {
      "Recepción y verificación": `
        Revisamos el estado físico y verificamos inventarios al recibir el fondo documental.
      `,
      "Clasificación y codificación": `
        Organizamos las unidades de conservación según series y subseries documentales.
      `,
      "Ingreso en sistema": `
        Registramos los documentos en el sistema de control de depósitos
        con trazabilidad por código o ubicación.
      `,
      "Seguimiento y control": `
        Realizamos auditorías periódicas de conservación y prestamos controlados.
      `,
      "Entrega o retiro": `
        Gestionamos el préstamo, traslado o devolución bajo acta de custodia.
      `
    },
    beneficios: [
      "Asegura la conservación física y digital de los archivos.",
      "Permite control total sobre el inventario documental.",
      "Facilita auditorías y consultas bajo condiciones seguras."
    ]
  },

  // ======================================================
  // 🩺 DIAGNÓSTICO
  // ======================================================
  "Diagnóstico": {
    descripcion: `
  El servicio de Diagnóstico Documental de Gadier Sistemas permite evaluar el estado actual
  de los archivos institucionales, identificando fortalezas, debilidades y oportunidades de mejora
  en los procesos de gestión documental.

  Nuestro equipo realiza una revisión técnica y normativa completa que servirá como punto de partida
  para la planeación de acciones correctivas o de modernización archivística.
    `,
    subprocesos: {
      "areas": `
        Analizamos las áreas funcionales y unidades productoras de documentos para identificar
        necesidades, flujos de información y riesgos asociados a la gestión documental.
      `
    },
    beneficios: [
      "Brinda una visión clara del estado actual del archivo institucional.",
      "Facilita la toma de decisiones estratégicas para la mejora de la gestión documental.",
      "Permite planificar correctamente procesos de organización o digitalización futuros."
    ],
    valores: [
      { nombre: "Áreas", valor: 18000 }
    ]
  },


  

};
