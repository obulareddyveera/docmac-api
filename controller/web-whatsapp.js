const { Client } = require('whatsapp-web.js');

var client;
const whatsappWebClient = function () {
  if (!client) {
    client = new Client();
    client.initialize();
  }
  return client;
};

module.exports = whatsappWebClient;