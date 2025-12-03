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
    mensajeProcesoCompleto: `
Este servicio se ejecuta de forma integral e incluye: actualización masiva de documentos electrónicos, normalización de metadatos, depuración de duplicados, control de versiones, revisión de consistencia y estandarización completa del repositorio digital institucional.
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
    mensajeProcesoCompleto: `
Incluye la administración integral de los procesos de gestión documental dentro de la entidad, con personal especializado, supervisión continua, control de calidad, atención inmediata y manejo directo de todos los flujos y actividades archivísticas.
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
    mensajeProcesoCompleto: `
Este servicio incluye el suministro continuo de equipos especializados, mantenimiento preventivo,
soporte técnico, reemplazo por fallas y disponibilidad garantizada durante todo el proyecto.
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
    mensajeProcesoCompleto: `
El servicio completo incluye la evaluación general de la gestión documental, diseño de políticas,
alineación normativa, acompañamiento técnico, formación especializada y establecimiento de estrategias
integrales de mejora institucional.
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
    mensajeProcesoCompleto: `
El servicio integral de consultoría incluye diagnóstico especializado, análisis estratégico,
diseño de soluciones, implementación de mejoras, creación de instrumentos archivísticos y
alineación total con estándares nacionales e internacionales.
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
    mensajeProcesoCompleto: `
Incluye el diseño, actualización y validación técnica de todos los instrumentos archivísticos institucionales,
siguiendo los lineamientos del AGN y asegurando coherencia normativa y funcional.
    `,
    subprocesos: {
      "PINAR": "Plan Institucional de Archivos - orienta la gestión documental institucional.",
      "TRD-CCD": "Tablas de Retención Documental y Cuadro de Clasificación Documental - define tiempos de conservación y disposición final y estructura funcionalmente las series documentales.",
      "INVENTARIOS": "Instrumentos de control y descripción de los documentos custodiados.",
      "TVD": "Tablas de Valoración Documental - determinan el valor secundario de los archivos.",
      "PGD": "Programa de Gestión Documental - estructura la política general de archivos.",
      "ID": "Instrumentos de Descripción - mejoran el acceso a la información archivística.",
      "RGD": "Reglamento General de Archivos - define normas internas de gestión documental.",
      "MPA": "Manuales de Procedimiento Archivístico - estandarizan las operaciones técnicas.",
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
    mensajeProcesoCompleto: `
