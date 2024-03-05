const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BLACK_LISTED_TOKEN_SCHEMA = new Schema({
  token: { type: String, required: true },
});

module.exports = mongoose.model(
  "black_listed_tokens",
  BLACK_LISTED_TOKEN_SCHEMA
);
