require("../mongo-db");
const CategoryModel = require('../models/categories.js');

async function getCategories(req, res) {
  try {
    const result = await CategoryModel.find();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
}

module.exports = { 
  getCategories,
};
