const express = require("express");
const router = express.Router({ mergeParams: true });
const commentController = require("../controllers/commentController");
const { authenticateToken } = require("../config/authenticate");

router.get("/", authenticateToken, commentController.get_comments);

router.post("/", authenticateToken, commentController.post_comment);

module.exports = router;
