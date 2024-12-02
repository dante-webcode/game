const contenedorJuego = document.getElementById("contenedorJuego")

function crearElemento(item) {
    const elementoCreado = document.createElement(item.elemento)
    // class: para no repetir como parametro se recoge del id si clase no existe
    if (item.id) {
        elementoCreado.classList.add(item.class ? item.class : item.id)
    }
    if (item.texto) { elementoCreado.innerText = item.texto }
    // parametros a excluir de asignacion de atributos
    const noIterar = ["descripcion", "contenedor", "elemento", "texto"]
    for (const key in item) {
        if (!noIterar.includes(key)) {
            elementoCreado.setAttribute(key, item[key])
        }
    }
    const contenedor = typeof item.contenedor === "string"
        ? document.getElementById(item.contenedor)
        : item.contenedor
    contenedor.appendChild(elementoCreado)
    return elementoCreado
}

function infoConfig() {
    const alto = document.getElementById("rangoFilas").value
    infoFilas.innerText = alto
    const ancho = document.getElementById("rangoColumnas").value
    infoColumnas.innerText = ancho
    return [alto, ancho]
}

function infoMarcadores() {
    const casillasTotal = infoConfig()
    document.getElementById("total").innerText = casillasTotal[0] * casillasTotal[1]
    document.getElementById("cerradas").innerText = 0
    document.getElementById("abiertas").innerText = 0
}

async function fetchJson(ruta) {
    const respuesta = await fetch(ruta)
    const datos = await respuesta.json()
    return datos
}

async function crearVista() {
    const datos = await fetchJson("/juegos/buscaminas/planos/plano.json")
    datos.forEach(item => {
        crearElemento(item)
    })
}

function crearMarcadores() {
    const marcadores = ["Total", "Cerradas", "Abiertas"]
    let arrayMarcadores = []
    marcadores.forEach(item => {
        crearElemento({
            "contenedor": "marcadores",
            "elemento": "div",
            "id": "contenedor" + item,
            "class": "contenedorMarcador"
        })
        crearElemento({
            "contenedor": "contenedor" + item,
            "elemento": "span",
            "class": "marcador",
            "texto": item
        })
        const marcador = crearElemento({
            "contenedor": "contenedor" + item,
            "elemento": "span",
            "id": item.toLowerCase(),
            "class": "valorMarcador"
        })
        arrayMarcadores.push(marcador)
    })
    return arrayMarcadores
}

function crearTablero(par) {
    if (!document.getElementById("tablero")) {
        const tablero = crearElemento({
            "contenedor": "contenedorTablero",
            "elemento": "div",
            "id": "tablero"
        })
    }
    tablero.innerHTML = ""
    let contadorCeldas = 0
    for (let contadorFilas = 0; contadorFilas < par[0]; contadorFilas++) {
        const nuevaFila = crearElemento({
            "contenedor": "tablero",
            "elemento": "ul",
            "id": "fila" + `${contadorFilas}`,
            "class": "fila"
        })
        for (let contadorColumna = 0; contadorColumna < par[1]; contadorColumna++) {
            const celda = {
                "contenedor": nuevaFila,
                "elemento": "li",
                "id": "celda" + `${contadorCeldas}`,
                "class": "celda",
                "data-fila": contadorFilas,
                "data-columna": contadorColumna
            }
            const nuevaCelda = crearElemento(celda)
            const casilla = {
                "contenedor": nuevaCelda,
                "elemento": "span",
                "id": "casilla" + `${contadorCeldas}`,
                "class": "casilla"
            }
            crearElemento(casilla)
            contadorCeldas += 1
        }
    }
    return contadorCeldas
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
        width: 73%;
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
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            height: 100%;
            border: 1px solid grey;

            .contenedorMarcador {
                display: flex;
                align-items: center;
                justify-content: space-around;
                width: calc(100%/4);
                height: 70%;
                border: 1px solid red;

                .marcador {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40%;
                    height: 80%;
                    border: 1px solid grey;
                }

                .valorMarcador {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40%;
                    height: 80%;
                    border: 1px solid grey;
                }
            }
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

                label {
                    display: flex;
                    flex-direction: column;

                    span {
                        width: 100%;
                        height: 20px;
                        border: 1px solid red;
                    }
                }   
            }
        }

        .contenedorTablero {
            overflow: auto;
            border: 1px solid grey;
            display: flex;
            justify-content: top;
            padding: .6vh;

            .tablero {
                grid-area: tablero;
                width: 100%;

                .fila {
                    display: flex;
                    width: 100%;

                    .celda {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                        aspect-ratio: 1/1;
                        padding: .1vw;

                        .casilla {
                            width: 100%;
                            height: 100%;
                            border: 1px solid grey;
                        }
                    }
                }
            }
        }
    }`
document.head.appendChild(estilos)
// eventos
document.addEventListener("DOMContentLoaded", async () => {
    await crearVista()
    crearTablero(infoConfig())
    crearMarcadores()
    infoMarcadores()
    const rangoFilas = document.getElementById("rangoFilas")
    const rangoColumnas = document.getElementById("rangoColumnas")

    rangoFilas.addEventListener("input", () => {
        infoMarcadores()
    })
    rangoColumnas.addEventListener("input", () => {
        infoMarcadores()
    })

    rangoFilas.addEventListener("change", () => {
        crearTablero(infoConfig())
    })
    rangoColumnas.addEventListener("change", () => {
        crearTablero(infoConfig())
    })
})
