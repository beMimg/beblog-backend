var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");

// routes
var indexRouter = require("./routes");
const userRouter = require("./routes/user");
const loginRouter = require("./routes/login");
const postRouter = require("./routes/post");

var app = express();

async function main() {
  try {
    console.log("trying connection to db");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("should be connected to db");
  } catch (err) {
    console.log("error");
  }
}
main();

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});

// view engine setup
app.use(limiter);
app.use(helmet());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(compression());

app.use("/api", indexRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/posts", postRouter);

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
