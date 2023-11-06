const express = require('express');
const router = express.Router();

const categoryController = require("../controllers/category-controller.js");
const auth = require("../middleware/auth.js");

router.get("/getCategories", auth, categoryController.getCategories);

module.exports = router;