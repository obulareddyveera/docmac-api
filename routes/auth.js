var express = require("express");
var router = express.Router();
var authController = require("./../controller/auth");
/* GET users listing. */
router.get("/duplicate/:selector", async (req, res, next) => {
  const result = await authController.getPersonsBySelector(
    req.params.selector,
    req.query
  );

  console.log("/duplicate/email", req.params.selector, req.query);
  res.json({
    query: req.query,
    data: result,
  });
});

router.post("/register", async (req, res, next) => {
  const payload = req.body;
  console.log("/register", payload);
  const clinic = await authController.registerClinic(payload);
  // const result = await authController.insPerson(req.params.selector, req.query.data);
  res.json({ ...clinic });
});

module.exports = router;
