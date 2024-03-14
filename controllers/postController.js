const mongoose = require("mongoose");
const Post = require("../models/post");
const { body, validationResult } = require("express-validator");
const fs = require("fs").promises;
const path = require("path");

// get only published posts
exports.get_posts = async (req, res, next) => {
  try {
    const posts = await Post.find(
      { isPublished: true },
      "title date text author formated_date topic"
    )
      .populate({ path: "author", select: "first_name last_name username" })
      .sort({ date: -1 })
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
  body("text").isLength({ min: 1 }),
  body("isPublished").isBoolean().escape(),
  body("topic").isLength({ min: 1 }).escape(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() });
      }

      const imgData = await fs.readFile(
        path.join(__dirname, "../images", req.file.filename)
      );

      const post = new Post({
        title: req.body.title,
        text: req.body.text,
        date: Date.now(),
        author: req.user.user._id,
        isPublished: req.body.isPublished,
        topic: req.body.topic,
        img: {
          data: imgData,
          contentType: req.file.mimetype,
        },
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
    const post = await Post.findById(req.params.post_id)
      .populate({
        path: "author",
        select: "username",
      })
      .exec();

    const imgData = post.img.data.toString("base64");
    const imgSrc = `data:${post.img.contentType};base64,${imgData}`;

    const postWithImgSrc = {
      ...post.toJSON(),
      imgSrc: imgSrc,
    };

    // Send the modified post object as the response
    return res.status(200).json({ post: postWithImgSrc });
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
