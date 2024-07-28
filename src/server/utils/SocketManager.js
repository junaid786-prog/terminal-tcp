class SocketManagerHelper {}
class SocketManager extends SocketManagerHelper {
  connectedSockets;
  static instance;
  constructor() {
    super();
    this.connectedSockets = [];
  }

  static getInstance() {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  addSocket(socket) {
    if (!socket) console.error("Socket is not defined");

    console.info("Socket connected", socket.remoteAddress, socket.remotePort);
    this.connectedSockets.push(socket);
  }

  sendData(data) {
    console.info("Sending data to all connected sockets");

    this.connectedSockets.forEach((socket) => {
      socket.write(data);
    });
  }

  getCommandData(data) {
    let command = data.toString();
    console.log("Command:", command);

    this.sendData(data);
  }
}

module.exports = SocketManager;
