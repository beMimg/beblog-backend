const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const CommentSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    text: { type: String, required: true },
    date: { type: Date, required: true },
  },
  {
    toJSON: { virtuals: true },
  }
);

CommentSchema.virtual("formated_date").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_MED);
});

module.exports = mongoose.model("Comment", CommentSchema);
