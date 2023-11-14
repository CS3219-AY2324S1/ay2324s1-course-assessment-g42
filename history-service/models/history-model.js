const pool = require("../psql-db.js");

async function saveAttempt(username, collaborated, title, qnId, difficulty, language, attempt, date) {
    const result = await pool.query(
        `INSERT INTO history (username, collaborated, title, qnid, difficulty, language, attempt, date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,[username, collaborated, title, qnId, difficulty, language, attempt, date])
        .then(response =>
            console.log("Saving attempt to the database successfully"))
        .catch(error =>
            console.log("Error saving attempt to database", error));
    return result;
}

async function getHistory(username) {
    const result = await pool.query(
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
        console.log("Getting history from database successfully", username, formattedResults);
        return formattedResults;
    }).catch(error => {
        console.log("Error getting history from database", error);
    })
    return result;
}

module.exports = {
    saveAttempt,
    getHistory,
}