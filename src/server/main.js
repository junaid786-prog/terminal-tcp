const { Server, Socket } = require("net");
const { spawn } = require("child_process");

const readLine = require("readline");
const SocketEventEmitter = require("./utils/SocketEventEmitter");
const SocketManager = require("./utils/SocketManager");

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const server = new Server();
const eventEmitter = new SocketEventEmitter();
const socketManager = SocketManager.getInstance();
SocketEventEmitter.listenToEvents(eventEmitter);

server.on("connection", (socket) => {
  socketManager.addSocket(socket);

  socket.on("data", (data) => {
    console.log("Data");
    eventEmitter.emit("data", { client: socket, data });
  });
});

server.listen(3000, () => {
  console.log("Server started on port 3000");
  // takeDataFromTerminal();
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
