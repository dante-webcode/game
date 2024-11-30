const contenedorJuego = document.getElementById("contenedorJuego")

function dibujarDesdeJson(item) {
    const elementoCreado = document.createElement(item.elemento)
    const contenedor = document.getElementById(item.contenedor)
    console.log(contenedor)
    elementoCreado.setAttribute("id", item.id)
    elementoCreado.classList.add(item.id)
    switch (item.elemento) {
        case "label":
            elementoCreado.setAttribute("for", item.id)
            elementoCreado.innerText = item.titulo
            break
        case "input":
            elementoCreado.setAttribute("type", item.tipo)
            if (item.tipo == "range") {
                elementoCreado.setAttribute("min", item.min)
                elementoCreado.setAttribute("max", item.max)
                elementoCreado.setAttribute("step", item.step)
                elementoCreado.setAttribute("value", item.min)
            }
            break
    }
    contenedor.appendChild(elementoCreado)
}

function infoConfig() {
    document.getElementById("infoFilas").value = rangoFilas.value
    document.getElementById("infoColumnas").value = rangoColumnas.value
}

async function fetchJson(ruta) {
    const respuesta = await fetch(ruta)
    const datos = await respuesta.json()
    return datos
}

async function crearVista() {
    const datos = await fetchJson("/juegos/buscaminas/planos/plano.json")
    datos.forEach(item => {
        dibujarDesdeJson(item)
    })
    infoConfig()
}

function rellenarTablero() {
    if (!document.getElementById("tablero")) {
        dibujarDesdeJson({ "contenedor": "tablero", "elemento": "ul", "id": "ulTablero" })
    }
}


const estilos = document.createElement("style")
estilos.textContent += `
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        list-style: none;
    }
    .contenedorJuego {
        width: 70%;
        height: 90%;
        border: 1px solid red;
        padding: 20px;
        display: grid;
        grid-template-columns: 1fr 10fr;
        grid-template-rows: 1fr 12fr;
        grid-template-areas:    "configuracion marcadores"
                                "configuracion tablero";
        .marcadores {
            grid-area: marcadores;
            width: 100%;
            height: 100%;
            border: 1px solid grey;
        }
        .configuracion {
            grid-area: configuracion;
            width: 100%;
            height: 100%;
            border: 1px solid grey;
            padding: 20px;

            .formConfig {
                width: 100%;
                height: 100%;

                .infoFilas, .infoColumnas {
                    width: 100%;
                    border: 1px solid blue;
                }
            }
        }
        .tablero {
            grid-area: tablero;
            width: 100%;
            height: 100%;
            border: 1px solid grey;
            display: flex;
        }
    }`
document.head.appendChild(estilos)
// eventos
document.addEventListener("DOMContentLoaded", async () => {
    await crearVista()
    console.log(document.getElementById("tablero"))
    const rangoFilas = document.getElementById("rangoFilas")
    const rangoColumnas = document.getElementById("rangoColumnas")
    rangoFilas.addEventListener("input", () => {
        infoConfig()
    })
    rangoColumnas.addEventListener("input", () => {
        infoConfig()
    })

    rangoFilas.addEventListener("change", () => {
        rellenarTablero()
    })
    rangoColumnas.addEventListener("change", () => {
        rellenarTablero()
    })
})
