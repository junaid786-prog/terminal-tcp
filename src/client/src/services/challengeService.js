// src/services/challengeService.js

const crypto = require("crypto");
const { getPrivateKey } = require("../helpers/getKeys");

/**
 * Handles the server response, particularly the challenge response.
 * @param {Buffer|string} data - The data received from the server.
 * @param {Socket} socket - The socket connection.
 */
function handleServerResponse(data, socket) {
  try {
    const command = JSON.parse(data.toString());

    if (command.type === "send_challenge") {
      console.log("Challenge received");
      const { challenge, encryptedChallenge } = command.data;

      // Decrypt the encrypted challenge
      const decryptedChallenge = crypto.privateDecrypt(
        {
          key: getPrivateKey(),
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(encryptedChallenge, "hex")
      );

      const isVerified = decryptedChallenge.toString("utf8") === challenge;
      console.log("Is verified:", isVerified);

      // Send the response to the server
      socket.write(
        JSON.stringify({
          type: "respond_challenge",
          data: {
            response: isVerified,
          },
        })
      );
    }
  } catch (error) {
    console.error("Error processing server response:", error);
  }
}

module.exports = { handleServerResponse };