Este servicio incluye la intervención completa del archivo institucional: diagnóstico técnico,
clasificación, ordenación, descripción, depuración, identificación de unidades de conservación,
y estructuración de instrumentos archivísticos esenciales.
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
    // 🔎 CONSULTAS DE DOCUMENTOS
    // ======================================================
    "Consultas": {
      descripcion: `
  El servicio de Consultas Documentales de Gadier Sistemas permite localizar,
  verificar y suministrar información contenida en los archivos institucionales.
  Atendemos solicitudes internas o externas asegurando trazabilidad,
  tiempos de respuesta eficientes y cumplimiento de protocolos de consulta.
      `,
      mensajeProcesoCompleto: `
  Incluye recepción de la solicitud, verificación de disponibilidad,
  búsqueda en fondos documentales físicos y/o digitales, registro de consulta,
  entrega controlada, digitalización cuando aplica y cierre formal del requerimiento.
      `,
      subprocesos: {
        // Sin subprocesos definidos en dataSubprocesos, pero dejamos uno general
        "Atención de consulta": `
          Gestión completa de la solicitud: búsqueda, verificación, registro,
          control del préstamo y cierre del requerimiento documental.
        `
      },
      beneficios: [
        "Trazabilidad completa de cada solicitud de información.",
        "Reducción de tiempos de respuesta institucional.",
        "Mejor control y seguridad sobre los documentos consultados."
      ]
    },

      // ======================================================
      // 📦 TRASLADO DE ARCHIVOS
      // ======================================================
      "Traslado de archivos": {
        descripcion: `
    El Traslado de Archivos de Gadier Sistemas garantiza el movimiento seguro,
    técnico y controlado de fondos documentales dentro o fuera de las instalaciones
    del cliente. Aplicamos protocolos de embalaje, identificación y transporte que
    preservan la integridad física y la organización de los documentos.
        `,
        mensajeProcesoCompleto: `
    Incluye alistamiento, clasificación previa, rotulación de unidades,
    embalaje técnico, cargue y descargue seguro, transporte interno o externo
    y verificación final de entrega. Todo con registro fotográfico y trazabilidad.
        `,
        subprocesos: {
          "Cajas": `
            Traslado de cajas documentales con embalaje técnico,
            rotulación, registro de unidades y transporte seguro.
          `
        },
        beneficios: [
          "Minimiza riesgos de pérdida o daño documental durante el traslado.",
          "Preserva la organización original de los fondos documentales.",
          "Incluye trazabilidad completa y registro técnico del proceso."
        ]
      },


  /// ======================================================
  // 🧹 DEPURACIÓN
  // ======================================================
  "Depuración": {
    descripcion: `
  El servicio de Depuración Documental de Gadier Sistemas permite identificar,
  analizar y clasificar documentos que ya cumplieron su función administrativa,
  legal o fiscal, preparando el fondo documental para procesos de organización
  o eliminación regulada.
    `,
    mensajeProcesoCompleto: `
  Incluye revisión técnica de documentos, identificación de unidades susceptibles
  de depuración, validación normativa con TRD vigentes, y elaboración de informes
  técnicos de diagnóstico y recomendaciones.
    `,
    subprocesos: {
      "Servicio de depuración documental": `
        Realizamos la depuración documental conforme a criterios técnicos y normativos,
        identificando documentos que han perdido vigencia según TRD o procesos internos
        de la entidad. Se entrega informe con evidencias y recomendaciones para disposición final.
      `
    },
    beneficios: [
      "Optimiza el volumen documental y reduce cargas de almacenamiento.",
      "Mejora la organización previa a procesos de archivo o digitalización.",
      "Cumple lineamientos del AGN para depuración técnica documental."
    ]
  },

  // ======================================================
  // 🗑️ ELIMINACIÓN
  // ======================================================
  "Eliminación": {
    descripcion: `
  El servicio de Eliminación Documental garantiza la disposición final adecuada
  de documentos sin valor administrativo, fiscal o legal, siguiendo estrictamente
  las Tablas de Retención Documental y protocolos del Archivo General de la Nación.
    `,
    mensajeProcesoCompleto: `
  Incluye análisis de TRD, preparación de listados, validación ante Comité Evaluador,
  elaboración de actas de eliminación, ejecución de destrucción controlada y entrega
  de informe final con evidencias y certificaciones.
    `,
    subprocesos: {
      "Servicio de eliminación documental": `
        Ejecutamos la eliminación bajo criterios normativos, con actas completas,
        trazabilidad del proceso, evidencia fotográfica y métodos de destrucción
        certificados (trituración, incineración o eliminación digital controlada).
      `
    },
    beneficios: [
      "Cumple la normativa del AGN y disposiciones legales vigentes.",
      "Reduce costos de almacenamiento físico y digital.",
      "Garantiza seguridad, trazabilidad y confidencialidad en el proceso."
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
    mensajeProcesoCompleto: `
Este servicio cubre toda la cadena de custodia: recepción, verificación, clasificación,
codificación, almacenamiento seguro, auditorías periódicas, control de préstamos,
trazabilidad y gestión de entregas o retiros.
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
    mensajeProcesoCompleto: `
El diagnóstico integral incluye revisión normativa, análisis físico y digital, inspección de áreas productoras,
evaluación de flujos documentales, identificación de riesgos y elaboración de un informe técnico detallado
con recomendaciones estratégicas para la mejora archivística.
    `,
    subprocesos: {
      "Áreas": `
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
  }

};
