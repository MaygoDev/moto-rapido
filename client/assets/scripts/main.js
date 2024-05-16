let websocket;

const ipRegex = /^(?:25[0-5]|2[0-4]\d|[0-1]?\d{1,2})(?:\.(?:25[0-5]|2[0-4]\d|[0-1]?\d{1,2})){3}$/;


const motoColors = {"orange": "ktm", "red": "honda", "blue": "yamaha", "green": "kawasaki", "yellow": "suzuki"};

let color = null;
const elementName = document.getElementById("name").firstChild.data;
const name = elementName.substring(0, elementName.length - 1);

connect("ws://localhost:");
let secret = null; // This secret is used with the server to avoid cheating.

function onMessage(event) {
    console.log("Message received: " + event.data);
    const message = JSON.parse(event.data);

    switch (message.type) {
        case "joined":
            secret = message.secret;

            break;
        case "left": // TODO
            break;
        case "forward": // TODO
            break;
    }
}

function onOpen(event) {
    console.log("Connection opened");

    // Send a message to the server
    const message = {
        type: "join",
        "name": name
    };
    websocket.send(JSON.stringify(message));
}

function onClose(event) {
    console.log("Connection closed");
}

function connect(url) {
    if (websocket) {
        websocket.close();
    }
    websocket = new WebSocket(url);
    websocket.onopen = this.onOpen;
    websocket.onmessage = this.onMessage;
    websocket.onclose = this.onClose;
}

function disconnect() {
    if (websocket) {
        websocket.close();
    }
}

// Game

function forward() {
    // send packet to websocket server
    const message = {
        type: "forward",
        name: document.getElementById("name").value,
        color: color
    };
    websocket.send(JSON.stringify(message));
}

let position = 0; // Position initiale en pixels
const step = 10; // Distance que la moto parcourt à chaque pression de la barre d'espace
const moto = document.getElementById('player-'+name);

document.addEventListener("keydown", function(event) {
    if (event.code === 'Space') {
        const motoWidth = moto.offsetWidth;
        const containerWidth = document.body.clientWidth;

        // Calculer la nouvelle position
        position += step;
        moto.style.left = `${position}px`;

        // Vérifier si la moto a atteint ou dépassé le bord droit de l'écran
        if (position + motoWidth >= containerWidth) {
            alert('Vous avez atteint le bord droit de l\'écran!');
            // Réinitialiser la position ou faire autre chose si nécessaire
        }

        // Empêche la page de défiler lorsque l'espace est pressé
        event.preventDefault();
        // forward();
    }
});