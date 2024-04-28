import { Server, Socket } from "net"
import { EventEmitter } from "events";
import { spawn } from "child_process";

import readLine from "readline";

const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

const server = new Server();

class MyEventEmitter extends EventEmitter {
    connectedSockets: Socket[];
    constructor() {
        super();
        this.connectedSockets = [];
    }

    addSocket(socket: Socket) {
        console.log("Socket connected", socket.remoteAddress, socket.remotePort);
        this.connectedSockets.push(socket);
    }

    sendData(data: Buffer) {
        console.log("Sending data to all connected sockets");
        
        this.connectedSockets.forEach((socket) => {
            socket.write(data);
        });
    }

    getCommandData(data: Buffer) {
        let command = data.toString();
        console.log("Command:", command);

        this.sendData(data);
    }

    onData(event: string, listener: (...args: any[]) => void) {
        super.on(event, listener);
    }
}

const eventEmitter = new MyEventEmitter();

eventEmitter.on("data", (data) => {
    console.log("Received:", data.toString());
});


server.on("connection", (socket: Socket) => {
    eventEmitter.addSocket(socket);

    socket.on("data", (data: Buffer) => {
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