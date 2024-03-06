const mongoose = require("mongoose");
const Comment = require("../models/comment");
const Post = require("../models/post");

exports.post_comment = async (req, res, next) => {
  try {
    const comment = new Comment({
      author: req.user.user._id,
      post: req.params.post_id,
      text: req.body.text,
    });
    const existsPost = await Post.findById(req.params.post_id).exec();

    if (!existsPost) {
      return res.status(404).json({ message: "Post not found" });
    } else {
      await comment.save();
      return res.status(200).json({ comment: comment });
    }
  } catch (err) {
    return res.status(404).json({ message: "Post not found" });
  }
};
