const pool = require("../psql-db.js");
const express = require("express");
const router = express.Router();

async function saveAttempt(req, res) {
    let { user1, user2, qnId, attempt, date } = req.body;

    console.log ({
        user1, user2, qnId, attempt, date
    });

    // Check if email already registered
    pool.query(
        `INSERT INTO history (user1, user2, qnid, attempt, date)
        VALUES ($1, $2, $3, $4, $5)`,[user1, user2, qnId, attempt, date])
        .then(response =>
            console.log("saving attempt to the database successfully"))
        .catch(error =>
            console.log("Error saving attempts to database", error));
}

async function getHistory(req, res) {
    let {username} = req.body;
    pool.query(
        `SELECT id, qnid, attempt, date, 
            CASE 
                WHEN user1 = $1 THEN user2
                ELSE user1
            END AS collaborated
        FROM history
        WHERE user1 = $1 OR user2 = $1
        ORDER BY date DESC;`, [username]
    ).then(response => {
        const formattedResults = response.rows.map(row => ({
            id: row.id,
            qnId: row.qnid,
            attempt: row.attempt,
            date: row.date.toDateString(), // Assuming date is stored as a timestamp
            collaborated: row.collaborated
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
