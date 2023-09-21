const express = require('express');
const router = express.Router();

const userController = require("../controllers/user-controller.js");

router.post("/register", userController.registerUser);

module.exports=router;