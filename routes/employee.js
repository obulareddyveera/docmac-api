var express = require("express");
var router = express.Router();
var employeeController = require("./../controller/employee");

/* GET home page. 
{"clinicName":"uip","clinicAddress":"B405 Signature Classic Apartment Sompura Village Ambalipura-Sarjapura road","clinicServices":[{"name":"General","colour":"#10A19D","price":800}],"personRoles":[{"name":"Admin","colour":"#BB1924"}],"primaryContactName":"Veera Reddy Obulareddy","primaryContactMobile":"08105555322","primaryContactEmail":"obulareddy.veera@gmail.com","primaryContactPassword":"123456789"}
{
    email: "deepthi.juni@gmail.com",
    name: "Deepthi Juni",
    mobile: "9440949111",
    password: "123456789",
    Privs: {
        create: [{"name":"leaveApproval","colour":"#BB1924"}, {"name":"orderRequest","colour":"#BB1924"}, {"name":"viewAccounts","colour":"#BB1924"}],
    },    
}
*/
router.get("/employee", async (req, res) => {
  try {
    const result = await employeeController.getAllEmployee();
    res.status(200).send({
      data: result,
    });
  } catch (e) {
    console.log("/employee GET::catch ", e);
    res.status(500).send({ error: e });
  }
});

router.get("/employee/:personId", async (req, res) => {
  try {
    const result = await employeeController.getEmployeeById(
      req.params.personId
    );
    res.status(200).send({
      data: result,
    });
  } catch (e) {
    console.log("/employee GET::catch ", e);
    res.status(500).send({ error: e });
  }
});

router.post("/employee", async (req, res) => {
  try {
    const payload = req.body;
    console.log("/employee", payload);
    const result = await employeeController.createEmployee(payload);
    res.status(200).send({
      data: result,
    });
  } catch (e) {
    console.log("/employee POST::catch ", e);
    res.status(500).send({ error: e });
  }
});
router.put("/employee/:personId", async (req, res) => {
  try {
    const payload = req.body;
    console.log("/employee", payload);
    const result = await employeeController.updateEmployee(
      req.params.personId,
      payload
    );
    res.status(200).send({
      data: result,
    });
  } catch (e) {
    console.log("/employee POST::catch ", e);
    res.status(500).send({ error: e });
  }
});
router.delete("/employee/:personId", async (req, res, next) => {
  try {
    const payload = req.body;
    console.log("/employee", payload);
    const result = await employeeController.deleteEmployee(req.params.personId);
    res.status(200).send({
      data: result,
    });
  } catch (e) {
    console.log("/employee POST::catch ", e);
    res.status(500).send({ error: e });
  }
});

module.exports = router;
