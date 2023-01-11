const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require('body-parser')
const webpush = require('web-push')

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const tokenRouter = require("./routes/token");
const employeeRouter = require("./routes/employee");
const usersRouter = require("./routes/users");
const whatsappRouter = require("./routes/whatsapp");
const webWhatsappRouter = require("./routes/web-whatsapp");
const { verifyRefresh, isAuthenticated } = require("./helper");
require('dotenv').config()
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(bodyParser.json())
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
const jwt = require("jsonwebtoken");
webpush.setVapidDetails(process.env.WEB_PUSH_CONTACT, process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY)

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/api/employee", isAuthenticated, employeeRouter);
app.use("/users", usersRouter);
app.use("/whatsapp", whatsappRouter);
app.use("/token", tokenRouter)
app.use("/api/web-whatsapp", webWhatsappRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
