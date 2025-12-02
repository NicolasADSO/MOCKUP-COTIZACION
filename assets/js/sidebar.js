// ============================================================
// 🧭 SIDEBAR GADIER — Colapsable automático con hover real
// ============================================================

(function () {
  function _init() {
    const sidebar = document.querySelector(".sidebar");
    const main = document.querySelector(".main-content");

    if (!sidebar || !main) return false;

    // =============================
    // 1️⃣ Sidebar inicia colapsado
    // =============================
    main.classList.add("collapsed");

    sidebar.addEventListener("mouseenter", () => {
      sidebar.classList.remove("collapsed");
      main.classList.remove("collapsed");
    });

    sidebar.addEventListener("mouseleave", () => {
      sidebar.classList.add("collapsed");
      main.classList.add("collapsed");
    });

    // =============================
    // 4️⃣ Activar enlace actual
    // =============================
    const current = window.location.pathname.split("/").pop();
    document.querySelectorAll(".sidebar-link").forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === current);
    });

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
document.addEventListener("DOMContentLoaded", () => {

    const btnLogout = document.querySelector(".logout-btn");

    if (btnLogout) {
        btnLogout.addEventListener("click", (e) => {
            e.preventDefault();

            if (!confirm("¿Deseas cerrar sesión?")) return;

            localStorage.removeItem("usuario_logueado");

            window.location.href = "login.html";
        });
    }

});

