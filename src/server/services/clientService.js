const { generateChallenge, encryptWithPublicKey } = require('../helpers/cryptoHelper');

/**
 * Service for managing clients.
 */
class ClientService {
    constructor() {
        this.clients = [];
        this.connectedClients = [];
    }

    /**
     * Registers a new client.
     * @param {Object} command - The registration command containing publicKey and uuid.
     */
    register(command) {
        console.log('Registering client');
        this.clients.push({ publicKey: command.publicKey, uuid: command.uuid });
        this.connectedClients.push(command.uuid);
    }

    /**
     * Logs in a client and sends a challenge.
     * @param {Object} command - The connect command containing uuid.
     * @returns {Object|null} The response containing the challenge or null if not registered.
     */
    login(command) {
        let responseToSend = null;

        const client = this.clients.find(c => c.uuid === command.uuid);
        if (client) {
            console.log('Client found, generating challenge');
            const challenge = generateChallenge();
            const encryptedChallenge = encryptWithPublicKey(client.publicKey, challenge);
            responseToSend = {
                type: 'send_challenge',
                data: { challenge, encryptedChallenge: encryptedChallenge.toString('hex') },
            };
        } else {
            console.log('Client not registered:', command.uuid);
        }

        return responseToSend;
    }
}

module.exports = new ClientService();
