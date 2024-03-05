const express = require("express");
const router = express.Router();
const User = require("../models/user");
var jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

router.post("/", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(404).json("Incorrect password.");
    }

    jwt.sign({ user: user }, process.env.SECRET_KEY, (err, token) => {
      res.json({
        token: token,
      });
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
