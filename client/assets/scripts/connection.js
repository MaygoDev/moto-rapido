let websocket;

const regex = /^(?:25[0-5]|2[0-4]\d|[0-1]?\d{1,2})(?:\.(?:25[0-5]|2[0-4]\d|[0-1]?\d{1,2})){3}$/;

document.getElementById("connect").addEventListener("click", function() {
    const ip = document.getElementById("ip").value;
    if (ip.match(regex)) {
        connect("ws://" + ip);
    }
});

function onMessage(event) {
    console.log("Message received: " + event.data);
    var message = JSON.parse(event.data);
    if (message.type === "chat") {
        var chat = document.getElementById("chat");
        chat.innerHTML += message.data + "<br>";
    }
}

function onOpen(event) {
    console.log("Connection opened");
    const message = {
        type: "chat",
        data: "Hello, world!"
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

