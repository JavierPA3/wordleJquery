const wordle_negocio = (function () {
    const palabras = [
        "sabor", "luzca", "bravo", "moral", "cruce", "grano", "plaza", "fluir", "traje", "creer",
        "jugar", "miedo", "noble", "ocaso", "pudor", "quema", "roble", "sutil", "trote", "unido",
        "volar", "yacer", "zorro", "abrir", "broma", "chico", "dulce", "etapa", "fuego", "golpe",
        "hacer", "ideal", "joven", "kilos", "letra", "mundo", "nacer", "oasis", "poder", "queso",
        "risa", "saber", "tango", "unir", "vivir", "xenon", "yogur", "zarza", "actos", "brisa",
        "campo", "datos", "exito", "flora", "grito", "horno", "icono", "jamon", "karma", "llama",
        "mesa", "nubes", "opera", "piano", "quien", "radio", "salsa", "tarta", "union", "video",
        "winds", "yemas", "zinc", "amigo", "bosco", "celda", "drama", "extra", "fresa", "gusto",
        "hotel", "indio", "jaula","koala", "limon", "mango", "nuevo", "ostra", "pajaro", "quimio",
        "rosas", "soplo", "tulip", "uvula", "virus", "whisky", "yogurt", "zocalo", "acero", "bongo"
    ];
    let palabraRandom = '';
    let intentos = 0;

    // Inicializa la palabra aleatoria
    const init = function () {
        palabraRandom = palabras[Math.floor(Math.random() * palabras.length)];
        mostrarPalabra();
    };

    // Muestra la palabra aleatoria en la consola
    const mostrarPalabra = function () {
        console.log(palabraRandom);
        return palabraRandom;
    };

    // Comprueba las letras ingresadas por el usuario
    const comprobador = function (intento) {
        const restoPalabras = [...palabraRandom];
        console.log(restoPalabras);

        let solucion = ["", "", "", "", ""];

        // Comparación de letras coincidentes en posición y valor
        intento.forEach((letra, index) => {
            if (letra === palabraRandom[index]) {
                solucion[index] = 'v';
                restoPalabras.splice(restoPalabras.indexOf(letra), 1);
            }
        });

        // Comparación de letras en posiciones incorrectas o coincidencias solo en valor
        intento.forEach((letra, index) => {
            if (letra !== palabraRandom[index]) {
                const restoIndex = restoPalabras.indexOf(letra);
                if (restoIndex !== -1) {
                    solucion[index] = 'a';
                    restoPalabras.splice(restoIndex, 1);
                } else {
                    solucion[index] = 'g';
                }
            }
        });

        // Verificar si todas las letras son 'v', lo que significa que el usuario ha ganado
        if (solucion.every(letra => letra === 'v')) {
            console.log('HAS GANADO!!');
        }
        intentos--;
        // Devolver el array de solución ('v', 'a', 'g')
        return solucion;
    };

    return {
        init: init,
        mostrarPalabra: mostrarPalabra,
        comprobador: comprobador,
        intentos: intentos,
    };
})();

