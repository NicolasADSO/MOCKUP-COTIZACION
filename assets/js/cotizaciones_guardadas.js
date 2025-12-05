// ============================================================
// 🗂️ COTIZACIONES GUARDADAS — SISTEMA GADIER
// Carga, filtros, acciones y render dinámico
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    console.log("%c📁 Módulo Cotizaciones Guardadas Cargado", "color:#990f0c;font-weight:bold;");

    cargarCotizaciones();

    document.getElementById("buscarCotizacion").addEventListener("input", filtrarCotizaciones);
    document.getElementById("filtroFecha").addEventListener("change", filtrarCotizaciones);
    document.getElementById("filtroEstado").addEventListener("change", filtrarCotizaciones);
});

// ============================================================
// 🔄 CARGAR COTIZACIONES DESDE LOCALSTORAGE
// ============================================================
function cargarCotizaciones() {
    const cotizaciones = JSON.parse(localStorage.getItem("cotizaciones_guardadas")) || [];
    window.cotizacionesBase = cotizaciones;
    mostrarCotizaciones(cotizaciones);
}

// ============================================================
// 📌 MOSTRAR COTIZACIONES EN LA TABLA
// ============================================================
function mostrarCotizaciones(lista) {
    const tbody = document.getElementById("listaCotizaciones");
    tbody.innerHTML = "";

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="vacio">No hay cotizaciones guardadas</td></tr>`;
        return;
    }

    lista.forEach(cot => {
        const fila = `
      <tr>
        <td>${cot.id}</td>
        <td>${cot.fecha}</td>
        <td>${cot.cliente.nombre}</td>
        <td>${cot.cliente.empresa}</td>
        <td>$${Number(cot.total).toLocaleString("es-CO")}</td>
        <td>
          <button class="btn-ver" onclick="verDetalle('${cot.id}')">Ver</button>
          <button class="btn-eliminar" onclick="eliminarCotizacion('${cot.id}')">Eliminar</button>
        </td>
      </tr>
    `;
        tbody.innerHTML += fila;
    });
}

// ============================================================
// 🔍 FILTROS (BUSQUEDA Y FECHA)
// ============================================================
function filtrarCotizaciones() {
    const texto = document.getElementById("buscarCotizacion").value.toLowerCase();
    const filtroFecha = document.getElementById("filtroFecha").value;
    const filtroEstado = document.getElementById("filtroEstado").value;

    let filtradas = window.cotizacionesBase;

    // --- Filtro texto ---
    filtradas = filtradas.filter(c =>
        c.cliente.nombre.toLowerCase().includes(texto) ||
        c.cliente.empresa.toLowerCase().includes(texto) ||
        c.cliente.nit.toLowerCase().includes(texto)
    );

    // --- Filtro fecha ---
    const hoy = new Date();

    if (filtroFecha === "hoy") {
        filtradas = filtradas.filter(c => c.fecha === hoy.toISOString().split("T")[0]);
    }

    if (filtroFecha === "semana") {
        filtradas = filtradas.filter(c => {
            const fechaC = new Date(c.fecha);
            return (hoy - fechaC) / (1000 * 60 * 60 * 24) <= 7;
        });
    }

    if (filtroFecha === "mes") {
        filtradas = filtradas.filter(c => {
            const fechaC = new Date(c.fecha);
            return (hoy - fechaC) / (1000 * 60 * 60 * 24) <= 30;
        });
    }

    // --- Filtro estado ---
    if (filtroEstado) {
        filtradas = filtradas.filter(c => c.estado === filtroEstado);
    }

    mostrarCotizaciones(filtradas);
}

// ============================================================
// 📄 VER DETALLE DE LA COTIZACIÓN
// ============================================================
function verDetalle(id) {
    const cot = window.cotizacionesBase.find(c => c.id === id);
    if (!cot) return alert("Error: Cotización no encontrada.");

    // Llenar datos cliente
    document.getElementById("detCliente").textContent = cot.cliente.nombre;
    document.getElementById("detEmpresa").textContent = cot.cliente.empresa || "—";
    document.getElementById("detNit").textContent = cot.cliente.nit || cot.cliente.numeroIdent || "—";
    document.getElementById("detFecha").textContent = cot.fecha;

    // Llenar tabla
    const tbody = document.getElementById("detTablaBody");
    tbody.innerHTML = "";

    cot.items.forEach(item => {
        const fila = `
            <tr>
                <td>${item.proceso} ${item.subprocesos && item.subprocesos.length ? `<br><small>${item.subprocesos.join(", ")}</small>` : ""}</td>
                <td>${item.unidad || "—"}</td>
                <td style="text-align:center;">${item.cantidad}</td>
                <td style="text-align:right;">$${Number(item.valor).toLocaleString("es-CO")}</td>
                <td style="text-align:right;">$${Number(item.costo).toLocaleString("es-CO")}</td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });

    // Total
    document.getElementById("detTotal").textContent = "$" + Number(cot.total).toLocaleString("es-CO");

    // Mostrar modal
    document.getElementById("modalDetalle").style.display = "flex";
    document.body.classList.add("modal-activo");

    // Configurar botón imprimir (opcional, por ahora solo log)
    document.getElementById("btnImprimirDetalle").onclick = () => {
        alert("🖨️ Función de imprimir detalle en desarrollo...");
    };
}

// ============================================================
// ❌ CERRAR MODAL
// ============================================================
document.getElementById("btnCerrarModal").addEventListener("click", cerrarModal);
document.getElementById("btnCerrarModalAbajo").addEventListener("click", cerrarModal);

function cerrarModal() {
    document.getElementById("modalDetalle").style.display = "none";
    document.body.classList.remove("modal-activo");
}

// Cerrar al hacer clic fuera
document.getElementById("modalDetalle").addEventListener("click", (e) => {
    if (e.target.id === "modalDetalle") cerrarModal();
});

// ============================================================
// ❌ ELIMINAR COTIZACIÓN
// ============================================================
function eliminarCotizacion(id) {
    if (!confirm("¿Seguro que deseas eliminar esta cotización?")) return;

    let cotizaciones = JSON.parse(localStorage.getItem("cotizaciones_guardadas")) || [];
    cotizaciones = cotizaciones.filter(c => c.id !== id);

    localStorage.setItem("cotizaciones_guardadas", JSON.stringify(cotizaciones));

    cargarCotizaciones();
}
