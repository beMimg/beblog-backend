const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.get_users);

router.post("/", userController.post_user);

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
