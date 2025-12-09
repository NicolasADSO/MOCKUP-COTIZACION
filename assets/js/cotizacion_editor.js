// ============================================================
// ✏️ EDITOR DE COTIZACIONES - GADIER SISTEMAS
// Funcionalidad para cargar y editar cotizaciones existentes
// ============================================================

// Variables globales
let modoEdicion = false;
let cotizacionEditando = null;

// Detectar parámetro de URL para edición
const urlParams = new URLSearchParams(window.location.search);
const cotizacionEditarId = urlParams.get('editar');

// ============================================================
// ✏️ CARGAR COTIZACIÓN PARA EDITAR
// ============================================================
async function cargarCotizacionParaEditar(id) {
    try {
        console.log(`⏳ Cargando cotización ID: ${id}...`);

        const response = await fetch(`api/cotizaciones/get.php?id=${id}`);
        const result = await response.json();

        if (!result.success) {
            alert("❌ Error al cargar la cotización para editar");
            console.error(result.message);
            return;
        }

        const data = result.data;
        cotizacionEditando = data;
        modoEdicion = true;

        console.log("📥 Cotización cargada:", data);

        // Decodificar datos_json
        const datosJson = data.datos_json;

        // === 1️⃣ Restaurar items en tabla resumen ===
        if (datosJson.items && Array.isArray(datosJson.items)) {
            window.resumen = [];
            datosJson.items.forEach(item => {
                window.resumen.push({
                    area: item.area,
                    proceso: item.proceso,
                    subprocesos: item.subprocesos || [],
                    unidad: item.unidad,
                    cantidad: item.cantidad,
                    valor: item.valor,
                    costo: item.costo,
                    tiempo: item.tiempo || "—",
                    visible: true  // ⭐ Importante para que se muestre en la tabla
                });
            });

            if (window.renderTabla) {
                window.renderTabla();
            }
        }

        // === 2️⃣ Limpiar selectores para que funcionen correctamente ===
        const selectArea = document.getElementById("selectArea");
        const selectProceso = document.getElementById("selectProceso");
        const selectSubproceso = document.getElementById("selectSubproceso");
        const divSubprocesos = document.getElementById("divSubprocesos");

        if (selectArea) selectArea.value = "";
        if (selectProceso) {
            selectProceso.innerHTML = '<option value="">Seleccione primero un área</option>';
            selectProceso.disabled = true;
        }
        if (selectSubproceso) {
            selectSubproceso.innerHTML = '<option value="">Seleccione primero un proceso</option>';
            selectSubproceso.disabled = true;
        }
        if (divSubprocesos) divSubprocesos.style.display = "none";

        // === 3️⃣ Restaurar configuración ===
        if (datosJson.configuracion) {
            const config = datosJson.configuracion;

            // Descuento
            const descuentoInput = document.getElementById("descuentoInput");
            if (descuentoInput && config.descuento !== undefined) {
                descuentoInput.value = config.descuento;
            }

            // IVA
            const checkIVA = document.getElementById("checkIVA") || document.getElementById("chkIVA");
            if (checkIVA && config.aplicarIVA !== undefined) {
                checkIVA.checked = config.aplicarIVA;
            }

            // Días de vigencia
            const vigenciaInput = document.getElementById("diasVigencia");
            if (vigenciaInput && config.vigenciaDias !== undefined) {
                vigenciaInput.value = config.vigenciaDias;
            }
        }

        // === 4️⃣ Restaurar datos del cliente ===
        if (datosJson.cliente) {
            window.datosClienteGlobal = datosJson.cliente;
        }

        // === 5️⃣ Actualizar UI para indicar modo edición ===
        const header = document.querySelector('.navbar-fija h1');
        if (header) {
            header.innerHTML = `✏️ Editando: ${data.codigo}`;
            header.style.color = '#FF9800';
        }

        // Recalcular totales (llamar dos veces para asegurar)
        if (window.renderTabla) {
            setTimeout(() => window.renderTabla(), 100);
        }

        console.log("✅ Cotización cargada exitosamente en el editor");

    } catch (error) {
        console.error("❌ Error cargando cotización:", error);
        alert("Error al cargar la cotización. Verifica la consola.");
    }
}

// ============================================================
// 💾 GUARDAR CAMBIOS EN COTIZACIÓN (Override)
// ============================================================
const guardarCotizacionOriginal = window.guardarCotizacion;

window.guardarCotizacion = function (cotizacion) {
    if (!cotizacion) return;

    // Si estamos en modo edición, actualizar en lugar de crear
    if (modoEdicion && cotizacionEditando) {
        console.log("💾 Actualizando cotización existente...", cotizacion);

        let clienteId = null;
        if (cotizacion.cliente && cotizacion.cliente.id) {
            clienteId = cotizacion.cliente.id;
        }

        const payload = {
            id: cotizacionEditando.id,
            datos_json: {
                cliente: cotizacion.cliente,
                configuracion: cotizacion.configuracion,
                items: cotizacion.items
            },
            cliente_id: clienteId,
            total_estimado: cotizacion.totalFinal,
            estado: cotizacionEditando.estado || 'Borrador'
        };

        fetch('api/cotizaciones/update.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    console.log("✅ Cotización actualizada exitosamente");
                    alert("✅ Cambios guardados correctamente");
                } else {
                    console.error("❌ Error actualizando cotización:", data.message);
                    alert("❌ Error al guardar cambios: " + data.message);
                }
            })
            .catch(err => {
                console.error("❌ Error de red:", err);
                alert("❌ Error de conexión al guardar");
            });

    } else {
        // Modo normal: crear nueva cotización en BD
        console.log("💾 Guardando nueva cotización en BD...", cotizacion);

        const payload = {
            cliente_id: cotizacion.cliente?.id || null,
            total: cotizacion.totalFinal || 0,
            cliente: cotizacion.cliente,
            items: cotizacion.items,
            configuracion: cotizacion.configuracion
        };

        fetch('api/cotizaciones/save.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    console.log("✅ Cotización guardada con ID:", data.id);
                    // Opcional: Redirigir a modo edición o solo notificar
                    // alert("✅ Cotización guardada exitosamente"); 
                    // No alertamos para no interrumpir el flujo del PDF
                } else {
                    console.error("❌ Error guardando:", data.message);
                }
            })
            .catch(err => console.error("❌ Error de red al guardar:", err));
    }
};

// ============================================================
// 🚀 INICIALIZACIÓN AUTOMÁTICA
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que el cotizador esté listo
    setTimeout(() => {
        if (cotizacionEditarId) {
            console.log(`✏️ Modo edición activado para ID: ${cotizacionEditarId}`);
            cargarCotizacionParaEditar(cotizacionEditarId);
        }
    }, 1000); // Esperar 1 segundo para que todo se inicialice
});
