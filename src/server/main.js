const { Server, Socket } = require("net");
const { EventEmitter } = require("events");
const { spawn } = require("child_process");

const readLine = require("readline");
const { log } = require("console");

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const server = new Server();

let clients = [];
let connectedSockets = [];
let connectedClients = [];

class MyEventEmitter extends EventEmitter {
  connectedSockets;
  constructor() {
    super();
    this.connectedSockets = [];
  }

  addSocket(socket) {
    console.log("Socket connected", socket.remoteAddress, socket.remotePort);
    this.connectedSockets.push(socket);
  }

  sendData(data) {
    console.log("Sending data to all connected sockets");

    this.connectedSockets.forEach((socket) => {
      socket.write(data);
    });
  }

  getCommandData(data) {
    let command = data.toString();
    console.log("Command:", command);

    this.sendData(data);
  }

  onData(event, listener) {
    super.on(event, listener);
  }
}

const eventEmitter = new MyEventEmitter();

eventEmitter.on("data", (data) => {
  let command = data.toString();
  console.log("Received:", command);

  try {
    command = JSON.parse(command);
    if (command.type === "register") {
      clients.push(command);
    } else if (command.type === "connect") {
      let isLogggedIn = false;

      clients.forEach((client) => {
        console.log(
          "Client:",
          client + "/n/n\n\n\n\n\n\n\n\n\n\n" + command + "/n/n",
        );

        if (
          client.publicKey === command.publicKey &&
          client.uuid === command.uuid
        ) {
          console.log("Connecting client with public key:", command.publicKey);
          connectedClients.push(command);
          isLogggedIn = true;
        } else {
          console.log("Client not matched");
          // socket.write("Client not registered");
        }
      });

      if (!isLogggedIn) {
        console.log("Client not registered");
        // socket.write("Client not registered");
      } else {
        console.log("Client connected");
        // socket.write("Client connected");
      }
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
});

server.on("connection", (socket) => {
  eventEmitter.addSocket(socket);

  socket.on("data", (data) => {
    eventEmitter.emit("data", data);
  });
});

server.listen(3000, () => {
  console.log("Server started on port 3000");
  takeDataFromTerminal();
});

// make a seperate thread to take data from terminal

function takeDataFromTerminal() {
  var waitForUserInput = function () {
    rl.question("Enter command: ", function (line) {
      console.log("Received:", line);
      if (eventEmitter.sendData) {
        eventEmitter.sendData(Buffer.from(line));
      }
      waitForUserInput();
    });
  };
  waitForUserInput();
  //const terminalProcess = spawn("node", ["/Users/apple/Documents/projects/connect/terminal.js"]);

  // terminalProcess.stdout.on("data", (data: Buffer) => {
  //     eventEmitter.getCommandData(data);
  // });

  // terminalProcess.stderr.on("data", (data: Buffer) => {
  //     console.error("Error:", data.toString());
  // });

  // terminalProcess.on("close", (code) => {
  //     console.log("Terminal process exited with code", code);
  // });
}
