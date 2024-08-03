/**
 * Command types for socket communication.
 * @enum {string}
 */
const COMMAND_TYPE = {
    REGISTER: 'register',
    CONNECT: 'connect',
    LOGOUT: 'logout',
    SEND_CHALLENGE: 'send_challenge',
    RESPOND_CHALLENGE: 'respond_challenge',
};

module.exports = {
    COMMAND_TYPE,
};
