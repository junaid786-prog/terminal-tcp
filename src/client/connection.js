// connection.js

const { Socket } = require("net");
const { connectClient, registerClient } = require("./src/services/connectionService");
const { handleServerResponse } = require("./src/services/challengeService");
const { port, host } = require("./src/config/config");
const { install } = require("./setup");

// Create a new socket instance
const socket = new Socket();

// Connect to the server
socket.connect(port, host, () => {
  console.log(`Connected to server at ${host}:${port}`);
  registerClient(socket); // Register the client
  setTimeout(() => connectClient(socket), 3000); // Connect after registration
});

// Handle data received from the server
socket.on("data", (data) => {
  handleServerResponse(data, socket);
});

// Handle socket errors
socket.on("error", (error) => {
  console.error("Socket error:", error);
});

// Close the socket on exit
socket.on("close", () => {
  console.log("Disconnected from server");
});
