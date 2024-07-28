const fs = require("fs");

const getPublicKey = () => fs.readFileSync(__dirname + "/id_rsa_pub.pem", "utf8");
const getPrivateKey = () => fs.readFileSync(__dirname + "/id_rsa_priv.pem", "utf8");

console.log(getPublicKey());
module.exports = { getPublicKey, getPrivateKey };