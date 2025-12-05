// ============================================================
// 📋 HISTORIAL DE COTIZACIONES — GADIER SISTEMAS
// ============================================================

let paginaActual = 1;
let totalPaginas = 1;

// ============================================================
// 🔄 CARGAR COTIZACIONES DESDE API
// ============================================================
async function cargarCotizaciones(pagina = 1) {
    const spinner = document.getElementById("loadingSpinner");
    const tabla = document.getElementById("tablaCotizaciones");

    // Mostrar loading
    spinner.style.display = "block";
    tabla.innerHTML = "";

    // Construir URL con filtros
    const params = new URLSearchParams();
    params.append("page", pagina);

    const buscar = document.getElementById("filtroBuscar").value.trim();
    if (buscar) params.append("buscar", buscar);

    const clienteId = document.getElementById("filtroCliente").value;
    if (clienteId) params.append("cliente_id", clienteId);

    const estado = document.getElementById("filtroEstado").value;
    if (estado) params.append("estado", estado);

    const fechaDesde = document.getElementById("filtroFechaDesde").value;
    if (fechaDesde) params.append("fecha_desde", fechaDesde);

    const fechaHasta = document.getElementById("filtroFechaHasta").value;
    if (fechaHasta) params.append("fecha_hasta", fechaHasta);

    try {
        const response = await fetch(`api/cotizaciones/index.php?${params}`);
        const result = await response.json();

        if (result.success) {
            renderTabla(result.data);
            renderPaginacion(result.pagination);
            paginaActual = result.pagination.current_page;
            totalPaginas = result.pagination.total_pages;
        } else {
            tabla.innerHTML = `<div style="padding: 40px; text-align: center; color: #999;">
        ⚠️ Error al cargar cotizaciones: ${result.message}
      </div>`;
        }
    } catch (error) {
        console.error("Error:", error);
        tabla.innerHTML = `<div style="padding: 40px; text-align: center; color: #999;">
      ❌ Error de conexión. Verifica que el servidor esté activo.
    </div>`;
    } finally {
        spinner.style.display = "none";
    }
}

// ============================================================
// 🎨 RENDERIZAR TABLA
// ============================================================
function renderTabla(cotizaciones) {
    const tabla = document.getElementById("tablaCotizaciones");

    if (cotizaciones.length === 0) {
        tabla.innerHTML = `<div style="padding: 40px; text-align: center; color: #999;">
      📭 No hay cotizaciones que coincidan con los filtros.
    </div>`;
        return;
    }

    let html = `
    <table style="width: 100%; border-collapse: collapse;">
      <thead style="background: #990f0c; color: white;">
        <tr>
          <th style="padding: 12px; text-align: left;">Código</th>
          <th style="padding: 12px; text-align: left;">Cliente</th>
          <th style="padding: 12px; text-align: left;">Fecha</th>
          <th style="padding: 12px; text-align: right;">Total</th>
          <th style="padding: 12px; text-align: center;">Estado</th>
          <th style="padding: 12px; text-align: center;">Acciones</th>
        </tr>
      </thead>
      <tbody>
  `;

    cotizaciones.forEach(cot => {
        const fecha = new Date(cot.fecha_creacion).toLocaleDateString('es-CO');
        const total = Number(cot.total_estimado).toLocaleString('es-CO');
        const estadoBadge = getEstadoBadge(cot.estado);
        const clienteNombre = cot.cliente_nombre || "Sin cliente";

        html += `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px;"><strong>${cot.codigo}</strong></td>
        <td style="padding: 12px;">${clienteNombre}</td>
        <td style="padding: 12px;">${fecha}</td>
        <td style="padding: 12px; text-align: right;">$${total}</td>
        <td style="padding: 12px; text-align: center;">${estadoBadge}</td>
        <td style="padding: 12px; text-align: center;">
          <button onclick="editarCotizacion(${cot.id})" style="padding: 6px 12px; margin: 2px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
            ✏️ Editar
          </button>
          <button onclick="regenerarPDF(${cot.id})" style="padding: 6px 12px; margin: 2px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
            📄 PDF
          </button>
          <button onclick="cambiarEstado(${cot.id}, '${cot.estado}')" style="padding: 6px 12px; margin: 2px; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer;">
            🔄 Estado
          </button>
          <button onclick="eliminarCotizacion(${cot.id})" style="padding: 6px 12px; margin: 2px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
            🗑️
          </button>
        </td>
      </tr>
    `;
    });

    html += `</tbody></table>`;
    tabla.innerHTML = html;
}

// ============================================================
// 🏷️ BADGE DE ESTADO
// ============================================================
function getEstadoBadge(estado) {
    const colores = {
        'Borrador': '#999',
        'Enviada': '#2196F3',
        'Aprobada': '#4CAF50',
        'Rechazada': '#f44336'
    };

    const color = colores[estado] || '#999';
    return `<span style="background: ${color}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500;">${estado}</span>`;
}

