// ============================================================
// 🗂️ COTIZACIONES GUARDADAS — SISTEMA GADIER
// Agrupación por cliente, filtros, modal y acciones
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    console.log("%c📁 Módulo Cotizaciones Guardadas Cargado", "color:#990f0c;font-weight:bold;");

    cargarCotizaciones();

    document.getElementById("buscarCotizacion").addEventListener("input", filtrarCotizaciones);
    document.getElementById("filtroFecha").addEventListener("change", filtrarCotizaciones);
    document.getElementById("filtroEstado").addEventListener("change", filtrarCotizaciones);
});


// ============================================================
// 📌 AGRUPAR COTIZACIONES POR CLIENTE
// ============================================================
function agruparPorCliente(lista) {
    const grupos = {};

    lista.forEach(cot => {
        const clave =
            cot.cliente.correo ||
            cot.cliente.nit ||
            cot.cliente.empresa ||
            cot.cliente.nombre ||
            "SIN_NOMBRE";

        if (!grupos[clave]) {
            grupos[clave] = {
                cliente: cot.cliente,
                cotizaciones: []
            };
        }

        grupos[clave].cotizaciones.push(cot);
    });

    return grupos;
}


// ============================================================
// 🔄 CARGAR COTIZACIONES
// ============================================================
function cargarCotizaciones() {
    const cotizaciones = JSON.parse(localStorage.getItem("cotizaciones_guardadas")) || [];
    window.cotizacionesBase = cotizaciones;
    mostrarCotizaciones(cotizaciones);
}


// ============================================================
// 📌 MOSTRAR CARDS AGRUPADAS POR CLIENTE
// ============================================================
function mostrarCotizaciones(lista) {
    const cont = document.getElementById("listaCotizaciones");
    cont.innerHTML = "";

    if (!lista || lista.length === 0) {
        cont.innerHTML = `<p class="vacio">No hay cotizaciones guardadas</p>`;
        return;
    }

    const grupos = agruparPorCliente(lista);
    const claves = Object.keys(grupos);

    claves.forEach(key => {
        const grupo = grupos[key];
        const cliente = grupo.cliente;
        const cotizaciones = grupo.cotizaciones;

        const ultimaFecha = cotizaciones[cotizaciones.length - 1]?.fecha || "-";

        const card = document.createElement("div");
        card.className = "card-cliente";

        card.innerHTML = `
            <div class="card-header-icon">👤</div>

            <h3 class="card-title">${cliente.nombre}</h3>

            <p class="card-text"><strong>Empresa:</strong> ${cliente.empresa || "—"}</p>
            <p class="card-text"><strong>Cotizaciones:</strong> ${cotizaciones.length}</p>
            <p class="card-text"><strong>Última:</strong> ${ultimaFecha}</p>

            <button class="btn-ver-cot" onclick="verCotizacionesCliente('${key}')">
                Ver cotizaciones
            </button>
        `;

        cont.appendChild(card);
    });
}


// ============================================================
// 🔍 FILTROS
// ============================================================
function filtrarCotizaciones() {
    const texto = document.getElementById("buscarCotizacion").value.toLowerCase();
    const filtroFecha = document.getElementById("filtroFecha").value;
    const filtroEstado = document.getElementById("filtroEstado").value;

    let filtradas = [...window.cotizacionesBase];

    // --- Filtro texto ---
    if (texto.trim() !== "") {
        filtradas = filtradas.filter(c =>
            (c.cliente.nombre || "").toLowerCase().includes(texto) ||
            (c.cliente.empresa || "").toLowerCase().includes(texto) ||
            (c.cliente.nit || "").toLowerCase().includes(texto)
        );
    }

    // --- Filtro fecha ---
    const hoy = new Date();

    if (filtroFecha === "hoy") {
        filtradas = filtradas.filter(c => c.fecha === hoy.toISOString().split("T")[0]);
    }

    if (filtroFecha === "semana") {
        filtradas = filtradas.filter(c => {
            const fechaC = new Date(c.fecha);
            return (hoy - fechaC) / 86400000 <= 7;
        });
    }

    if (filtroFecha === "mes") {
        filtradas = filtradas.filter(c => {
            const fechaC = new Date(c.fecha);
            return (hoy - fechaC) / 86400000 <= 30;
        });
    }

    // --- Filtro por estado ---
    if (filtroEstado) {
        filtradas = filtradas.filter(c => c.estado === filtroEstado);
    }

    mostrarCotizaciones(filtradas);
}


