const express = require("express");
const router = express.Router();

const history = require("../models/history-model.js");

async function saveAttempt(req, res) {
    let { username, collaborated, title, qnId, difficulty, language, attempt, date } = req.body;
    try {
        const result = await history.saveAttempt(username, collaborated, title, qnId, difficulty, language, attempt, date);
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json(err)
    }
}

async function getHistory(req, res) {
    let {username} = req.body;
    try {
        const result = await history.getHistory(username);
        return res.status(200).json(result)
    } catch (err) {
        return res.satus(500).json(err);
    }
}

module.exports = {
    saveAttempt,
    getHistory,
};
