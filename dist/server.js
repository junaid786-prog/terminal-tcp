"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
const events_1 = require("events");
const readline_1 = __importDefault(require("readline"));
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
const server = new net_1.Server();
class MyEventEmitter extends events_1.EventEmitter {
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
    console.log("Received:", data.toString());
});
server.on("connection", (socket) => {
    eventEmitter.addSocket(socket);
    socket.on("data", (data) => {
        eventEmitter.emit("data", data);
    });
});
server.on("data", (data) => {
    console.log("Received:", data.toString());
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
takeDataFromTerminal();
