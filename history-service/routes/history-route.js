const express = require('express');
const router = express.Router();

const historyController = require("../controllers/user-controller.js");
const auth = require("../middleware/auth.js");

router.post("/saveAttempt", historyController.saveAttempt);
module.exports=router;