// ============================================================
// 📄 VER DETALLE DE UNA COTIZACIÓN
// ============================================================
function verDetalle(id) {
    const cot = window.cotizacionesBase.find(c => c.id === id);
    if (!cot) return alert("Error: Cotización no encontrada.");

    document.getElementById("detCliente").textContent = cot.cliente.nombre;
    document.getElementById("detEmpresa").textContent = cot.cliente.empresa || "—";
    document.getElementById("detNit").textContent = cot.cliente.nit || cot.cliente.numeroIdent || "—";
    document.getElementById("detFecha").textContent = cot.fecha;

    const tbody = document.getElementById("detTablaBody");
    tbody.innerHTML = "";

    cot.items.forEach(item => {
        const fila = `
            <tr>
                <td>${item.proceso} ${item.subprocesos?.length ? `<br><small>${item.subprocesos.join(", ")}</small>` : ""}</td>
                <td>${item.unidad || "—"}</td>
                <td style="text-align:center;">${item.cantidad}</td>
                <td style="text-align:right;">$${Number(item.valor).toLocaleString("es-CO")}</td>
                <td style="text-align:right;">$${Number(item.costo).toLocaleString("es-CO")}</td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });

    document.getElementById("detTotal").textContent =
        "$" + Number(cot.total).toLocaleString("es-CO");

    document.getElementById("modalDetalle").style.display = "flex";
    document.body.classList.add("modal-activo");

    // 🔥 Hacer funcionar el botón "Abrir"
    document.querySelector(".btn-abrir").onclick = () => abrirCotizacion(id);
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

document.getElementById("modalDetalle").addEventListener("click", e => {
    if (e.target.id === "modalDetalle") cerrarModal();
});


// ============================================================
// 🗑️ ELIMINAR COTIZACIÓN
// ============================================================
function eliminarCotizacion(id) {
    if (!confirm("¿Seguro que deseas eliminar esta cotización?")) return;

    let cotizaciones = JSON.parse(localStorage.getItem("cotizaciones_guardadas")) || [];
    cotizaciones = cotizaciones.filter(c => c.id !== id);

    localStorage.setItem("cotizaciones_guardadas", JSON.stringify(cotizaciones));
    cargarCotizaciones();
}


// ============================================================
// 🔓 ABRIR COTIZACIÓN EN cotizacion.html
// ============================================================
function abrirCotizacion(id) {
    const cot = window.cotizacionesBase.find(c => c.id === id);
    if (!cot) return alert("Error: Cotización no encontrada.");

    localStorage.setItem("cotizacion_a_abrir", JSON.stringify(cot));
    window.location.href = "cotizacion.html";
}



// ============================================================
// 📂 VER COTIZACIONES DE UN CLIENTE (CON CHECKBOX + UNIR)
// ============================================================
function verCotizacionesCliente(key) {

    const grupos = agruparPorCliente(window.cotizacionesBase);
    const grupo = grupos[key];

    const cont = document.getElementById("listaCotizaciones");
    cont.innerHTML = "";

    cont.innerHTML += `
        <button class="btn-volver" onclick="mostrarCotizaciones(window.cotizacionesBase)">
            ← Volver
        </button>

        <h2 style="color:#990f0c; margin-bottom:15px;">
            Cotizaciones de ${grupo.cliente.nombre}
        </h2>

        <button class="btn-ver-cot" onclick="unirCotizacionesCliente('${key}')">
            📄 Unir seleccionadas
        </button>

        <table class="tabla-cotizaciones" style="margin-top:15px;">
            <thead>
                <tr>
                    <th><input type="checkbox" id="chkClienteTodo"></th>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                ${grupo.cotizaciones.map(c => `
                    <tr>
                        <td><input type="checkbox" class="chkCliente" value="${c.id}"></td>
                        <td>${c.id}</td>
                        <td>${c.fecha}</td>
                        <td>$${Number(c.total).toLocaleString("es-CO")}</td>

                        <td>
                            <button class="btn-ver" onclick="verDetalle('${c.id}')">Ver</button>
                            <button class="btn-abrir" onclick="abrirCotizacion('${c.id}')">Abrir</button>
                            <button class="btn-eliminar" onclick="eliminarCotizacion('${c.id}')">Eliminar</button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;

    // marcar/desmarcar todos
    document.getElementById("chkClienteTodo").addEventListener("change", (e) => {
        const estado = e.target.checked;
        document.querySelectorAll(".chkCliente").forEach(chk => chk.checked = estado);
    });
}

function unirCotizacionesCliente(key) {
    const cotizaciones = window.cotizacionesBase.filter(c => c.cliente.id === key);
    const idsSeleccionados = document.querySelectorAll(".chkCliente:checked").map(chk => chk.value);

    if (idsSeleccionados.length === 0) return alert("Debe seleccionar al menos una cotización.");

    const cotizacionesSeleccionadas = cotizaciones.filter(c => idsSeleccionados.includes(c.id));

    const cotizacionUnida = {
        id: "UNIDOS_" + Date.now(),
        cliente: cotizacionesSeleccionadas[0].cliente,
        fecha: new Date().toISOString().split("T")[0],
        items: [],
        total: 0,
        estado: "pendiente",
    };

    cotizacionesSeleccionadas.forEach(c => {
        cotizacionUnida.items.push(...c.items);
        cotizacionUnida.total += Number(c.total);
    });

    cotizacionUnida.items = cotizacionUnida.items.map((item, index) => ({
        ...item,
        id: "UNIDOS_" + index,
    }));

    window.cotizacionesBase.push(cotizacionUnida);
    localStorage.setItem("cotizaciones_guardadas", JSON.stringify(window.cotizacionesBase));
    mostrarCotizaciones(window.cotizacionesBase);
}
// ============================================================
// 🔄 UNIR COTIZACIONES SELECCIONADAS DE UN CLIENTE
// ============================================================
function unirCotizacionesCliente(key) {

    const seleccionados = [...document.querySelectorAll(".chkCliente:checked")]
        .map(chk => chk.value);

    if (seleccionados.length === 0) {
        alert("Selecciona al menos 1 cotización.");
        return;
    }

    const grupos = agruparPorCliente(window.cotizacionesBase);
    const grupo = grupos[key];

    const cotizaciones = grupo.cotizaciones.filter(c => seleccionados.includes(c.id));

    // Unir items
    let itemsCombinados = [];
    cotizaciones.forEach(c => itemsCombinados = itemsCombinados.concat(c.items));

    // Crear cotización combinada
    const cotCombinada = {
        id: "COMBO-" + Date.now(),
        fecha: new Date().toLocaleString("es-CO"),
        cliente: grupo.cliente,
        items: itemsCombinados
    };

    // Guardar en localStorage para abrir en cotizacion.html
    localStorage.setItem("cotizacion_combinada", JSON.stringify(cotCombinada));

    // Redirigir
    window.location.href = "cotizacion.html";
}

