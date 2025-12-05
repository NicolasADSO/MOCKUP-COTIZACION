// assets/js/usuarios.js

document.addEventListener("DOMContentLoaded", () => {
    verificarAdmin(); // Seguridad Frontend
    cargarUsuarios();

    // Event Listeners Forms
    document.getElementById("formCrear").onsubmit = crearUsuario;
    document.getElementById("formReset").onsubmit = resetPassword;
});

function verificarAdmin() {
    const rol = localStorage.getItem("usuario_rol");
    if (rol !== 'admin') {
        alert("Acceso denegado. Solo administradores pueden ver esto.");
        window.location.href = 'cotizacion.html';
    }
}

async function cargarUsuarios() {
    try {
        const res = await fetch('api/usuarios/index.php');
        const data = await res.json();

        if (!data.success) {
            console.error(data.message);
            return;
        }

        const tbody = document.getElementById("tbodyUsuarios");
        tbody.innerHTML = "";

        data.data.forEach(user => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${user.nombre}</td>
                <td>${user.email}</td>
                <td><span style="background:#333; padding:2px 6px; border-radius:4px; font-size:0.85rem;">${user.rol}</span></td>
                <td>${user.estado == 1 ? '🟢 Activo' : '🔴 Inactivo'}</td>
                <td>
                    <button class="btn-action btn-edit" onclick="abrirModalReset(${user.id}, '${user.nombre}')">🔑 Clave</button>
                    ${user.estado == 1 ?
                    `<button class="btn-action btn-delete" onclick="eliminarUsuario(${user.id}, '${user.nombre}')">🗑️ Borrar</button>` :
                    `<button class="btn-action" style="color:lightgreen" onclick="eliminarUsuario(${user.id}, '${user.nombre}')">♻️ Activar</button>`
                }
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (e) {
        console.error("Error cargando usuarios:", e);
    }
}

// =======================
// CREAR
// =======================
function abrirModalCrear() {
    document.getElementById("modalCrear").style.display = "flex";
}

async function crearUsuario(e) {
    e.preventDefault();

    const payload = {
        nombre: document.getElementById("nombreNew").value,
        email: document.getElementById("emailNew").value,
        rol: document.getElementById("rolNew").value,
        password: document.getElementById("passNew").value
    };

    try {
        const res = await fetch('api/usuarios/create.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.success) {
            alert("✅ Usuario creado correctamente");
            cerrarModales();
            cargarUsuarios();
            e.target.reset();
        } else {
            alert("❌ Error: " + data.message);
        }
    } catch (err) {
        alert("Error de conexión");
    }
}

// =======================
// RESET PASSWORD
// =======================
function abrirModalReset(id, nombre) {
    document.getElementById("idReset").value = id;
    document.getElementById("userResetName").innerText = "Usuario: " + nombre;
    document.getElementById("passReset").value = "";
    document.getElementById("modalReset").style.display = "flex";
}

async function resetPassword(e) {
    e.preventDefault();
    const id = document.getElementById("idReset").value;
    const password = document.getElementById("passReset").value;

    try {
        const res = await fetch('api/usuarios/reset_pass.php', {
            method: 'POST',
            body: JSON.stringify({ id, password })
        });
        const data = await res.json();

        if (data.success) {
            alert("✅ Contraseña actualizada");
            cerrarModales();
        } else {
            alert("❌ Error: " + data.message);
        }
    } catch (err) {
        alert("Error de conexión");
    }
}

// =======================
// ELIMINAR / ACTIVAR
// =======================
async function eliminarUsuario(id, nombre) {
    if (!confirm(`¿Seguro que deseas eliminar/activar a ${nombre}?`)) return;

    try {
        const res = await fetch('api/usuarios/delete.php', {
            method: 'POST',
            body: JSON.stringify({ id })
        });
        const data = await res.json();

        if (data.success) {
            alert(data.message);
            cargarUsuarios();
        } else {
            alert("❌ " + data.message);
        }
    } catch (err) {
        alert("Error de conexión");
    }
}

// =======================
// UTIL
// =======================
function cerrarModales() {
    document.querySelectorAll(".modal-overlay").forEach(m => m.style.display = "none");
}
window.cerrarModales = cerrarModales;
