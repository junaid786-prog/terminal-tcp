const crypto = require("crypto");
const fs = require("fs");

const generateKeyPair = () => {
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  // create public key file
  fs.writeFileSync(__dirname + "/id_rsa_pub.pem", keyPair.publicKey);
  // create private key file
  fs.writeFileSync(__dirname + "/id_rsa_priv.pem", keyPair.privateKey);
};

generateKeyPair();

module.exports = generateKeyPair;
