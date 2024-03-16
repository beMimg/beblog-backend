const mongoose = require("mongoose");
const Comment = require("../models/comment");
const Post = require("../models/post");
const { body, validationResult } = require("express-validator");
const { DateTime } = require("luxon");

exports.get_comments = async (req, res, next) => {
  try {
    const comments = await Comment.find(
      { post: req.params.post_id },
      "text author date"
    )
      .populate({ path: "author", select: "username color" })
      .sort({ date: -1 })
      .exec();

    if (!comments) {
      return res.status(404).json({ message: "This post has no comments" });
    } else {
      return res.status(200).json({ comments: comments });
    }
  } catch (err) {
    return res.status(404).json({ message: "Post not found" });
  }
};

exports.post_comment = [
  body("text").isLength({ max: 200 }).escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    try {
      const comment = new Comment({
        author: req.user.user._id,
        post: req.params.post_id,
        text: req.body.text,
        date: Date.now(),
      });
      const existsPost = await Post.findById(req.params.post_id).exec();

      if (!existsPost) {
        return res.status(404).json({ message: "Post not found" });
      } else {
        await comment.save();
        return res.status(200).json({ comment: comment });
      }
    } catch (err) {
      return next(err);
    }
  },
];

exports.get_comment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.comment_id)
      .populate({
        path: "author",
        select: "username color",
      })
      .exec();

    const existsPost = await Post.findById(req.params.post_id, "_id");

    if (comment.author._id === req.user.user._id) {
      return console.log("not the same");
    }

    if (existsPost === null) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({ comment: comment });
  } catch (err) {
    return res.status(404).json({ message: "Comment not found" });
  }
};

exports.put_comment = async (req, res, next) => {
  try {
    const existsPost = await Post.findById(req.params.post_id, "_id");
    const comment = await Comment.findById(req.params.comment_id);

    if (existsPost === null) {
      return res.status(404).json({ message: "Post not found" });
    }

    const commentAuthor = comment.author._id.valueOf();
    if (commentAuthor !== req.user.user._id) {
      return res
        .status(401)
        .json({ message: "You are not the author of this comment" });
    }

    if (req.body.text.length === 0) {
      return res
        .status(401)
        .json({ message: "Edit comment must have a value" });
    }

    const newComment = new Comment({
      _id: comment._id,
      author: comment.author,
      post: comment.post,
      text: req.body.text,
      date: comment.date,
    });

    await Comment.findByIdAndUpdate(req.params.comment_id, newComment, {});
    return res.status(200).json({ newComment: newComment });
  } catch (err) {
    return res.status(404).json({ message: "Comment not found" });
  }
};

exports.delete_comment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.comment_id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    await Comment.findByIdAndDelete(req.params.comment_id);

    return res
      .status(200)
      .json({ message: `Comment ${req.params.comment_id} is deleted` });
  } catch (err) {
    return next(err);
  }
};

exports.get_comments_count = async (req, res, next) => {
  try {
    const existsPost = await Post.findById(req.params.post_id);

    if (existsPost === null) {
      return res.status(404).json({ message: "Post not found" });
    }

    const commentsCount = await Comment.find({
      post: req.params.post_id,
    }).countDocuments();

    return res.status(200).json({ commentsCount: commentsCount });
  } catch (err) {
    return res.status(404).json({ message: "Comment not found" });
  }
};
