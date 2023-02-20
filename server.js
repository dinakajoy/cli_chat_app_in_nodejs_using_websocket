const WebSocket = require("ws");

const wss = new WebSocket.WebSocketServer({ port: 8080 });
const clients = new Map();

const generateId = () => {
  return Math.floor(Math.random() * 99);
};

wss.on("connection", connection = (ws) => {
    // Run when an error occurs
    ws.on("error", console.error);

    // Generates an id for newly connected client and notifies all connected cients of a new user
    const id = generateId();
    const metadata = { id };
    clients.set(ws, metadata);
    console.log(`User ${id} connected`);
    const data = {
      data: "connected",
      sender: id,
    };
    wss.broadcast(data);

    // Run when a client sends a message
    ws.on("message", message = (data) => {
        const metadata = clients.get(ws);
        const message = {
          data: data.toString(),
          sender: metadata.id,
        };
        wss.broadcast(message);
    });

    // Run when a client disconnects
    ws.on("close", () => {
      const metadata = clients.get(ws);
      clients.delete(ws);
      console.log(`User ${metadata.id} disconnected`);
      const data = {
        data: "disconnected",
        sender: metadata.id,
      };
      wss.broadcast(data);
    });
});

// Broadcast message to all connected client
wss.broadcast = broadcast = (message) => {
  const outbound = JSON.stringify(message);
  [...clients.keys()].forEach((client) => {
    client.send(outbound);
  });
};

console.log("Waiting for connection on ws://127.0.0.1:8080");
