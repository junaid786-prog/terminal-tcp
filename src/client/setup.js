// setup.js

const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { generateKeyPair } = require("./src/helpers/getKeys");

/**
 * Generates and saves a new key pair and UUID for the client.
 */
function install() {
  generateKeyPair();
  const uuid = generateUUID();
  saveUUID(uuid);
}

/**
 * Generates a unique UUID for the client.
 * @returns {string} - The generated UUID.
 */
function generateUUID() {
  return uuidv4();
}

/**
 * Saves the given UUID to a file.
 * @param {string} uuid - The UUID to save.
 */
function saveUUID(uuid) {
  const uuidFilePath = __dirname + "/keys/uuid.txt";
  if (!fs.existsSync(uuidFilePath)) {
    fs.writeFileSync(uuidFilePath, uuid);
  }
}

module.exports = {
  install,
};
