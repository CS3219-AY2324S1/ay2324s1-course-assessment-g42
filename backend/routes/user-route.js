const express = require('express');
const router = express.Router();

const userController = require("../controllers/user-controller.js");
const auth = require("../middleware/auth.js");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/delete", auth, userController.deleteUser);
router.post("/updateUsername", auth, userController.updateUsername);
router.post("/updatePassword", auth, userController.updatePassword);
router.post("/updateRole", auth, userController.updateRole);
router.post("/findByEmail", auth, userController.findByEmail);
router.post("/getUsers", auth, userController.getUsers);
router.post("/clearCookie", userController.clearCookie);

module.exports=router;