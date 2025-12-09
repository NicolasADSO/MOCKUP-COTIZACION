document.addEventListener("DOMContentLoaded", () => {

  const password = document.getElementById("password");
  const rolSelect = document.getElementById("rolUsuario"); // SELECT REAL OCULTO
  const btn = document.getElementById("btnLogin");
  const msg = document.getElementById("msg");

  const pantallaCarga = document.getElementById("pantallaCarga");
  const barra = document.getElementById("barraCarga");

  // ============================================================
  // 🔥 Inicial: ocultar pantalla de carga siempre
  // ============================================================
  if (pantallaCarga) pantallaCarga.style.display = "none";
  if (barra) barra.style.width = "0%";


  // ============================================================
  // 🔐 Contraseñas por rol (temporales)
  // ============================================================
  const clavesPorRol = {
    admin: "admin123",
    cotizador: "cotiza2025",
    soporte: "soporte2025",
    tecnica: "tecnica2025"
  };


  // ============================================================
  // 🎨 LÓGICA DEL SELECT CUSTOM
  // ============================================================
  const customSelect = document.getElementById("customSelect");
  const customOptions = document.getElementById("customOptions");
  const customSelectText = document.getElementById("customSelectText");

  // Abrir/cerrar lista
  customSelect.addEventListener("click", () => {
    customSelect.classList.toggle("open");
    customOptions.classList.toggle("show");
  });

  // Selección de opciones
  customOptions.querySelectorAll("li").forEach(opt => {
    opt.addEventListener("click", () => {

      // Texto visible
      customSelectText.textContent = opt.textContent;

      // Actualizar SELECT REAL (importante para el login)
      rolSelect.value = opt.dataset.value;

      // Marcar seleccionado
      customOptions.querySelectorAll("li").forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");

      // Cerrar
      customOptions.classList.remove("show");
      customSelect.classList.remove("open");
    });
  });

  // Cerrar al hacer clic afuera
  document.addEventListener("click", (e) => {
    if (!customSelect.contains(e.target) && !customOptions.contains(e.target)) {
      customOptions.classList.remove("show");
      customSelect.classList.remove("open");
    }
  });


  // ============================================================
  // 🔓 LÓGICA DEL LOGIN
  // ============================================================
  btn.addEventListener("click", () => {

    const rolElegido = rolSelect.value; // AHORA YA TIENE EL VALOR DEL CUSTOM SELECT

    // Validar rol
    if (!rolElegido) {
      msg.textContent = "⚠ Debes seleccionar un rol.";
      return;
    }

    // Validar contraseña
    if (!password.value.trim()) {
      msg.textContent = "⚠ Debes ingresar la contraseña.";
      return;
    }

    // Validar contraseña incorrecta
    if (password.value !== clavesPorRol[rolElegido]) {
      msg.textContent = "❌ Contraseña incorrecta para este rol.";
      return;
    }

    // Login válido
    msg.textContent = "";

    // Guardar sesión
    const usuarioActivo = { rol: rolElegido };
    localStorage.setItem("usuario_activo", JSON.stringify(usuarioActivo));
    localStorage.setItem("usuario_logueado", "true");

    // Mostrar pantalla de carga
    pantallaCarga.style.display = "flex";
    setTimeout(() => { barra.style.width = "100%"; }, 60);

    // Redirigir
    setTimeout(() => {
      window.location.href = "cotizacion.html";
    }, 2000);
  });

  // ============================================================
  // 👁️ VER CONTRASEÑA
  // ============================================================
  const togglePassword = document.getElementById("togglePassword");
  if (togglePassword) {
    togglePassword.addEventListener("click", () => {
      const tipo = password.getAttribute("type") === "password" ? "text" : "password";
      password.setAttribute("type", tipo);

      // Cambiar icono
      togglePassword.classList.toggle("fa-eye");
      togglePassword.classList.toggle("fa-eye-slash");
    });
  }

});
