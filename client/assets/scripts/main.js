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

function startCountdown() {
    let countdown = 3;

    const countdownElement = document.getElementById("countdown");
    countdownElement.style.display = "block";

    const countdownInterval = setInterval(function() {
        countdown--;
        countdownElement.innerText = countdown;

        switch (countdown) {
            case 2:
                countdownElement.style.backgroundColor = "orange";
                break;
            case 1:
                countdownElement.style.backgroundColor = "gold";
                break;
            case 0:
                countdownElement.style.backgroundColor = "green";
                countdownElement.innerText = "GO !!!";

                // Hide countdown after 1 second
                setTimeout(function() {
                    countdownElement.style.display = "none";
                }, 1000);
                clearInterval(countdownInterval);
                started = true;
                break;
        }
    }, 1000);
}

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

            if (playerName === name) {
                return;
            }

            playerBox = document.createElement("div");

            playerBox.id = "player-"+playerName;
            playerBox.className = "text-center moto";

            const lastOffset = document.getElementById("game").lastElementChild.style.top;
            const newOffset = parseInt(lastOffset.substring(0, lastOffset.length - 2)) + 200;

            playerBox.style.top = newOffset+"px";
            playerBox.style.left = "0px"; // 0px because just joined

            playerMoto = document.createElement("img");
            playerMoto.id = "player-moto";
            playerMoto.src = "assets/img/motos/"+playerColor+".png";
            playerMoto.alt = "Moto "+playerColor;
            // Set moto width to 90px
            playerMoto.width = 90;

            playerNameElement = document.createElement("h3");
            playerNameElement.id = "player-name";
            playerNameElement.innerText = playerName;

            playerScore = document.createElement("p");
            playerScore.id = "score";
            playerScore.innerText = "Prêt ❌";

            playerBox.appendChild(playerNameElement);
            playerBox.appendChild(playerMoto);
            playerBox.appendChild(playerScore);

            document.getElementById("game").appendChild(playerBox);

            break;
        case "forwarded":
            playerName = message.name;
            playerNewScore = message.score;

            playerBox = document.getElementById("player-"+playerName);

            playerBox.children.namedItem("score").innerText = playerNewScore;
            playerBox.style.left = playerNewScore + "px";

            break;
        case "start":
            readyButton.style.display = "none";
            startCountdown();
            break;
        case "ready":
            playerName = message.name;
            document.getElementById("player-"+playerName).children.namedItem("score").innerText = "Prêt ✔️";
            break;
        case "left":
            playerName = message.name;
            document.getElementById("player-"+playerName).remove();
            break;
        case "win":
            playerName = message.name;

            const countdownElement = document.getElementById("countdown");
            countdownElement.style.display = "block";
            countdownElement.style.backgroundColor = "gold";
            countdownElement.innerText = playerName + " a gagné ! 🏆";

            started = false;

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
let started = false;

function forward() {
    if (!started) {
        return;
    }

    // send packet to websocket server
    const message = {
        type: "forward",
        secret: secret,
    };
    websocket.send(JSON.stringify(message));
}

let position = 0; // Position initiale en pixels
const moto = document.getElementById('player-'+name);

let pressed = false;

document.addEventListener("keydown", function(event) {
    if (!pressed) {
        if (event.code === 'Space') {
            const motoWidth = moto.offsetWidth;
            const containerWidth = document.body.clientWidth;

            // Vérifier si la moto n'a pas atteint ou dépassé le bord droit de l'écran
            if (position + motoWidth < containerWidth) {
                forward();
            }

            event.preventDefault();
        }else if (event.code === 'KeyT') { // Turbo TODO
        }
        pressed = true;
    }
});

document.addEventListener("keyup", function(event) {
    pressed = false;
});

// Ready

const readyButton = document.getElementById("ready");

let ready = false;

readyButton.addEventListener("click", function() {
    if (ready) {
        return;
    }

    ready = true;

    readyButton.className = "btn btn-success";
    readyButton.innerText = "Prêt ✔️";

    const message = {
        type: "ready",
        ready: ready,
        secret: secret,
    };
    websocket.send(JSON.stringify(message));
});