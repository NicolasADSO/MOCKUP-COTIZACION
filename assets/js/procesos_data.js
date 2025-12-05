// ============================================================
// 📚 DATA PROCESOS Y SUBPROCESOS — GADIER SISTEMAS (PRODUCCIÓN)
// Carga dinámica desde API PHP + Evento "GadierDataReady"
// ============================================================

window.dataProcesos = {};
window.dataSubprocesos = {};
window.gadierDataLoaded = false; // Flag para consumidores tardíos

(function () {
  console.log("⏳ Iniciando carga de datos desde API...");

  // 1. Mostrar Loader (Opcional, simple console por ahora)
  // podriamos inyectar un div de carga aqui si quisieramos

  fetch('api/data/servicios.php')
    .then(response => {
      if (!response.ok) throw new Error("Error HTTP: " + response.status);
      return response.json();
    })
    .then(data => {
      if (data.error) throw new Error(data.message);

      // 2. Asignar datos a globales
      window.dataProcesos = data.dataProcesos || {};
      window.dataSubprocesos = data.dataSubprocesos || {};
      window.gadierDataLoaded = true;

      console.log("✅ Datos cargados correctamente:", window.dataProcesos);

      // 3. Sincronizar con "Plantillas Editadas" (Legacy logic, mantenida por seguridad)
      syncPlantillasLocales();

      // 4. Despachar Evento para despertar a la APP
      document.dispatchEvent(new Event("GadierDataReady"));
    })
    .catch(err => {
      console.error("❌ Error fatal cargando servicios:", err);
      alert("Error cargando configuración de precios. Por favor recarga la página.\n" + err.message);
    });

  // ============================================================
  // 🔄 LOGICA LEGACY: Integrar subprocesos de plantillas locales
  // ============================================================
  function syncPlantillasLocales() {
    try {
      const edits = JSON.parse(localStorage.getItem("plantillasEditadas") || "{}");
      Object.keys(edits).forEach(proceso => {
        if (edits[proceso].subprocesos) {
          const nuevosNombres = Object.keys(edits[proceso].subprocesos);
          if (!window.dataSubprocesos[proceso]) {
            window.dataSubprocesos[proceso] = [];
          }
          const existentes = window.dataSubprocesos[proceso].map(item => item.nombre);
          nuevosNombres.forEach(nuevo => {
            if (!existentes.includes(nuevo)) {
              window.dataSubprocesos[proceso].push({ nombre: nuevo, valor: 0 });
            }
          });
        }
      });
    } catch (e) {
      console.warn("Error sincronizando subprocesos locales:", e);
    }
  }

})();
