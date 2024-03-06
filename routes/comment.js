const express = require("express");
const router = express.Router({ mergeParams: true });
const commentController = require("../controllers/commentController");
const { authenticateToken, isAdmin } = require("../config/authenticate");

router.get("/", authenticateToken, commentController.get_comments);

router.post("/", authenticateToken, commentController.post_comment);

router.get("/:comment_id", authenticateToken, commentController.get_comment);

router.put("/:comment_id", authenticateToken, commentController.put_comment);

router.delete(
  "/:comment_id",
  authenticateToken,
  isAdmin,
  commentController.delete_comment
);
module.exports = router;
