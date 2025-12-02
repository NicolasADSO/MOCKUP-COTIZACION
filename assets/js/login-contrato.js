document.addEventListener("DOMContentLoaded", () => {

  const usuario = document.getElementById("usuario");
  const password = document.getElementById("password");
  const rolSelect = document.getElementById("rolUsuario"); // ⬅️ NUEVO
  const btn = document.getElementById("btnLogin");
  const msg = document.getElementById("msg");

  const pantallaCarga = document.getElementById("pantallaCarga");
  const barra = document.getElementById("barraCarga");

  // 🔥 Al cargar login, SIEMPRE ocultar pantalla de carga
  if (pantallaCarga) pantallaCarga.style.display = "none";
  if (barra) barra.style.width = "0%";

  btn.addEventListener("click", () => {

    // 🛑 Validar campos vacíos
    if (!usuario.value.trim() || !password.value.trim()) {
      msg.textContent = "⚠ Debes completar todos los campos.";
      return;
    }

    // 🛑 Validar que seleccione un rol
    if (!rolSelect || !rolSelect.value) {
      msg.textContent = "⚠ Debes seleccionar un rol.";
      return;
    }

    msg.textContent = "";

    const rol = rolSelect.value;

    // 🧠 Guardar sesión (nuevo esquema con rol)
    const usuarioActivo = {
      nombre: usuario.value.trim(),
      rol: rol
    };

    // Para el sistema nuevo:
    localStorage.setItem("usuario_activo", JSON.stringify(usuarioActivo));

    // Para no romper lo anterior:
    localStorage.setItem("usuario_logueado", "true");

    // Mostrar pantalla de carga
    if (pantallaCarga) pantallaCarga.style.display = "flex";
    if (barra) setTimeout(() => { barra.style.width = "100%"; }, 60);

    // Redirigir después de animación
    setTimeout(() => {
      // Por ahora lo dejamos a cotización como tenías
      window.location.href = "cotizacion.html";
    }, 2000);
  });
});
