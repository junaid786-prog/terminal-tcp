// src/helpers/getKeys.js

const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const keysDirectory = path.join(__dirname, "../../keys");

if (!fs.existsSync(keysDirectory)) {
  fs.mkdirSync(keysDirectory);
}

const publicKeyPath = path.join(keysDirectory, "id_rsa_pub.pem");
const privateKeyPath = path.join(keysDirectory, "id_rsa_priv.pem");

/**
 * Generates an RSA key pair and saves them to files.
 */
function generateKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: { type: "pkcs1", format: "pem" },
    privateKeyEncoding: { type: "pkcs1", format: "pem" },
  });

  fs.writeFileSync(publicKeyPath, publicKey);
  fs.writeFileSync(privateKeyPath, privateKey);
}

/**
 * Retrieves the public key from the file.
 * @returns {string} - The public key.
 */
function getPublicKey() {
  return fs.readFileSync(publicKeyPath, "utf8");
}

/**
 * Retrieves the private key from the file.
 * @returns {string} - The private key.
 */
function getPrivateKey() {
  return fs.readFileSync(privateKeyPath, "utf8");
}

module.exports = { generateKeyPair, getPublicKey, getPrivateKey };
