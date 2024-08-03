// connection.js

const { Socket } = require("net");
const { handleServerResponse } = require("./src/services/challengeService");
const { port, host } = require("./src/config/config");
const connection = require("./src/helpers/display");
const ui = require("../shared/ui");

function askUser() {
  return ui.confirm("Do you want to connect to the server?").then((response) => {
    console.log("Response:", response);

    if (response.confirm) {
      connectToServer();
    } else {
      askUser();
    }
  });
}

askUser();
function connectToServer() {
  const socket = new Socket();

  try {
    // Connect to the server
    socket.connect(port, host, () => {
      console.log(`Connected to server at ${host}:${port}`);
      connection.handleMainMenu(socket);
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
      askUser();
    });
  } catch (error) {
    console.error("Error connecting to server:", error);
  }
}
module.exports = {
  connectToServer
};

