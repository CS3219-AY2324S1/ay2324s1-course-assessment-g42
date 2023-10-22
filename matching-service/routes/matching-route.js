const express = require('express');
const router = express.Router();

const matchController = require("../controllers/match-controller.js");
const auth = require("../middleware/auth.js");

router.post("/find-match", auth, matchController.sendMatchingRequest);

module.exports = router;
