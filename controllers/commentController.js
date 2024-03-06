const mongoose = require("mongoose");
const Comment = require("../models/comment");
const Post = require("../models/post");

exports.get_comments = async (req, res, next) => {
  try {
    const comments = await Comment.find(
      { post: req.params.post_id },
      "text author date"
    )
      .populate({ path: "author", select: "username" })
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

exports.post_comment = async (req, res, next) => {
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
};

exports.get_comment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.comment_id);
    const existsPost = await Post.findById(req.params.post_id, "_id");

    if (comment.author._id === req.user.user._id) console.log("not the same");
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
