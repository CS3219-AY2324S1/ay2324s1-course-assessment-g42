const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  count: Number,
  category: String
})

const CategoryModel = mongoose.model("categories", CategorySchema);

module.exports = CategoryModel;