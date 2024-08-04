const { generateChallenge, encryptWithPublicKey } = require('../helpers/cryptoHelper');

/**
 * Service for managing clients.
 */
class ClientService {
    constructor() {
        this.clients = [];
        this.connectedClients = [];
        this.loggedinUsers = []
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
            responseToSend = {
                type: 'login_failure',
                data: { uuid: command.uuid },
            };
        }

        return responseToSend;
    }

    logout(command) {
        // remove the user from the loggedinUsers array and the connectedClients array
        if (!command.uuid) return;
        this.loggedinUsers = this.loggedinUsers.filter(user => user !== command.uuid);
        this.connectedClients = this.connectedClients.filter(client => client !== command.uuid);
        return {
            type: 'logout_success',
            data: { uuid: command.uuid },
        };
    }
    /**
     * Responds to a challenge.
     * @param {Object} command - The respond challenge command containing uuid and response.
     */
    respondChallenge(command) {
        let data = command.data;
        let uuid = data.uuid;
        let response = data.response;
        let client = this.clients.find(c => c.uuid === uuid);

        if (client) {
            if (response) {
                console.log('Client responded correctly');
                this.loggedinUsers.push(uuid);
                return {
                    type: 'login_success',
                    data: { uuid },
                };
            } else {
                console.log('Client failed to respond correctly');
                return {
                    type: 'login_failure',
                    data: { uuid },
                };
            }
        } else {
            console.log('Client not found:', uuid);
            return {
                type: 'login_failure',
                data: { uuid },
            };
        }

    }
}
module.exports = new ClientService();
