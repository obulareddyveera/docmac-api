var express = require("express");
var dotenv = require("dotenv");
var router = express.Router();
const jwt = require("jsonwebtoken");
var authController = require("../controller/auth");
/* GET users listing. */
router.get("/details", async (req, res, next) => {
  try {
    let token = req.get("Authorization");
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.accessSecret);
    const personId = decoded.personId;
    const person = await authController.getPersonById(personId);
    const clinic = await authController.getClinicById(person.clinicId);

    res.status(200).send({person, clinic});
  } catch (e) {
    res.status(200).send({ error: e });
  }
});


module.exports = router;