$(function () {
    const wordle_vista = (function () {
        let row = 0;
        let palabritaUsuario = [];
        let acumulador = 0;
        const palabraSeleccionada = wordle_negocio.mostrarPalabra();
        let gameEnded = true;

        function createAndAppendElement(elementType, text, parent) {
            const element = $("<" + elementType + ">");
            element.html(text);
            parent.append(element);
            return element;
        }

        function createInterface() {
            createAndAppendElement("h2", "LA PALABRA", $("body"));
            createAndAppendElement("h3", "DEL DÍA", $("body"));

            const wordleListDiv = createAndAppendElement("div", "", $("body"));
            wordleListDiv.addClass("wordle-list");

            for (let j = 0; j < 6; j++) {
                const ulElement = createAndAppendElement("ul", "", wordleListDiv);
                for (let i = 0; i < 5; i++) {
                    const nuevoElemento = createAndAppendElement("input", "", ulElement);
                    nuevoElemento.attr("type", "text");
                    nuevoElemento.attr("maxlength", "1");
                    nuevoElemento.addClass("mi-tablita");
                }
            }
        }

        function createKeyboard() {
            const divTeclado = createAndAppendElement('div', '', $("body"));
            divTeclado.addClass('teclado');

            const teclado = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "ñ", "ENVIAR", "z", "x", "c", "v", "b", "n", "m", "⌫"];

            teclado.forEach((tecla, index) => {
                const unaTecla = createAndAppendElement('button', tecla, divTeclado);
                unaTecla.addClass('mi-tecla');

                if ((index + 1) % 10 === 0) {
                    divTeclado.append($("<br>"));
                }
            });

            $("body").append(divTeclado);
        }

        function createFunctionality() {
            let intentos = 6;
            console.log(gameEnded);
            if (gameEnded) {
            $(document).on("keydown", function (event) {
                if (event.key === "Backspace") {
                    palabritaUsuario.pop();
                    const uls = $("ul");
                    uls.eq(row).children().eq(palabritaUsuario.length).val("");
                }
            });
            $(document).on("click", function (event) {
                if ($(event.target).prop("tagName") !== "BUTTON") return;

                const targetText = $(event.target).html();
                const uls = $("ul");

                if (targetText === "⌫") {
                    palabritaUsuario.pop();
                    uls.eq(row).children().eq(palabritaUsuario.length).val("");
                } else if (targetText === "ENVIAR" && palabritaUsuario.length === 5) {
                    let letrasCorrectas = [];
                    palabritaUsuario.forEach((letra, index) => {
                        console.log(letra);
                        letrasCorrectas.push(letra);
                    });

                    let savedGuesses = wordle_negocio.comprobador(letrasCorrectas);
                    let cont = 0;
                    savedGuesses.forEach((letra, index) => {
                        const inputElement = uls.eq(row).children().eq(index);
                        console.log('row:', row, 'index:', index, 'letra:', letra);
                        console.log(row);
                        if (letra === 'v') {
                            inputElement.val(letrasCorrectas[cont]).css({
                                "background-color": "lightgreen",
                                "transition": "background-color 0.5s ease"
                            });
                            cont++;
                        } else if (letra === 'a') {
                            inputElement.val(letrasCorrectas[cont]).css({
                                "background-color": "#e4a81d",
                                "transition": "background-color 0.5s ease"
                            });
                            cont++;
                        } else if (letra === 'g') {
                            inputElement.val(letrasCorrectas[cont]).css({
                                "background-color": "gray",
                                "transition": "background-color 0.5s ease"
                            });
                            cont++;
                        }
                    });
                    console.log('After loop - row:', row);
                    row++;
                    palabritaUsuario = [];
                    cont = 0;
                    acumulador += 5;
                    intentos--;

                        if (savedGuesses.every(letra => letra === 'v')) {
                            console.log('Victory condition met');
                            console.log(gameEnded);
                            gameEnded = false;
                            const mensajeVictoria = $("<div>").text('¡HAS GANADO!').css({
                                "color": "green",
                                "font-size": "2em",
                                "text-align": "center"
                            });
                             
                            $("body").append(mensajeVictoria);
                        } else {
                            if (intentos === 0) {
                                console.log('Defeat condition met');
                                gameEnded = true;
                                const mensajeDerrota = $("<div>").text('¡HAS PERDIDO!').css({
                                    "color": "red",
                                    "font-size": "2em",
                                    "text-align": "center"
                                });
                                $("body").append(mensajeDerrota);
                            }
                        }
                    
                    
                } else if (targetText !== "ENVIAR" && palabritaUsuario.length !== 5 && gameEnded) {
                    uls.eq(row).children().eq(palabritaUsuario.length).val(targetText.toUpperCase());
                    palabritaUsuario.push(targetText);
                }
            });
        }
        }

        return {
            init: function () {
                createInterface();
                createKeyboard();
                createFunctionality();
            }
        };
    })();

    wordle_negocio.init();
    wordle_vista.init();
});
