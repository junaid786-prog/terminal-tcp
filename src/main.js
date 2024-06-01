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

console.log(a);
