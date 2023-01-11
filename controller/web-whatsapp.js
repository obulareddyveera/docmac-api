const { Client, LocalAuth } = require("whatsapp-web.js");
const { prisma } = require("../prisma/client.js");

var client = {};
module.exports = {
  initWhatsappWebClient: async (clientId) => {
    try {
      if (!client[clientId]) {
        const webClientIns = new Client();
        webClientIns.initialize();
        client[clientId] = webClientIns;
      }
    } catch (e) {
      console.log("--== **> *#ctrl initWhatsappWebClient ==--", clientId, e);
    }
    return client[clientId];
  },
  getClientById: (id) => client[id],
  getAllClients: () => client,
  deleteClientById: (id) => {
    client[id] = null;
  },
  upsertWhatsappWebByClientId: async (payload) => {
    return await prisma.WebWhatsapp.upsert({
      where: { clientId: payload.clientId },
      update: {
        clientId: payload.clientId,
        session: JSON.stringify(payload.session),
        status: payload.status,
      },
      create: {
        clientId: payload.clientId,
        session: JSON.stringify(payload.session),
        status: payload.status,
      },
    });
  },
  getStatusOfWhatsappWebByClientId: async (clientId) => {
    return prisma.WebWhatsapp.findUnique({
      where: {
        clientId: clientId,
      },
    });
  },
  getWhatsappWebByClientIds: async (clientId) => {
    return prisma.WebWhatsapp.findMany();
  },
  deleteWhatsappWebClientById: async (clientId) => {
    return prisma.WebWhatsapp.deleteMany({
      where: {
        clientId: clientId,
      },
    });
  },
};
