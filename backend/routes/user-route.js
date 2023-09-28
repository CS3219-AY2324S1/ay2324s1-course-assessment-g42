const express = require('express');
const router = express.Router();

const userController = require("../controllers/user-controller.js");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/delete", userController.deleteUser);
router.post("/updateUsername", userController.updateUsername);
router.post("/updatePassword", userController.updatePassword);
router.post("/findByEmail", userController.findByEmail);
router.post("/validateToken", userController.validateToken);

module.exports=router;