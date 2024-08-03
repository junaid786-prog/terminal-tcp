// src/services/connectionService.js

const fs = require("fs");
const { getPublicKey } = require("../helpers/getKeys");
const path = require("path");

/**
 * Registers the client with the server by sending the public key and UUID.
 * @param {Socket} socket - The socket connection.
 */
function registerClient(socket) {
  const publicKey = getPublicKey();
  let filePath = path.join(__dirname, "../../keys") + "/uuid.txt";
  const uuid = fs.readFileSync(filePath, "utf8");

  const data = JSON.stringify({
    type: "register",
    publicKey,
    uuid,
  });

  socket.write(data);
}

/**
 * Connects the client by sending the UUID to the server.
 * @param {Socket} socket - The socket connection.
 */
function connectClient(socket) {
  let filePath = path.join(__dirname, "../../keys") + "/uuid.txt";
  const uuid = fs.readFileSync(filePath, "utf8");

  const data = JSON.stringify({
    type: "connect",
    uuid,
  });

  socket.write(data);
}

module.exports = { registerClient, connectClient };
