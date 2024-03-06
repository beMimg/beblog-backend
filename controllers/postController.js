const mongoose = require("mongoose");
const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

// get only published posts
exports.get_posts = async (req, res, next) => {
  try {
    const posts = await Post.find({}, "title date author")
      .populate({ path: "author", select: "first_name last_name username" })
      .exec();

    if (posts) {
      return res.status(200).json({ posts: posts });
    } else {
      return res
        .status(404)
        .json({ message: "Published posts are 0 at the moment." });
    }
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

exports.get_post = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.post_id);
    return res.status(200).json({ post: post });
  } catch (err) {
    return res.status(404).json({ message: "Post not found" });
  }
};

exports.put_post = [
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
        _id: req.params.post_id,
        title: req.body.title,
        text: req.body.text,
        date: Date.now(),
        author: req.user.user._id,
        isPublished: req.body.isPublished,
      });

      await Post.findByIdAndUpdate(req.params.post_id, post, {});
      return res.status(200).json({ post: post });
    } catch (err) {
      return res.status(404).json({ message: "Post not found" });
    }
  },
];

exports.delete_post = async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.post_id);
    res.status(200).json({ message: `Post ${req.params.post_id} was deleted` });
  } catch (err) {
    return res.status(404).json({ message: "Post not found" });
  }
};
