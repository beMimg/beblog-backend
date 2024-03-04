const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  return res.json("get");
});

router.post("/", (req, res) => {
  return res.json("post");
});

router.put("/", (req, res) => {
  return res.json("put");
});

router.delete("/", (req, res) => {
  return res.json("delete");
});
