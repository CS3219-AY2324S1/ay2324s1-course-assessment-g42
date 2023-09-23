const express = require('express');
const router = express.Router();

const questionController = require("../controllers/question-controller.js");

router.post("/getQuestions", questionController.getQuestions);
router.post("/addQuestion", questionController.addQuestion);
router.post("/deleteQuestion", questionController.deleteQuestion);

module.exports = router;
