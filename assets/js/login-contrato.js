document.addEventListener("DOMContentLoaded", () => {

  const usuario = document.getElementById("usuario");
  const password = document.getElementById("password");
  const btn = document.getElementById("btnLogin");
  const msg = document.getElementById("msg");

  const pantallaCarga = document.getElementById("pantallaCarga");
  const barra = document.getElementById("barraCarga");

  // 🔥 Al cargar login, SIEMPRE ocultar pantalla de carga
  if (pantallaCarga) pantallaCarga.style.display = "none";
  if (barra) barra.style.width = "0%";


  btn.addEventListener("click", () => {

    if (!usuario.value.trim() || !password.value.trim()) {
      msg.textContent = "⚠ Debes completar todos los campos.";
      return;
    }

    msg.textContent = "";

    // Guardar sesión
    localStorage.setItem("usuario_logueado", "true");

    // Mostrar pantalla de carga
    pantallaCarga.style.display = "flex";
    setTimeout(() => { barra.style.width = "100%"; }, 60);

    // Redirigir después de animación
    setTimeout(() => {
      window.location.href = "cotizacion.html";
    }, 2000);
  });
});
