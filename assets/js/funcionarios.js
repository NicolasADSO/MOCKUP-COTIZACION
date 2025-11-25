document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Funcionarios JS cargado con valores fijos predefinidos");

  // ============================================================
  // 📋 ESTRUCTURA BASE (VALORES FIJOS POR DEFECTO)
  // ============================================================
  const cargosBase = [
    { tipo: "Coordinador", nivel: 3, pagoHora: 25000 },
    { tipo: "Coordinador", nivel: 2, pagoHora: 20000 },
    { tipo: "Coordinador", nivel: 1, pagoHora: 15000 },
    { tipo: "Líder", nivel: 3, pagoHora: 18000 },
    { tipo: "Líder", nivel: 2, pagoHora: 16000 },
    { tipo: "Líder", nivel: 1, pagoHora: 12000 },
    { tipo: "Analista", nivel: 3, pagoHora: 20000 },
    { tipo: "Analista", nivel: 2, pagoHora: 18000 },
    { tipo: "Analista", nivel: 1, pagoHora: 15000 },
    { tipo: "Auxiliar", nivel: 3, pagoHora: 18000 },
    { tipo: "Auxiliar", nivel: 2, pagoHora: 12000 },
    { tipo: "Auxiliar", nivel: 1, pagoHora: 10000 },
  ];

  // ============================================================
  // 💾 CARGAR O CREAR LOCALSTORAGE AUTOMÁTICAMENTE
  // ============================================================
  let funcionarios = JSON.parse(localStorage.getItem("funcionarios_data")) || [];

  // 🧠 Condición para detectar si está vacío o con valores 0
  const necesitaInicializar =
    funcionarios.length === 0 ||
    funcionarios.every(f => !f.pagoHora || f.pagoHora === 0);

  if (necesitaInicializar) {
    funcionarios = cargosBase;
    localStorage.setItem("funcionarios_data", JSON.stringify(funcionarios));
    console.log("💾 LocalStorage inicializado con valores fijos.");
  } else {
    // Sincroniza cargos que falten
    cargosBase.forEach(base => {
      const existe = funcionarios.find(f => f.tipo === base.tipo && f.nivel === base.nivel);
      if (!existe) funcionarios.push(base);
    });
    localStorage.setItem("funcionarios_data", JSON.stringify(funcionarios));
  }

  const grupos = document.querySelectorAll(".grupo-cargo");

  // ============================================================
  // 🧱 RENDERIZAR ORGANIGRAMA
  // ============================================================
  function renderOrganigrama() {
    grupos.forEach(grupo => {
      const tipo = grupo.dataset.grupo;
      const contenedor = grupo.querySelector(".nivel");
      contenedor.innerHTML = "";

      const lista = funcionarios.filter(f => f.tipo === tipo);
      lista.sort((a, b) => b.nivel - a.nivel);

      lista.forEach(f => {
        const card = document.createElement("div");
        card.classList.add("cargo");
        card.innerHTML = `
          <h3>${f.tipo} Nivel ${f.nivel}</h3>
          <div class="campo-editar">
            <label>Valor por hora ($):</label>
            <input type="number" class="input-pago" 
              data-tipo="${f.tipo}" data-nivel="${f.nivel}"
              value="${f.pagoHora}" min="0" />
          </div>
        `;
        contenedor.appendChild(card);
      });
    });
  }

  renderOrganigrama();

  // ============================================================
  // 💾 GUARDAR AUTOMÁTICAMENTE CAMBIOS EN LOCALSTORAGE
  // ============================================================
  document.addEventListener("input", e => {
    if (e.target.classList.contains("input-pago")) {
      const tipo = e.target.dataset.tipo;
      const nivel = parseInt(e.target.dataset.nivel);
      const valor = parseFloat(e.target.value) || 0;

      const index = funcionarios.findIndex(f => f.tipo === tipo && f.nivel === nivel);
      if (index !== -1) {
        funcionarios[index].pagoHora = valor;
        localStorage.setItem("funcionarios_data", JSON.stringify(funcionarios));
      }
    }
  });

  // ============================================================
  // 🚫 OCULTAR BOTONES DE AGREGAR / ELIMINAR
  // ============================================================
  document.querySelectorAll(".btn-agregar-cargo, .btn-borrar-cargo").forEach(btn => {
    btn.style.display = "none";
  });
});
