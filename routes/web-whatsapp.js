const qrCodeClient = require("qrcode");
const webpush = require("web-push");
const express = require("express");
const {
  getClientById,
  initWhatsappWebClient,
  getStatusOfWhatsappWebByClientId,
  getWhatsappWebByClientIds,
  upsertWhatsappWebByClientId,
  deleteWhatsappWebClientById,
  deleteClientById,
} = require("../controller/web-whatsapp");
require("dotenv").config();

const webWhatsappRouter = express.Router();
webpush.setVapidDetails(
  process.env.WEB_PUSH_CONTACT,
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

webWhatsappRouter.get("/qrcode/:clientId/state", async function (req, res) {
  try {
    const { clientId } = req.params;
    const client = await getClientById(clientId);
    if (client) {
      const state = await client.getState();
      res.send({ state: state ? state : "NOT_CONNECTED" });
    } else {
      res.send({ state: "NOT_CONNECTED" });
    }
  } catch (e) {
    res.send({ state: "NOT_CONNECTED" });
  }
});
webWhatsappRouter.get(
  "/qrcode/:clientId/poll/state",
  async function (req, res) {
    try {
      const { clientId } = req.params;
      const whatsappWebClient = await getStatusOfWhatsappWebByClientId(clientId);
      res.send({ whatsappWebClient });
    } catch (e) {
      res.send({ whatsappWebClient: null });
    }
  }
);

webWhatsappRouter.get("/qrcode/:clientId/instance", async function (req, res) {
  const { clientId } = req.params;
  const client = await initWhatsappWebClient(clientId);
  res.send({ whatsappWebClient: client && client.options ? JSON.stringify(client.options): JSON.stringify(client) });
});
/* GET users listing. */
webWhatsappRouter.get("/qrcode/:clientId", async function (req, res) {
  try {
    const { clientId } = req.params;
    await deleteWhatsappWebClientById(clientId);
    const client = await initWhatsappWebClient(clientId);
    console.log('--== *1* /qrcode/:clientId ', client.options);
    client.on("ready", async () => {
      await upsertWhatsappWebByClientId({ clientId, session: {}, status: "ready" });
    });
    client.once("qr", (qr) => {
      console.log('--== *2.0* /qrcode/:clientId ', qr);
      qrCodeClient.toDataURL(qr, function (err, url) {
        console.log('--== *2.10* /qrcode/:clientId ==--', err, url);
        if (url) {
          console.log('--== *2.11* /qrcode/:clientId ==--');
          res.send({ qrCode: url, clientId });
        } else {
          console.log('--== *2.12* /qrcode/:clientId ==--');
          res.send({ error: err, clientId });
        }
      });
      console.log('--== *2.20* /qrcode/:clientId ==--');
    });
    console.log('--== *** /qrcode/:clientId ==--');
  } catch (e) {
    console.log('--== *** /qrcode/:clientId ==--', e);
  }
});
webWhatsappRouter.get("/qrcode/:clientId/logout", async function (req, res) {
  try {
    const { clientId } = req.params;
    const client = await getClientById(clientId);
    client.logout();
    deleteClientById(clientId);
    res.send({ status: 200 });
  } catch (e) {
    res.send({ qrCode: { error: e.message } });
  }
});

webWhatsappRouter.get("/messages/:clientId", async function (req, res, next) {
  try {
    const { clientId } = req.params;
    const client = await getClientById(clientId);
    let qr = await new Promise((resolve, reject) => {
      client.on("message", (message) => resolve({ message }));
      setTimeout(() => {
        reject(new Error("QR event wasn't emitted in 15 seconds."));
      }, 15000);
    });
    res.send({ qrCode: qr });
  } catch (e) {
    res.send(e.message);
  }
});

webWhatsappRouter.post("/subscribe", async (req, res) => {
  const subscription = req.body;
  webPushReqBody = req.body;
  const whatsappWebClient = await getWhatsappWebByClientIds();
  webpush
    .sendNotification(subscription, whatsappWebClient)
    .then((result) => console.log(result))
    .catch((e) => console.log(e.stack));
  res.status(200).json({ success: true });
});

module.exports = webWhatsappRouter;
