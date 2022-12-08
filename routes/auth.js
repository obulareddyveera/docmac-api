var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
var authController = require("./../controller/auth");
/* GET users listing. */
router.get("/duplicate/:selector", async (req, res, next) => {
  try {
    const result = await authController.getPersonsBySelector(
      req.params.selector,
      req.query
    );
    res.status(200).send({
      query: req.query,
      data: result,
    });
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const payload = req.body;
    console.log('/login ', payload)
    const personEntity = await authController.getPersonByEmailPwd(
      payload.email,
      payload.password
    );
    console.log('/login ', personEntity)
    if (personEntity && personEntity.id) {
      const person = await authController.getPersonById(personEntity.id);
      const clinic = await authController.getClinicByPersonId(personEntity.id);

      const tokens = {};
      const { accessSecret, refreshSecret } = process.env;
      if (accessSecret && refreshSecret) {
        tokens.accessToken = jwt.sign(
          { id: person.id, email: person.email, clinicId: clinic.id },
          accessSecret,
          {
            expiresIn: "2m",
          }
        );
        tokens.refreshToken = jwt.sign(
          { id: person.id, email: person.email, clinicId: clinic.id },
          refreshSecret,
          {
            expiresIn: "10m",
          }
        );
      }
      res.status(201).send({ person, clinic, tokens });
    } else {
      res.status(401).send({ status: 401, msg: "Invalid Credentials" });
    }
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const payload = req.body;
    console.log("/register", payload);
    const personEntity = await authController.registerClinic(payload);
    const person = await authController.getPersonById(personEntity.id);
    const clinic = await authController.getClinicByPersonId(personEntity.id);

    const tokens = {};
    const { accessSecret, refreshSecret } = process.env;
    if (accessSecret && refreshSecret) {
      tokens.accessToken = jwt.sign(
        { id: person.id, email: person.email, clinicId: clinic.id },
        accessSecret,
        {
          expiresIn: "2m",
        }
      );
      tokens.refreshToken = jwt.sign(
        { id: person.id, email: person.email, clinicId: clinic.id },
        refreshSecret,
        {
          expiresIn: "10m",
        }
      );
    }

    res.status(201).send({ person, clinic, tokens });
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

module.exports = router;
