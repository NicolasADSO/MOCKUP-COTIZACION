document.addEventListener("DOMContentLoaded", () => {

  // ===============================================
  // 🔐 VALIDAR SESIÓN
  // ===============================================
  const usuario = JSON.parse(localStorage.getItem("usuario_activo"));
  const logueado = localStorage.getItem("usuario_logueado");

  if (!usuario || !logueado) {
    window.location.href = "login.html";
    return;
  }

  const rol = usuario.rol; // admin, cotizador, soporte, tecnica

  // ===============================================
  // 🔥 CONTROL DE ROLES PARA EL SIDEBAR
  // (Se ejecuta cuando el sidebar se haya cargado)
  // ===============================================
  const esperarSidebar = setInterval(() => {
    const items = document.querySelectorAll("#sidebar [data-role]");
    if (items.length === 0) return; // sidebar aún no cargado

    clearInterval(esperarSidebar);

    items.forEach(item => {
      const permitidos = item.dataset.role.split(",");
      if (!permitidos.includes(rol)) {
        item.style.display = "none";
      }
    });
  }, 100);


  // ===============================================
  // 🧱 BLOQUEO POR URL
  // ===============================================
  const pagina = location.pathname.split("/").pop().replace(".html", "");

  const permisos = {
    admin: ["cotizacion", "suministros", "equipos", "funcionarios", "aliados", "cotizaciones_guardadas"],
    cotizador: ["cotizacion", "cotizaciones_guardadas"],
    soporte: ["equipos"],
    tecnica: ["funcionarios"]
  };

  const permitidas = permisos[rol] || [];

  if (!permitidas.includes(pagina)) {
    const destino = permitidas[0] + ".html";
    alert("⚠ No tienes acceso a esta sección.");
    window.location.href = destino;
  }


  // ===============================================
  // 🔴 CONTROLAR LOGOUT (cuando ya esté cargado el sidebar)
  // ===============================================
  const observarLogout = setInterval(() => {
    const btnLogout = document.querySelector(".logout-btn");
    if (!btnLogout) return; // todavía no existe

    clearInterval(observarLogout);

    btnLogout.addEventListener("click", () => {
      document.getElementById("modalLogout").style.display = "flex";
    });

    document.getElementById("btnLogoutCancelar").addEventListener("click", () => {
      document.getElementById("modalLogout").style.display = "none";
    });

    document.getElementById("btnLogoutConfirmar").addEventListener("click", () => {
      localStorage.removeItem("usuario_logueado");
      localStorage.removeItem("usuario_activo");
      window.location.href = "login.html";
    });
  }, 100);

  // ===============================================
  // 👤 MOSTRAR ROL EN EL HEADER (A LA DERECHA)
  // ===============================================
  const header = document.querySelector(".navbar-fija");

  if (header) {
    const badge = document.createElement("span");
    badge.id = "rolUsuarioBadge";

    // Estilos del badge (chip del rol)
    badge.style.cssText = `
        background:#990f0c;
        color:white;
        padding:6px 12px;
        border-radius:6px;
        font-size:14px;
        font-weight:600;
        position:absolute;
        right:20px;
        top:50%;
        transform:translateY(-50%);
    `;

    badge.textContent = `Rol: ${rol.toUpperCase()}`;

    // Asegurarse de que el header permita posición absoluta
    header.style.position = "relative";

    header.appendChild(badge);
  }

});
