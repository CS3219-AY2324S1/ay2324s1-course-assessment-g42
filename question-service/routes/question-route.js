const express = require('express');
const router = express.Router();

const questionController = require("../controllers/question-controller.js");
const auth = require("../middleware/auth.js");

router.post("/getQuestions", auth, questionController.getQuestions);
router.post("/addQuestion", auth, questionController.addQuestion);
router.post("/deleteQuestion", auth, questionController.deleteQuestion);

module.exports = router;
