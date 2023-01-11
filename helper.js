const jwt = require("jsonwebtoken");
const isAuthenticated = (req, res, next) => {
  try {
    let token = req.get("Authorization");
    if (!token) {
      return res.status(403).json({
        success: false,
        msg: "Token not found",
      });
    }
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.accessSecret);
    req.personId = decoded.personId;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, msg: error.message });
  }
};

function verifyRefresh(personId, token) {
  try {
    const decoded = jwt.verify(token, process.env.refreshSecret);
    return parseInt(decoded.personId) === parseInt(personId);
  } catch (error) {
    console.error(error);
    return false;
  }
}
module.exports = { isAuthenticated, verifyRefresh };
