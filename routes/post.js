const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { authenticateToken, isAdmin } = require("../config/authenticate");
const commentsRouter = require("../routes/comment");
const { upload } = require("../middleware/multer");

router.get("/", postController.get_posts);

router.post(
  "/",
  authenticateToken,
  isAdmin,
  upload.single("img"),
  postController.post_post
);

router.get("/:post_id", authenticateToken, postController.get_post);

router.put("/:post_id", authenticateToken, isAdmin, postController.put_post);

router.delete(
  "/:post_id",
  authenticateToken,
  isAdmin,
  postController.delete_post
);

router.use("/:post_id/comments", commentsRouter);

module.exports = router;
