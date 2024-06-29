const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const generateKeyPair = require("./keys");

function install() {
  generateKeyPair();
  const uuid = generateUUID();
  saveUUID(uuid);
}

function register(socket) {
  if (!socket) {
    console.log("Socket not available");
    return;
  }

  const publicKey = fs.readFileSync(__dirname + "/id_rsa_pub.pem", "utf-8");
  console.log("Public Key:", publicKey);

  // send public key, uuid to server
  let uuid = fs.readFileSync(__dirname + "/uuid.txt", "utf-8");
  console.log("UUID:", uuid);

  if (!publicKey || !uuid) {
    console.log("Public key or UUID not available. Please install first.");
    return;
  }

  let data = {
    type: "register",
    publicKey,
    uuid,
  };

  data = JSON.stringify(data);
  socket.write(data);

  // send public key to server
  // get public key from server
}

function connect(socket) {
  if (!socket) {
    console.log("Socket not available");
    return;
  }

  const publicKey = fs.readFileSync(__dirname + "/id_rsa_pub.pem", "utf-8");
  const uuid = fs.readFileSync(__dirname + "/uuid.txt", "utf-8");

  if (!publicKey || !uuid) {
    console.log("Public key or UUID not available. Please Register First.");
    return;
  }
  // TODO: change it to command
  let data = {
    type: "connect",
    publicKey,
    uuid,
  };

  data = JSON.stringify(data);
  socket.write(data);
}

/** Helper functions */

function generateUUID() {
  return uuidv4();
}

function saveUUID(uuid) {
  if (!fs.existsSync(__dirname + "/uuid.txt")) {
    fs.writeFileSync(__dirname + "/uuid.txt", uuid);
  }
}

module.exports = {
  install,
  register,
  connect,
};

//1. install();
//2. register();
//3. connect(); // in case you are already registered
