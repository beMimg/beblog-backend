const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    date: { type: Date, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isPublished: { type: Boolean, required: true },
    topic: { type: String, required: true },
    img: { data: Buffer, contentType: String },
  },
  {
    toJSON: { virtuals: true },
  }
);

PostSchema.virtual("formated_date").get(function () {
  return DateTime.fromJSDate(this.date).toISODate(DateTime.DATETIME_MED);
});

module.exports = mongoose.model("Post", PostSchema);
