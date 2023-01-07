var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
var authController = require("./../controller/auth");
const { verifyRefresh } = require("./../helper");
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
    console.log("/login ", payload);
    let personEntity = {}
    if (payload.isEmailAcceptedSignIn) {
      personEntity = await authController.getPersonByEmailPwd(
        payload.email,
        payload.password
      );
    } else {
      personEntity = await authController.getPersonByMobilePwd(
        payload.mobileNumber,
        payload.password
      );
    }
    
    console.log("/login ", personEntity);
    if (personEntity && personEntity.id) {
      const person = await authController.getPersonById(personEntity.id);
      const clinic = await authController.getClinicByPersonId(personEntity.id);

      const tokens = {};
      const { accessSecret, refreshSecret } = process.env;
      if (accessSecret && refreshSecret) {
        tokens.accessToken = jwt.sign(
          {
            personId: person[0].id,
          },
          accessSecret,
          { expiresIn: "30m" }
        );
        tokens.refreshToken = jwt.sign(
          {
            personId: person[0].id,
          },
          refreshSecret,
          { expiresIn: "1h" }
        );
      }
      res.status(201).send({ person, clinic, tokens });
    } else {
      res.status(401).send({ status: 401, msg: "Invalid Credentials" });
    }
  } catch (e) {
    console.log('--== /login -- 500 ', e);
    res.status(500).send({ error: e });
  }
});

router.post("/refresh", (req, res) => {
  const { personId, refreshToken } = req.body;
  const isValid = verifyRefresh(personId, refreshToken);
  if (!isValid) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid token,try login again" });
  }
  const accessToken = jwt.sign(
    {
      personId,
    },
    process.env.accessSecret,
    { expiresIn: "30m" }
  );
  return res.status(200).json({ success: true, accessToken });
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
