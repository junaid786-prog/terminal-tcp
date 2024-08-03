const crypto = require("crypto");

class ClientsHelper {
  static clients = []; // all registered clients
  static connectedClients = []; // uuids of logged in clients

  static login(command) {
    // check if valid
    let isLogggedIn = false;
    console.log(
      "LOGIN",
      this.clients,
      command,
      command.uuid,
      this.clients[0].uuid,
    );

    let responseToSend = null;

    this.clients.forEach((client) => {
      console.log(client);

      if (client.uuid === command.uuid) {
        console.log("Connecting client with public key:: 1");
        this.connectedClients.push(command.uuid);
        isLogggedIn = true;
        // 1. send challenge
        // 2. wait for response
        // 3. check response
        // 4. send success or fail
        // 5. if success, send command
        // 6. if fail, disconnect
        let challenge = generateChallenge(client.publicKey);
        console.log("challenge", challenge);
        responseToSend = {
          type: "send_challenge",
          data: challenge,
        };
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

    return responseToSend;
  }
  static register(command) {
    console.log("Registering client");
    // check if it is valid
    this.clients.push({
      publicKey: command.publicKey,
      uuid: command.uuid,
    });
    this.connectedClients.push(command.uuid);
  }
}

function generateChallenge(publicKey) {
  console.log("GENERATING CHALLENGE");
  let challenge = crypto.randomBytes(16).toString("hex");
  let encryptedChallenge = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(challenge, "utf-8") // Ensure this matches the client's decryption encoding
  );
  console.log("Encrypted challenge:", encryptedChallenge);

  return {
    challenge,
    encryptedChallenge: encryptedChallenge.toString("hex"), // Send as hex or base64
  };
}

module.exports = ClientsHelper;
