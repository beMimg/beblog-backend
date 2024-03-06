const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { authenticateToken } = require("../config/authenticate");

router.get("/", postController.get_posts);

router.post("/", authenticateToken, postController.post_post);

module.exports = router;
