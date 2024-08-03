const crypto = require('crypto');

/**
 * Generates a random challenge string.
 * @returns {string} Challenge string in hex format.
 */
function generateChallenge() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Encrypts a string using a public key.
 * @param {string} publicKey - The public key in PEM format.
 * @param {string} data - The data to encrypt.
 * @returns {Buffer} The encrypted data.
 */
function encryptWithPublicKey(publicKey, data) {
  return crypto.publicEncrypt(
    { key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING },
    Buffer.from(data, 'utf-8')
  );
}

module.exports = { generateChallenge, encryptWithPublicKey };
