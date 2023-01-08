const qrcode = require("qrcode-terminal");
const qrCodeClient = require("qrcode");
const { Client } = require("whatsapp-web.js");
const express = require("express");
const whatsappWebClient = require("../controller/web-whatsapp");
const webWhatsappRouter = express.Router();

/* GET users listing. */
webWhatsappRouter.get("/qrcode", async function (req, res, next) {
  try {
    const client = whatsappWebClient();
    let qr = await new Promise((resolve, reject) => {
      client.once("qr", (qr) => {
        // resolve({ qrCode: qr })
        qrCodeClient.toDataURL(qr, function (err, url) {
          console.log(url);
          resolve({ qrCode: url });
        });
      });
      setTimeout(() => {
        reject({
          error:
            "QR event wasn't emitted in 15 seconds. Please refresh the QRCode",
        });
      }, 15000);
    });
    res.send({ qrCode: qr });
    /**
    client.on("ready", () => {
      console.log("Client is ready!");
    });

    client.on("qr", (qr) => {
      qrcode.generate(qr, (qrCodeString) => {
        console.log("--== qrCodeString ", qrCodeString);
        res.send(qrCodeClient.toDataURL(qrCodeString));
      });
    });


    client.on("message", (message) => {
      console.log("--== Message ", message);
      if (message.body === "!ping") {
        message.reply("pong");
      }
    });
    
  client.on("message", (message) => {
    console.log('--== Message ', message);
    if (message.body === "!ping") {
      message.reply("pong");
    }
  });
 */

    //res.send("respond with a resource");
  } catch (e) {
    console.log("--== webWhatsappRouter ", e);
    res.send(e.message);
  }
});
webWhatsappRouter.get("/messages", async function (req, res, next) {
  try {
    const client = whatsappWebClient();
    let qr = await new Promise((resolve, reject) => {
      client.on("message", (message) => resolve({ message }));
      setTimeout(() => {
        reject(new Error("QR event wasn't emitted in 15 seconds."));
      }, 15000);
    });
    res.send({ qrCode: qr });
  } catch (e) {
    console.log("--== webWhatsappRouter ", e);
    res.send(e.message);
  }
});

module.exports = webWhatsappRouter;
