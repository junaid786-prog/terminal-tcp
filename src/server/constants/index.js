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
    LOGIN_SUCCESS: 'login_success',
    LOGIN_FAILURE: 'login_failure',
    LOGOUT_SUCCESS: 'logout_success',
    COMMAND: 'command',
    COMMAND_RESPONSE: 'command_response',
};

module.exports = {
    COMMAND_TYPE,
};
