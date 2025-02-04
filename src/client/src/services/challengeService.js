// src/services/challengeService.js

const crypto = require("crypto");
const { getPrivateKey, getUUID } = require("../helpers/getKeys");
const { handleUserLoggedInMenu, handleMainMenu } = require("../helpers/display");
const CommandHandler = require("../../../shared/commands/commandHandler");

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
            uuid: getUUID(),
          },
        })
      );
    } else if (command.type === "login_success") {
      console.log("Logged in successfully");
      handleUserLoggedInMenu(socket);
    } else if (command.type === "logout_success") {
      console.log("Logged out successfully");
      socket.end();
    } else if (command.type === "login_failure") {
      console.log("Login failed");
      handleMainMenu(socket);
    } else if (command.type === "command") {
      console.error("Executing command", command.data?.command);
      // Execute the command
      CommandHandler.handleCommand(command, (response) => {
        console.log("Sending response to server:", response);
        socket.write(JSON.stringify({
          type: "command_response",
          data: response,
        }));
      })
    }
  } catch (error) {
    console.error("Error processing server response:", error);
  }
}

module.exports = { handleServerResponse };