// ============================================================
// 📄 PAGINACIÓN
// ============================================================
function renderPaginacion(pagination) {
    const paginacionDiv = document.getElementById("paginacion");

    if (pagination.total_pages <= 1) {
        paginacionDiv.innerHTML = "";
        return;
    }

    let html = `<div style="display: flex; justify-content: center; align-items: center; gap: 10px;">`;

    // Botón Anterior
    if (pagination.current_page > 1) {
        html += `<button onclick="cargarCotizaciones(${pagination.current_page - 1})" style="padding: 8px 16px; background: #990f0c; color: white; border: none; border-radius: 4px; cursor: pointer;">
      ← Anterior
    </button>`;
    }

    // Info página
    html += `<span style="color: #666;">
    Página ${pagination.current_page} de ${pagination.total_pages} (${pagination.total} cotizaciones)
  </span>`;

    // Botón Siguiente
    if (pagination.current_page < pagination.total_pages) {
        html += `<button onclick="cargarCotizaciones(${pagination.current_page + 1})" style="padding: 8px 16px; background: #990f0c; color: white; border: none; border-radius: 4px; cursor: pointer;">
      Siguiente →
    </button>`;
    }

    html += `</div>`;
    paginacionDiv.innerHTML = html;
}

// ============================================================
// ✏️ EDITAR COTIZACIÓN
// ============================================================
function editarCotizacion(id) {
    window.location.href = `cotizacion.html?editar=${id}`;
}

// ============================================================
// 📄 REGENERAR PDF
// ============================================================
async function regenerarPDF(id) {
    try {
        const response = await fetch(`api/cotizaciones/get.php?id=${id}`);
        const { success, data } = await response.json();

        if (!success) {
            alert("Error al obtener la cotización");
            return;
        }

        // Reconstruir objeto compatible con generarPDF
        window.datosClienteGlobal = data.datos_json.cliente || {};
        window.resumen = data.datos_json.items || [];
        // 🔧 Restaurar configuración global (Gastos, Descuentos, IVA)
        window.configuracionGlobal = data.datos_json.config || {};

        // Llamar a función de pdf_gadier.js
        if (window.generarPDFConDatos) {
            window.generarPDFConDatos();
        } else {
            alert("La función de generación de PDF no está disponible");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al regenerar PDF");
    }
}

// ============================================================
// 🔄 CAMBIAR ESTADO
// ============================================================
let cotizacionActualId = null;

async function cambiarEstado(id, estadoActual) {
    // Guardar ID actual
    cotizacionActualId = id;

    // Mostrar modal
    document.getElementById('estadoActualTexto').textContent = `Estado actual: ${estadoActual}`;
    document.getElementById('modalCambiarEstado').style.display = 'flex';
}

function cerrarModalEstado() {
    document.getElementById('modalCambiarEstado').style.display = 'none';
    cotizacionActualId = null;
}

async function seleccionarEstado(nuevoEstado) {
    if (!cotizacionActualId) return;

    try {
        const response = await fetch('api/cotizaciones/update.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: cotizacionActualId, estado: nuevoEstado })
        });

        const result = await response.json();

        if (result.success) {
            alert(`✅ Estado actualizado a: ${nuevoEstado}`);
            cerrarModalEstado();
            cargarCotizaciones(paginaActual);
        } else {
            alert(`❌ Error: ${result.message}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Error de conexión");
    }
}

// ============================================================
// 🗑️ ELIMINAR COTIZACIÓN
// ============================================================
async function eliminarCotizacion(id) {
    if (!confirm("¿Estás seguro de eliminar esta cotización? Esta acción no se puede deshacer.")) {
        return;
    }

    try {
        const response = await fetch(`api/cotizaciones/delete.php?id=${id}`);
        const result = await response.json();

        if (result.success) {
            alert("Cotización eliminada");
            cargarCotizaciones(paginaActual);
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión");
    }
}

// ============================================================
// 🚀 INICIALIZACIÓN
// ============================================================
document.addEventListener("DOMContentLoaded", async () => {


    // Cargar clientes para filtro
    await cargarClientesFiltro();

    // Cargar cotizaciones inicial
    cargarCotizaciones(1);

    // Event listeners
    document.getElementById("btnAplicarFiltros").addEventListener("click", () => {
        cargarCotizaciones(1); // Volver a página 1 al filtrar
    });

    // Filtrar al presionar Enter en búsqueda
    document.getElementById("filtroBuscar").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            cargarCotizaciones(1);
        }
    });
});

// ============================================================
// 👥 CARGAR CLIENTES PARA FILTRO
// ============================================================
async function cargarClientesFiltro() {
    try {
        const response = await fetch('api/clientes/index.php');
        const clientes = await response.json();

        const select = document.getElementById("filtroCliente");
        select.innerHTML = '<option value="">Todos</option>';

        clientes.forEach(c => {
            const label = c.empresa ? `${c.empresa} (${c.nombre_contacto})` : c.nombre_contacto;
            select.innerHTML += `<option value="${c.id}">${label}</option>`;
        });
    } catch (error) {
        console.error("Error cargando clientes:", error);
    }
}
