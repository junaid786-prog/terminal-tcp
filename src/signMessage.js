const crypto = require("crypto");
const fs = require("fs");
const { encryptWithPrivateKey } = require("./encrypt");
const { decryptWithPublicKey } = require("./decrypt");

function signMessage(message) {
  const privateKey = fs.readFileSync(__dirname + "/id_rsa_priv.pem", "utf8");
  const publicKey = fs.readFileSync(__dirname + "/id_rsa_pub.pem", "utf8");

  let messageString = JSON.stringify(message);

  const hash = crypto.createHash("sha256");

  hash.update(messageString);

  const hashedMessage = hash.digest("hex");

  const signedMessage = encryptWithPrivateKey(privateKey, hashedMessage);

  return { signedMessage, algorithm: "sha256" };
}

function verifySignature(signedMessage, algorithm, originalMessage) {
  const publicKey = fs.readFileSync(__dirname + "/id_rsa_pub.pem", "utf8");

  const decryptedMessage = decryptWithPublicKey(publicKey, signedMessage);

  const decryptedMessageString = decryptedMessage.toString();

  const hash = crypto.createHash("sha256");

  const hashOfOriginalMessage = hash
    .update(JSON.stringify(originalMessage))
    .digest("hex");

  if (hashOfOriginalMessage === decryptedMessageString) {
    return true;
  } else {
    return false;
  }
}

module.exports = { signMessage, verifySignature };
