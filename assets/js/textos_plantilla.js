document.addEventListener("DOMContentLoaded", () => {
    // 1. Obtener datos originales y locales
    const plantillasOriginales = window.plantillasProcesos;
    let plantillasEditadas = JSON.parse(localStorage.getItem("plantillasEditadas")) || {};

    // 2. Elementos del DOM
    const listaProcesos = document.getElementById("listaProcesos");
    const editorForm = document.getElementById("editorForm");
    const emptyState = document.getElementById("emptyState");
    const tituloProceso = document.getElementById("tituloProcesoSeleccionado");
    const txtDescripcion = document.getElementById("txtDescripcion");
    const containerSubprocesos = document.getElementById("containerSubprocesos");
    const containerBeneficios = document.getElementById("containerBeneficios");
    const btnGuardar = document.getElementById("btnGuardarCambios");
    const btnRestaurar = document.getElementById("btnRestaurarProceso");
    const btnRestaurarTodo = document.getElementById("btnRestaurarTodo");

    let procesoActualKey = null;

    // 3. Renderizar Lista de Procesos
    function renderLista() {
        listaProcesos.innerHTML = "";
        Object.keys(plantillasOriginales).forEach(key => {
            const li = document.createElement("li");
            li.className = "process-item";

            // Indicador de "Editado" si existe en localStorage
            const isEdited = plantillasEditadas.hasOwnProperty(key);
            li.innerHTML = `${key} ${isEdited ? '✏️' : ''}`;

            li.onclick = () => cargarProceso(key, li);
            listaProcesos.appendChild(li);
        });
    }

    // 4. Cargar datos de un proceso en el formulario
    function cargarProceso(key, elementoLi) {
        procesoActualKey = key;

        // UI Active State
        document.querySelectorAll(".process-item").forEach(el => el.classList.remove("active"));
        elementoLi.classList.add("active");

        emptyState.style.display = "none";
        editorForm.style.display = "block";
        tituloProceso.textContent = key;

        // Determinar fuente de datos (Editada vs Original)
        const data = plantillasEditadas[key] || plantillasOriginales[key];

        // Llenar campos
        txtDescripcion.value = (data.descripcion || "").trim();

        // Render Subprocesos
        containerSubprocesos.innerHTML = "";
        const subprocesos = data.subprocesos || {};

        // Convertir objeto a items editables
        Object.entries(subprocesos).forEach(([nombre, desc]) => {
            agregarItemSubproceso(nombre, desc);
        });

        // Render Beneficios
        containerBeneficios.innerHTML = "";
        const beneficios = data.beneficios || [];
        beneficios.forEach(b => {
            agregarItemBeneficio(b);
        });
    }

    // 5. Helpers para agregar items dinámicos
    function agregarItemSubproceso(nombre = "", descripcion = "") {
        const div = document.createElement("div");
        div.className = "dynamic-item";
        div.innerHTML = `
        <div class="inputs-col">
          <input type="text" placeholder="Nombre del Subproceso" value="${nombre}">
          <textarea placeholder="Descripción detallada">${descripcion}</textarea>
        </div>
        <button class="btn-remove" onclick="this.parentElement.remove()">🗑️</button>
      `;
        containerSubprocesos.appendChild(div);
    }

    function agregarItemBeneficio(texto = "") {
        const div = document.createElement("div");
        div.className = "dynamic-item";
        div.innerHTML = `
        <div class="inputs-col">
          <input type="text" placeholder="Beneficio clave" value="${texto}">
        </div>
        <button class="btn-remove" onclick="this.parentElement.remove()">🗑️</button>
      `;
        containerBeneficios.appendChild(div);
    }

    // 6. Listeners para botones de agregar
    document.getElementById("btnAddSubproceso").onclick = () => agregarItemSubproceso();
    document.getElementById("btnAddBeneficio").onclick = () => agregarItemBeneficio();

    // 7. Guardar Cambios
    btnGuardar.onclick = () => {
        if (!procesoActualKey) return;

        // Recolectar datos del formulario
        const nuevaDescripcion = txtDescripcion.value;

        // Subprocesos: reconstruir objeto
        const nuevosSubprocesos = {};
        containerSubprocesos.querySelectorAll(".dynamic-item").forEach(item => {
            const inputs = item.querySelectorAll("input, textarea");
            const nombre = inputs[0].value.trim();
            const desc = inputs[1].value.trim();
            if (nombre) {
                nuevosSubprocesos[nombre] = desc;
            }
        });

        // Beneficios: reconstruir array
        const nuevosBeneficios = [];
        containerBeneficios.querySelectorAll(".dynamic-item input").forEach(input => {
            if (input.value.trim()) {
                nuevosBeneficios.push(input.value.trim());
            }
        });

        // Guardar en objeto local y persistir
        plantillasEditadas[procesoActualKey] = {
            ...plantillasOriginales[procesoActualKey], // mantener propiedades no editables si las hubiera
            descripcion: nuevaDescripcion,
            subprocesos: nuevosSubprocesos,
            beneficios: nuevosBeneficios
        };

        localStorage.setItem("plantillasEditadas", JSON.stringify(plantillasEditadas));

        alert("✅ Cambios guardados correctamente.");
        renderLista();

        // Mantener activo el actual para seguir editando si se quiere
        const items = document.querySelectorAll(".process-item");
        items.forEach(i => {
            if (i.textContent.includes(procesoActualKey)) i.click();
        });
    };

    // 8. Restaurar Individual
    btnRestaurar.onclick = () => {
        if (confirm(`¿Restaurar "${procesoActualKey}" a su contenido original?`)) {
            delete plantillasEditadas[procesoActualKey];
            localStorage.setItem("plantillasEditadas", JSON.stringify(plantillasEditadas));
            alert("Restaurado.");
            renderLista();
            // Recargar vista
            const items = document.querySelectorAll(".process-item");
            items.forEach(i => {
                if (i.textContent.includes(procesoActualKey)) i.click();
            });
        }
    };

    // 9. Restaurar Todo
    btnRestaurarTodo.onclick = () => {
        if (confirm("¿Estás seguro de BORRAR TODAS las ediciones y volver a las plantillas originales?")) {
            plantillasEditadas = {};
            localStorage.setItem("plantillasEditadas", JSON.stringify(plantillasEditadas));
            alert("Todo restaurado.");
            renderLista();
            editorForm.style.display = "none";
            emptyState.style.display = "flex";
        }
    };

    // Inicializar
    renderLista();
});

