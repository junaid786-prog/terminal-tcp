const { EventEmitter } = require("node:events");
const { COMMAND_TYPE } = require("../../constants");
const ClientsHelper = require("./ClientsHelper");
const { write } = require("node:fs");

class SocketEventEmitter extends EventEmitter {
  constructor() {
    super();
  }

  on(event, listener) {
    console.log("Event:", event);
    super.on(event, listener);
  }
  static listenToEvents(eventEmitter) {
    eventEmitter.on("data", (eventData) => {
      let { client, data } = eventData;
      let command = data.toString();
      console.log("Received:", command);
      try {
        command = JSON.parse(command);
        if (command.type === COMMAND_TYPE.REGISTER) {
          ClientsHelper.register(command);
        } else if (command.type === COMMAND_TYPE.CONNECT) {
          console.log("Connecting client with public key");
          let res = ClientsHelper.login(command);
          if (res) {
            client.write(JSON.stringify(res));
          }
        } else if (command.type === COMMAND_TYPE.LOGOUT) {
          //ClientsHelper.logout(command);
        } else {
          console.log("Unknown command");
        }
      } catch (error) { }
    });
  }
}

module.exports = SocketEventEmitter;
