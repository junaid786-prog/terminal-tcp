/**
 * Service for managing socket connections.
 */
class SocketService {
    constructor() {
        this.connectedSockets = [];
    }

    /**
     * Adds a new socket connection.
     * @param {Socket} socket - The socket to add.
     */
    addSocket(socket) {
        if (!socket) {
            console.error('Socket is not defined');
            return;
        }
        console.info('Socket connected:', socket.remoteAddress, socket.remotePort);
        this.connectedSockets.push(socket);
    }

    /**
     * Sends data to all connected sockets.
     * @param {Buffer|string} data - The data to send.
     */
    sendData(data) {
        console.info('Sending data to all connected sockets');
        this.connectedSockets.forEach(socket => socket.write(data));
    }
}

module.exports = new SocketService();
