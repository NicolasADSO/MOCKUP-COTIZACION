// ============================================================
// 🧭 SIDEBAR GADIER — Generación + Colapsable
// ============================================================

(function () {
  const sidebarHTML = `
    <div class="logo-area">
        <img src="./assets/img/logo-blanco-sin-fondo.png" alt="Gadier" class="sidebar-logo">
    </div>
    <nav class="sidebar-menu">
        <a href="cotizacion.html" class="sidebar-link">
            <span class="icon">📂</span>
            <span class="text">Cotizador</span>
        </a>
        <a href="historial.html" class="sidebar-link">
            <span class="icon">📜</span>
            <span class="text">Historial</span>
        </a>
        <!--
        <a href="clientes.html" class="sidebar-link">
            <span class="icon">👥</span>
            <span class="text">Clientes</span>
        </a>
        -->
        <a href="usuarios.html" class="sidebar-link admin-only" style="display:none">
            <span class="icon">🔐</span>
            <span class="text">Usuarios</span>
        </a>
    </nav>
    <div class="sidebar-footer">
        <button id="btnLogout" class="sidebar-link btn-logout">
            <span class="icon">🚪</span>
            <span class="text">Salir</span>
        </button>
    </div>
  `;

  function _init() {
    const sidebar = document.getElementById("sidebar");
    const main = document.querySelector(".main-content");

    if (!sidebar || !main) return false;

    // 1️⃣ INYECTAR HTML (Si está vacío)
    if (sidebar.innerHTML.trim() === "") {
      sidebar.className = "sidebar"; // Asegurar clase base
      sidebar.innerHTML = sidebarHTML;
    }

    // 2️⃣ LOGICA ADMIN
    const rol = localStorage.getItem("usuario_rol");
    if (rol === 'admin') {
      const adminLinks = sidebar.querySelectorAll(".admin-only");
      adminLinks.forEach(link => link.style.display = "flex");
    }

    // 3️⃣ COLLAPSE LOGIC
    main.classList.add("collapsed");

    sidebar.addEventListener("mouseenter", () => {
      sidebar.classList.remove("collapsed");
      main.classList.remove("collapsed");
    });

    sidebar.addEventListener("mouseleave", () => {
      sidebar.classList.add("collapsed");
      main.classList.add("collapsed");
    });

    // 4️⃣ ACTIVE LINK
    const current = window.location.pathname.split("/").pop();
    sidebar.querySelectorAll(".sidebar-link").forEach(link => {
      if (link.getAttribute("href") === current) {
        link.classList.add("active");
      }
    });

    // 5️⃣ LOGOUT logic (Replaces old auth.js listener if needed, or keeps as fallback)
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
      btnLogout.onclick = () => {
        // Se asume que auth.js maneja el modal, o podemos hacerlo aquí directo
        // Disparar evento personalizado para que auth.js lo capture
        const event = new Event('logoutRequest');
        document.dispatchEvent(event);

        // Fallback si auth.js no escucha
        if (!window.logoutListenerExists) {
          if (confirm("¿Cerrar sesión?")) {
            localStorage.removeItem("usuario_logueado");
            localStorage.removeItem("usuario_rol");
            localStorage.removeItem("usuario_nombre");
            window.location.href = "login.html";
          }
        }
      };
    }

    return true;
  }

  window.initSidebar = function initSidebar() {
    if (_init()) return;
    let tries = 0;
    const iv = setInterval(() => {
      tries++;
      if (_init() || tries > 20) clearInterval(iv);
    }, 100);
  };

  if (document.readyState !== "loading") window.initSidebar();
  else document.addEventListener("DOMContentLoaded", window.initSidebar);
})();
