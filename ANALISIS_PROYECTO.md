# Análisis del Proyecto: Gadier Sistemas (Mockup Cotización)

## 1. Visión General
El proyecto es una aplicación web ("Single Page Application" en práctica) diseñada para generar, gestionar y visualizar cotizaciones de servicios especializados (archivísticos y bibliotecológicos). Funciona como un prototipo de alta fidelidad con funcionalidad productiva en el lado del cliente.

Permite al usuario componer una cotización compleja agregando procesos, subprocesos, suministros, equipos, funcionarios y servicios de aliados, para finalmente exportar documentos corporativos (PDF) o presentaciones de propuesta de valor (PowerPoint/PPTX).

## 2. Arquitectura y Tecnologías
*   **Frontend**: HTML5 Semántico, CSS3 Modular (Vanilla), JavaScript (ES6+).
*   **Persistencia**: `localStorage` del navegador.
    *   *Uso*: Guardado de sesión (`usuario_logueado`), historial de cotizaciones y clientes favoritos.
*   **Motores de Generación Documental (Client-Side)**:
    *   **PDF**: `jspdf` y `jspdf-autotable` para reportes tabulares y formales.
    *   **PowerPoint**: `pptxgenjs` para diapositivas de propuestas comerciales visuales.
*   **Estructura de Datos**:
    *   `procesos_data.js`: Fuente de verdad para **precios y estructura taxonómica** (Procesos -> Subprocesos).
    *   `plantillasProcesos.js`: Fuente de **contenido rico** (descripciones, beneficios, mensajes de venta) para los documentos generados.

## 3. Estructura de Archivos y Módulos
El proyecto sigue una arquitectura modular clara en `assets/`:

*   **`assets/js/`**:
    *   `cotizacion.js`: Controlad principal de la vista de cotización.
    *   `tabla_resumen.js`: Gestión de la tabla reactiva de ítems cotizados.
    *   `modulos_extras.js`: Lógica para Suministros, Equipos y Aliados.
    *   `funcionarios.js`: Lógica compleja para cálculo de distribución de tiempos (días/horas) y gastos de personal.
    *   `pdf_gadier.js` / `propuesta_valor.js`: Motores de exportación independientes.
*   **`assets/css/`**: Estilos "scoped" por archivo para mantener el orden (`suministros.css`, `funcionarios.css`, etc.), cargados centralmente en el layout.

## 4. Análisis de Funcionalidad

### Puntos Fuertes
1.  **Separación de Datos y Presentación**: La división entre `procesos_data.js` (lógica de negocio) y `plantillasProcesos.js` (narrativa comercial) es excelente para mantener el contenido.
2.  **Interactividad Avanzada**:
    *   Cálculos en tiempo real de totales, descuentos y estimaciones.
    *   Módulo de **Funcionarios** con distribución automática de carga laboral (algoritmo de días hábiles vs total funcionarios).
3.  **Portabilidad Total**: Al no requerir backend, la aplicación es extremadamente fácil de desplegar y rápida.
4.  **Generación de Documentos**: La capacidad de generar PPTX editables y PDFs estandarizados directamente en el navegador es un valor agregado alto.

### Áreas de Mejora y Riesgos
*   **Datos Hardcoded**: Aunque separados, los precios y textos residen en archivos JS. Un cambio de precios requiere despliegue de código.
*   **Seguridad de Sesión**: La autenticación en `auth.js` valida credenciales quemadas en código. Es funcional para un mockup/herramienta interna desconectada, pero crítico para una web pública.
*   **Persistencia Local**: Los datos viven en el navegador del usuario. No hay sincronización entre dispositivos ni backup en nube.

## 5. Estado Actual (Hallazgos Recientes)
*   ✅ **Corrección de Estilos**: Se verificó la existencia de `cotizaciones_guardadas.css`, resolviendo problemas visuales previos.
*   ✅ **Módulo de Funcionarios**: Se ha implementado una lógica robusta para calcular costos de personal basados en tiempo, diferenciando entre honorarios y gastos operativos.
*   ✅ **Favoritos**: Implementación funcional de guardado de datos de clientes frecuentes para agilizar nuevas cotizaciones.

## 6. Recomendaciones Técnicas
1.  **Refactorización a JSON**: Mover los objetos de `plantillasProcesos.js` y `procesos_data.js` a archivos `.json` reales en la carpeta `data/` y cargarlos vía `fetch`. Esto permitiría editar precios sin tocar lógica JS.
2.  **Validación de Tipos**: Al crecer la lógica matemática (especialmente en funcionarios), implementar validaciones más estrictas o usar JSDoc para asegurar que los cálculos operan sobre números y no strings concatenados.
3.  **Backup de Datos**: Crear una utilidad pequeña para "Exportar Datos" que genere un JSON con todas las cotizaciones guardadas y favoritos, permitiendo al usuario respaldar su información local.
