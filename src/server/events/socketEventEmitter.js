const EventEmitter = require('events');
const { COMMAND_TYPE } = require('../constants');
const clientService = require('../services/clientService');

/**
 * Custom event emitter for handling socket events.
 */
class SocketEventEmitter extends EventEmitter {
    constructor() {
        super();
        this.on('data', this.handleData.bind(this));
    }

    /**
     * Handles incoming data events.
     * @param {Object} eventData - Contains the client socket and data.
     */
    handleData({ client, data }) {
        try {
            const command = JSON.parse(data.toString());
            console.log('Received command:', command);

            switch (command.type) {
                case COMMAND_TYPE.REGISTER:
                    clientService.register(command);
                    break;
                case COMMAND_TYPE.CONNECT:
                    const response = clientService.login(command);
                    if (response) client.write(JSON.stringify(response));
                    break;
                case COMMAND_TYPE.RESPOND_CHALLENGE:
                    const res = clientService.respondChallenge(command);
                    if (res) client.write(JSON.stringify(res));
                    break;
                case COMMAND_TYPE.LOGOUT:
                    clientService.logout(command);
                    break;
                default:
                    console.log('Unknown command:', command.type);
            }

            return command;
        } catch (error) {
            console.error('Error processing data:', error);
        }
    }
}

module.exports = new SocketEventEmitter();
