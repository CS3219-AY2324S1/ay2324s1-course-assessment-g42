const express = require("express");
const router = express.Router();

const history = require("../models/history-model.js");

async function saveAttempt(req, res) {
    let { username, collaborated, title, qnId, difficulty, language, attempt, date } = req.body;

    const result = await history.saveAttempt(username, collaborated, title, qnId, difficulty, language, attempt, date);
    return result;
}

async function getHistory(req, res) {
    let {username} = req.body;
    const result = await history.getHistory(username);
    return result;
}

module.exports = {
    saveAttempt,
    getHistory,
};
