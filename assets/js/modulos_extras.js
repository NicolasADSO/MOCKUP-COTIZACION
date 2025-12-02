// ============================================================
// 🔧 MÓDULOS EXTRA — SUMINISTROS, EQUIPOS Y FUNCIONARIOS
// Versión final corporativa Gadier Sistemas
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // ============================================================
    // 📦 SUMINISTROS
    // ============================================================
    const selectSuministro = document.getElementById("selectSuministro");
    const cantidadSuministro = document.getElementById("cantidadSuministro");
    const valorSuministro = document.getElementById("valorSuministro");
    const btnAgregarSuministro = document.getElementById("btnAgregarSuministro");

    if (selectSuministro) {
        fetch("data/suministros.json")
            .then(res => res.json())
            .then(data => {

                data.forEach(item => {
                    const opt = document.createElement("option");
                    opt.value = item.nombre;
                    opt.textContent = item.nombre;
                    opt.dataset.precio = item.precio || 0;
                    selectSuministro.appendChild(opt);
                });

                selectSuministro.addEventListener("change", e => {
                    const precio = Number(e.target.selectedOptions[0]?.dataset.precio || 0);
                    valorSuministro.value = precio ? `COP ${precio.toLocaleString()}` : "";
                    valorSuministro.dataset.real = precio;
                });

            });
    }

    if (btnAgregarSuministro) {
        btnAgregarSuministro.addEventListener("click", () => {

            const nombre = selectSuministro.value;
            const cantidad = Number(cantidadSuministro.value);
            const precio = Number(valorSuministro.dataset.real || 0);

            if (!nombre || cantidad <= 0 || precio <= 0) {
                return alert("⚠️ Complete correctamente todos los campos de Suministros.");
            }

            window.agregarOActualizarResumen({
                area: "Suministros",
                proceso: nombre,
                cantidad,
                valor: precio,
                costo: cantidad * precio
            });

            if (typeof window.renderTabla === "function") window.renderTabla();

            cantidadSuministro.value = "";
            valorSuministro.value = "";
            valorSuministro.dataset.real = "";
            selectSuministro.value = "";
        });
    }


    // ============================================================
    // ⚙️ EQUIPOS
    // ============================================================
    const selectEquipo = document.getElementById("selectEquipo");
    const cantidadEquipo = document.getElementById("cantidadEquipo");
    const valorEquipo = document.getElementById("valorEquipo");
    const btnAgregarEquipo = document.getElementById("btnAgregarEquipo");

    if (selectEquipo) {
        fetch("data/equipos.json")
            .then(res => res.json())
            .then(data => {

                data.forEach(eq => {
                    const opt = document.createElement("option");

                    // Mostrar nombre — denominación
                    opt.value = `${eq.nombre} — ${eq.denominacion}`;
                    opt.textContent = `${eq.nombre} — ${eq.denominacion}`;

                    // Guardar precio y datos adicionales
                    opt.dataset.precio = eq.precio || 0;
                    opt.dataset.nombre = eq.nombre;
                    opt.dataset.denominacion = eq.denominacion;

                    selectEquipo.appendChild(opt);
                });


                selectEquipo.addEventListener("change", e => {
                    const precio = Number(e.target.selectedOptions[0]?.dataset.precio || 0);
                    valorEquipo.value = precio ? `COP ${precio.toLocaleString()}` : "";
                    valorEquipo.dataset.real = precio;
                });

            });
    }

    if (btnAgregarEquipo) {
        btnAgregarEquipo.addEventListener("click", () => {

            const nombre = selectEquipo.value;
            const cantidad = Number(cantidadEquipo.value);
            const precio = Number(valorEquipo.dataset.real || 0);

            if (!nombre || cantidad <= 0 || precio <= 0) {
                return alert("⚠️ Complete correctamente todos los campos de Equipos.");
            }

            window.agregarOActualizarResumen({
                area: "Equipos",
                proceso: nombre,
                cantidad,
                valor: precio,
                costo: cantidad * precio
            });

            if (typeof window.renderTabla === "function") window.renderTabla();

            cantidadEquipo.value = "";
            valorEquipo.value = "";
            valorEquipo.dataset.real = "";
            selectEquipo.value = "";
        });
    }

    // ============================================================
    // 👥 FUNCIONARIOS — CARGA DESDE LOCALSTORAGE
    // ============================================================
    const selectFuncionario = document.getElementById("selectFuncionario");
    const valorHoraFuncionario = document.getElementById("valorHoraFuncionario");

    if (selectFuncionario) {

        // Cargar desde LocalStorage inicializado por funcionarios.js
        const funcionariosLS = JSON.parse(localStorage.getItem("funcionarios_data")) || [];

        funcionariosLS.forEach(f => {
            const opt = document.createElement("option");
            opt.value = `${f.tipo} Nivel ${f.nivel}`;
            opt.textContent = `${f.tipo} Nivel ${f.nivel}`;
            opt.dataset.valor = f.pagoHora || 0;
            selectFuncionario.appendChild(opt);
        });

        // Mostrar valor por hora cuando se seleccione
        selectFuncionario.addEventListener("change", (e) => {
            const valor = Number(e.target.selectedOptions[0]?.dataset.valor || 0);
            valorHoraFuncionario.value = valor ? `COP ${valor.toLocaleString()}` : "";
            valorHoraFuncionario.dataset.real = valor;
        });
    }


    // ============================================================
    // 👥 FUNCIONARIOS — PLANIFICACIÓN AUTOMÁTICA DE CARGA
    // ============================================================

    const totalFuncProy = document.getElementById("totalFuncionariosProyecto");
    const diasHabilesProy = document.getElementById("diasHabilesProyecto");
    const btnDistribuir = document.getElementById("btnDistribuirFuncionarios");

    const cantidadFunc = document.getElementById("cantidadFuncionario");
    const horasDiaFunc = document.getElementById("horasDiaFuncionario");
    const diasFunc = document.getElementById("duracionDiasFuncionario");

    if (btnDistribuir) {
        btnDistribuir.addEventListener("click", () => {

            const total = Number(totalFuncProy.value);
            const dias = Number(diasHabilesProy.value);

            if (total <= 0 || dias <= 0) {
                return alert("⚠ Debe ingresar funcionarios y días hábiles válidos.");
            }

            // Obtener cargo seleccionado
            const cargoSeleccionado = selectFuncionario.value || "Funcionario";

            // ============================================================
            // 🔥 DISTRIBUCIÓN DE CARGA
            // ============================================================
            const diasPorFuncionario = Math.ceil(dias / total);

            let horasPorDia = 8;

            if (diasPorFuncionario < dias) {
                horasPorDia = Math.round((dias * 8) / diasPorFuncionario);
                if (horasPorDia > 8) horasPorDia = 8;
                if (horasPorDia < 4) horasPorDia = 4;
            }

           

            // ============================================================
            // 📊 MINI-TABLA DETALLADA
            // ============================================================
            const tabla = document.querySelector("#tablaDistribucion tbody");
            const contenedor = document.getElementById("tablaDistribucionContainer");

            tabla.innerHTML = ""; // limpiar

            for (let i = 1; i <= total; i++) {

                const fila = `
                    <tr>
                        <td style="padding:6px;border:1px solid #ccc;">${cargoSeleccionado} — ${i}</td>

                        <td style="padding:6px;border:1px solid #ccc;text-align:center;">
                            <input class="dias-edit" type="number" value="${diasPorFuncionario}" min="1"
                                style="width:70px;text-align:center;">
                        </td>

                        <td style="padding:6px;border:1px solid #ccc;text-align:center;">
                            <input class="horas-edit" type="number" value="${horasPorDia}" min="1" max="8"
                                style="width:70px;text-align:center;">
                        </td>

                        <!-- 🆕 NUEVA COLUMNA: GASTOS EXTRAS -->
                        <td style="padding:6px;border:1px solid #ccc;text-align:center;">
                            <input class="extras-edit" type="number" value="0" min="0"
                                style="width:90px;text-align:center;">
                        </td>
                    </tr>
                `;


                tabla.insertAdjacentHTML("beforeend", fila);
            }

            contenedor.style.display = "block";

            btnAgregarFuncionarioCot.disabled = false;

            alert("✔ Distribución realizada. La tabla muestra cómo se reparte la carga entre cada funcionario.");
        });
    }


    // ============================================================
    // 👥 FUNCIONARIOS — AGREGAR AL RESUMEN (NUEVO Y CORREGIDO)
    // ============================================================

    const btnAgregarFuncionarioCot = document.getElementById("btnAgregarFuncionarioCot");

    if (btnAgregarFuncionarioCot) {
        btnAgregarFuncionarioCot.addEventListener("click", () => {

        const funcionario = selectFuncionario.value;
        const valorHora = Number(valorHoraFuncionario.dataset.real || 0);

        if (!funcionario) {
            return alert("⚠️ Debe seleccionar un funcionario.");
        }
        if (valorHora <= 0) {
            return alert("⚠️ El funcionario no tiene valor por hora asignado.");
        }

        const filas = document.querySelectorAll("#tablaDistribucion tbody tr");

        if (filas.length === 0) {
            return alert("⚠️ Primero calcule la distribución automática.");
        }

        // 🔥 Recorrer cada funcionario y registrarlo como fila independiente
        filas.forEach((fila, index) => {

            const dias = Number(fila.querySelector(".dias-edit").value);
            const horas = Number(fila.querySelector(".horas-edit").value);
            const extras = Number(fila.querySelector(".extras-edit")?.value || 0);

            // Costo individual
            const costoBase = dias * horas * valorHora;
            const costoTotal = costoBase + extras;

            // Nombre único por funcionario
            const nombreProceso = `${funcionario} — ${index + 1}`;

            window.agregarOActualizarResumen({
                area: "Funcionarios",
                proceso: nombreProceso,
                cantidad: 1,
                dias,
                horas,
                extras,
                valor: valorHora,
                costo: costoTotal
            });

        });

        if (typeof window.renderTabla === "function") window.renderTabla();

        // Limpiar
        document.getElementById("tablaDistribucionContainer").style.display = "none";
        document.querySelector("#tablaDistribucion tbody").innerHTML = "";

        selectFuncionario.value = "";
        valorHoraFuncionario.value = "";
        valorHoraFuncionario.dataset.real = "";

        totalFuncProy.value = "";
        diasHabilesProy.value = "";

    });

    }



});
