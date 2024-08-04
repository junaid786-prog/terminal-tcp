const { Server } = require('net');
const readline = require('readline');
const socketEventEmitter = require('./events/socketEventEmitter');
const socketService = require('./services/socketService');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const server = new Server();

server.on('connection', (socket) => {
  socketService.addSocket(socket);
  socket.on('data', (data) => {
    socketEventEmitter.emit('data', { client: socket, data })
  });
  socket.on('error', (err) => console.error('Socket error:', err));
  socket.on('close', () => console.log('Socket closed'));
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
  promptForCommand();
});

/**
 * Prompts the user for input commands.
 */
function promptForCommand() {
  rl.question('Enter command: ', (line) => {
    if (line.trim().toLowerCase() === 'exit') {
      rl.close();
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    } else {
      socketService.sendData(
        JSON.stringify({
          type: "command",
          data: { command: line }
        }),
      );
      promptForCommand();
    }
  });
}
