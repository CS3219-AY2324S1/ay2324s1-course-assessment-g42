const express = require('express');
const router = express.Router();

const historyController = require("../controllers/history-controller.js");

router.post("/saveAttempt", historyController.saveAttempt);
router.post("/getHistory", historyController.getHistory);

module.exports=router;