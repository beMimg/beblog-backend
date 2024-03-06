require("dotenv").config();
const jwt = require("jsonwebtoken");
const BLACK_LISTED_TOKEN = require("../models/black_listed_tokens");
const User = require("../models/user");

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return res.sendStatus(401);
  if ((await isTokenBlackListed(token)) === true) {
    return res.status(401).json({ message: "Token is blacklisted." });
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

exports.invalidateToken = async (token) => {
  try {
    console.log(token);
    const existesBlackListToken = await BLACK_LISTED_TOKEN.findOne({
      token: token,
    });
    if (existesBlackListToken) {
      return;
    }
    const newToken = new BLACK_LISTED_TOKEN({ token: token });
    await newToken.save();
    console.log("token added to blacklist");
    return;
  } catch (err) {
    return next(err);
  }
};

async function isTokenBlackListed(token) {
  try {
    token = "Bearer" + " " + token;
    const isTokenBlackListed = await BLACK_LISTED_TOKEN.find({
      token: token,
    });
    if (isTokenBlackListed.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return next(err);
  }
}

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.user._id, "admin");

    if (user && user.admin === true) {
      return next();
    } else {
      return res.status(401).json({ message: "Only admins can create posts" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
