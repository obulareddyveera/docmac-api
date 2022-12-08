var express = require("express");
var router = express.Router();
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
    res.status(500).send({error: e});
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const payload = req.body;
    console.log("/register", payload);
    const clinic = await authController.registerClinic(payload);
    res.status(201).send({ ...clinic });
  } catch (e) {
    res.status(500).send({error: e});
  }
});

module.exports = router;
