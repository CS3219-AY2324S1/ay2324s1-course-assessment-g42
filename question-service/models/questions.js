const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  id: Number,
  title: String,
  categories: Array,
  complexity: String,
  description: String,
  link: String
})

const QuestionModel = mongoose.model("questions", QuestionSchema);

module.exports = QuestionModel;