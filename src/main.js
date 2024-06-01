const { signMessage, verifySignature } = require("./signMessage");
let message = {
  name: "Junaid",
};

const signedMessage = signMessage(message);

console.log(signedMessage);

let a = verifySignature(
  signedMessage.signedMessage,
  signedMessage.algorithm,
  message,
);

// installation -- generate public and private key, uuid and save it in a file
// register --  send public key to server and get public key from server
// connect .. send public key
//
console.log(a);
