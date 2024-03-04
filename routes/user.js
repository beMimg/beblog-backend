const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  try {
    const usernames = await User.find(
      {},
      "first_name last_name username"
    ).exec();
    res.json(usernames);
  } catch (err) {
    return next(err);
  }
  // return res.json("get");
});

router.post("/", (req, res) => {
  return res.json("post");
});

router.get("/:id", (req, res) => {
  return res.json(`getting ${req.params.id} info`);
});

router.put("/:id", (req, res) => {
  return res.json(`update ${req.params.id}`);
});

router.delete("/:id", (req, res) => {
  return res.json(`delete ${req.params.id}`);
});

module.exports = router;
