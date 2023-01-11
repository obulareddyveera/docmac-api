var express = require("express");
var request = require("request");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  var options = {
    method: "POST",
    url: "https://api.ultramsg.com/instance24999/messages/chat",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    form: {
      token: "hwyf9uecr53cxenu",
      to: "+918105555322",
      body: "WhatsApp API on UltraMsg.com works good",
      priority: "1",
      referenceId: "",
    },
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    res.send("respond with a resource");
  });
});

module.exports = router;
