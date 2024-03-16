const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const CommentSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now() },
  },
  {
    toJSON: { virtuals: true },
  }
);

CommentSchema.virtual("formatted_date").get(function () {
  return DateTime.fromJSDate(this.date).toUTC().toISO();
});

module.exports = mongoose.model("Comment", CommentSchema);
