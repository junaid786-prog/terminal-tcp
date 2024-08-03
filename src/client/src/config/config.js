// src/config/config.js

module.exports = {
    port: parseInt(process.argv[2]) || 3000,
    host: process.argv[3] || "localhost",
  };
  