let websocket;


const elementName = document.getElementById("name").firstChild.data;
const name = elementName.substring(0, elementName.length - 1);

const color = document.getElementById("player-"+name)
    .children
    .namedItem("player-moto")
    .alt
    .replace("Moto ", "");

connect("ws://172.16.32.154:8765");
let secret = null; // This secret is used with the server to avoid cheating.

function onMessage(event) {
    console.log("Message received: " + event.data);
    const message = JSON.parse(event.data);

    switch (message.type) {
        case "joined":
            secret = message.secret;
            if (secret == null) { // If the server didn't send a secret, it means that the player is already in the game.
                disconnect();
            }
            break;
        case "playerJoined":
            playerName = message.name;
            playerColor = message.color;

            playerBox = document.createElement("div");

            playerBox.id = "player-"+playerName;
            playerBox.className = "text-center moto";

            const lastOffset = document.getElementById("game").lastElementChild.style.top;
            const newOffset = parseInt(lastOffset.substring(0, lastOffset.length - 2)) + 200;

            playerBox.style="top: "+newOffset+"px; left: 0px;";

            playerMoto = document.createElement("img");
            playerMoto.src = "assets/images/moto-"+playerColor+".png";
            playerMoto.alt = "Moto "+playerColor;
            playerMoto.width = 50;
            playerMoto.height = 50;


            document.getElementById("game").appendChild(playerBox);

            break;
        case "forwarded":
            playerName = message.name;
            playerNewScore = message.score;

            playerBox = document.getElementById("player-"+playerName);

            playerBox.children.namedItem("score").innerText = playerNewScore;
            playerBox.style.left = playerNewScore + "px";

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
        name: name,
        color: color
    };
    websocket.send(JSON.stringify(message));
}

function onClose(event) {
    // Redirect to logout
    window.location.href = "/logout.php";
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
        secret: secret,
    };
    websocket.send(JSON.stringify(message));
}

let position = 0; // Position initiale en pixels
const moto = document.getElementById('player-'+name);

document.addEventListener("keydown", function(event) {
    if (event.code === 'Space') {
        const motoWidth = moto.offsetWidth;
        const containerWidth = document.body.clientWidth;

        // Vérifier si la moto n'a pas atteint ou dépassé le bord droit de l'écran
        if (position + motoWidth < containerWidth) {
            forward();
        }

        event.preventDefault();
    }
});