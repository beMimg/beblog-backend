const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  isPublished: { type: Boolean, required: true },
  topic: { type: String, required: true },
});

PostSchema.virtual("url").get(function () {
  return `/api/posts/${this._id}`;
});

module.exports = mongoose.model("Post", PostSchema);
