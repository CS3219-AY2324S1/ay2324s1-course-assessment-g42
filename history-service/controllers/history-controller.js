const pool = require("../psql-db.js");
const express = require("express");
const router = express.Router();

async function saveAttempt(req, res) {
    let { username, collaborated, title, qnId, difficulty, language, attempt, date } = req.body;

    console.log ("save!");
    pool.query(
        `INSERT INTO history (username, collaborated, title, qnid, difficulty, language, attempt, date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,[username, collaborated, title, qnId, difficulty, language, attempt, date])
        .then(response =>
            console.log("saving attempt to the database successfully"))
        .catch(error =>
            console.log("Error saving attempts to database", error));
}

async function getHistory(req, res) {
    let {username} = req.body;
    pool.query(
        `SELECT id, qnid, attempt, date, collaborated, title, difficulty, language
        FROM history
        WHERE username=$1
        ORDER BY date DESC;`, [username]
    ).then(response => {
        const formattedResults = response.rows.map(row => ({
            id: row.id,
            qnId: row.qnid,
            attempt: row.attempt,
            date: row.date.toDateString(), // Assuming date is stored as a timestamp
            collaborated: row.collaborated,
            title: row.title,
            difficulty: row.difficulty,
            language: row.language
        }));
        res.json(formattedResults);
        console.log("Getting history from database successfully", username, formattedResults);
    }).catch(error => {
        console.log("Error getting history from database", error);
    })
}

module.exports = {
    saveAttempt,
    getHistory,
};
