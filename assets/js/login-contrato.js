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

    // ============================================================
    // 🚀 LOGIN VIA API (PRODUCCIÓN)
    // ============================================================

    // Mapeo temporal de Roles -> Emails (Ya que el login pide Rol, no Email)
    const correoPorRol = {
      admin: "admin@gadier.com",
      cotizador: "cotizador@gadier.com",
      soporte: "soporte@gadier.com",
      tecnica: "tecnica@gadier.com"
    };

    const email = correoPorRol[rolElegido];

    if (!email) {
      msg.textContent = "⚠ Este rol no tiene usuario asignado en DB.";
      return;
    }

    msg.textContent = "⌛ Validando credenciales...";
    btn.disabled = true;

    fetch('api/auth/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password.value
      })
    })
      .then(r => r.json())
      .then(data => {
        btn.disabled = false;

        if (data.success) {
          // ✅ Login Exitoso
          msg.textContent = "";

          // Guardar sesión en LocalStorage (para compatibilidad con resto de la app)
          // Y la sesión PHP ya quedó activa en el servidor (cookie PHPSESSID)
          const usuarioActivo = {
            id: data.usuario.id,
            rol: data.usuario.rol, // Asegurar que coincida con lo esperado
            nombre: data.usuario.nombre
          };

          localStorage.setItem("usuario_activo", JSON.stringify(usuarioActivo));
          localStorage.setItem("usuario_logueado", "true");

          // Mostrar pantalla de carga
          pantallaCarga.style.display = "flex";
          setTimeout(() => { barra.style.width = "100%"; }, 60);

          // Redirigir
          setTimeout(() => {
            window.location.href = "cotizacion.html";
          }, 2000);

        } else {
          // ❌ Login Fallido
          msg.textContent = "❌ " + data.message;
        }
      })
      .catch(err => {
        console.error(err);
        btn.disabled = false;
        msg.textContent = "❌ Error de conexión con el servidor.";
      });

  });

});

