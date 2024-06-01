const crypto = requrie("crypto");
const fs = require("fs");

const generateKeyPair = () => {
  const keyPair = crypto.generateKeyPairSync("x25519", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    pricateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  // create public key file
  fs.writeFileSync(__dirname + "/id_rsa_pub.pem", keyPair.publicKey);
  // create private key file
  fs.writeFileSync(__dirname + "/id_rsa_priv.pem", keyPair.privateKey);
};

module.exports = generateKeyPair;
