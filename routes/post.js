const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { authenticateToken, isAdmin } = require("../config/authenticate");

router.get("/", postController.get_posts);

router.post("/", authenticateToken, isAdmin, postController.post_post);

router.get("/:id", authenticateToken, postController.get_post);

router.put("/:id", authenticateToken, isAdmin, postController.put_post);

router.delete("/:id", authenticateToken, isAdmin, postController.delete_post);

module.exports = router;
