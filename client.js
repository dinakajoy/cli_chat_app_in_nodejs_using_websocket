const WebSocket = require("ws");
const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");
const readlineInterface = readline.createInterface({ input, output });

const ws = new WebSocket("ws://127.0.0.1:8080");

ws.on("error", console.error);

ws.on("message", message = (message) => {
  const messageObject = JSON.parse(message);
  console.log(`User ${messageObject.sender}: ${messageObject.data}`);
});

// Triggers user to type text and accepts input from user and send to server
const sendMsg = () => {
  readlineInterface.question("", (text) => {
    ws.send(text);
    sendMsg();
  });
};

sendMsg();
