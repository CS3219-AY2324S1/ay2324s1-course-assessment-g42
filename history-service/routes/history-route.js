const express = require('express');
const router = express.Router();

const historyController = require("../controllers/history-controller.js");
const auth = require('../middleware/auth.js')
router.post("/saveAttempt", auth, historyController.saveAttempt);
router.post("/getHistory", auth, historyController.getHistory);
router.post("/deleteHistory", auth, historyController.deleteHistory);

module.exports=router;