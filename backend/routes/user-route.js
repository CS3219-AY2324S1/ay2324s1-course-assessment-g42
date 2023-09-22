const express = require('express');
const router = express.Router();

const userController = require("../controllers/user-controller.js");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/delete", userController.deleteUser);
router.post("/update", userController.updateUser);
router.post("/findByEmail", userController.findByEmail);

module.exports=router;