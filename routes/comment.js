const express = require("express");
const router = express.Router({ mergeParams: true });
const commentController = require("../controllers/commentController");
const { authenticateToken } = require("../config/authenticate");

router.get("/", (req, res, next) => {
  res.send(req.params.post_id);
});

router.post("/", authenticateToken, commentController.post_comment);

module.exports = router;
