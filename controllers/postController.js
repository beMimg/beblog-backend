const mongoose = require("mongoose");
const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

// get only published posts
exports.get_posts = async (req, res, next) => {
  try {
    const posts = await Post.find().exec();
  } catch (err) {
    return next(err);
  }
};

exports.post_post = [
  body("title").isLength({ min: 1, max: 30 }).escape(),
  body("text").isLength({ min: 1 }).escape(),
  body("isPublished").isBoolean().escape(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() });
      }

      const post = new Post({
        title: req.body.title,
        text: req.body.text,
        date: Date.now(),
        author: req.user.user._id,
        isPublished: req.body.isPublished,
      });

      await post.save();
      return res.status(200).json({ post: post });
    } catch (err) {
      return next(err);
    }
  },
];
