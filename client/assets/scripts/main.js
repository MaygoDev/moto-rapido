let websocket;

const ipRegex = /^(?:25[0-5]|2[0-4]\d|[0-1]?\d{1,2})(?:\.(?:25[0-5]|2[0-4]\d|[0-1]?\d{1,2})){3}$/;

document.getElementById("connect").addEventListener("click", function() {
    const ip = document.getElementById("ip").value;
    if (ip.match(ipRegex)) {
        connect("ws://" + ip + ":8765");
    }
});

const motoColors = {"orange": "ktm", "red": "honda", "blue": "yamaha", "green": "kawasaki", "yellow": "suzuki"};

let color = null;
let name = null;

function onMessage(event) {
    console.log("Message received: " + event.data);
    const message = JSON.parse(event.data);

    function onJoined(message) {
        console.log("Joined as " + message.name + " with color " + message.color);
        name = message.name;
        color = message.color;

        // Adjust window with frontend elements
        document.getElementById("connection").style.display = "none";
        document.getElementById("game").style.display = "block";
    }

    switch (message.type) {
        case "joined":
            onJoined(message);
            break;
        case "full": // TODO
            break;
        case "left": // TODO
            break;
        case "message": // TODO
            break;
    }
}

function onOpen(event) {
    console.log("Connection opened");

    // Send a message to the server
    const message = {
        type: "join",
        "name": document.getElementById("name").value
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

document.addEventListener("keydown", function(event) {
    if (event.key === " ") {
        forward();
    }
});