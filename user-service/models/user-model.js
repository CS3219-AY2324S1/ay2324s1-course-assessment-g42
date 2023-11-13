const pool = require("../psql-db.js");

async function getUsersByEmail(email) {
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result;
    } catch (error) {
        throw error;
    }
}
async function getUsersByUsername(username) {
    try {
        const result = await pool.query(`SELECT * FROM users
        WHERE username = $1`, [username]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function createNewUser(username, email, hash, role) {
    try {
        const result = await pool.query(`INSERT INTO users (username, email, password, role)
            values ($1, $2, $3, $4)`, [username, email, hash, role]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function deleteUserByEmail(email) {
    try {
        const result = await pool.query(`DELETE FROM users WHERE email = $1`, [email]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function updateUsernameByEmail(newUsername, email) {
    try {
        const result = await pool.query(`UPDATE users SET username=$1 WHERE email=$2`, [newUsername, email])
        return result;
    } catch (error) {
        throw error;
    }
}

async function updatePasswordByEmail(hash, email) {
    try {
        const result = await pool.query(`UPDATE users SET password=$1 WHERE email=$2`, [hash, email]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function updateRoleByUsername(newRole, username) {
    try {
        const result = await pool.query(`UPDATE users SET role=$1 WHERE username=$2`, [newRole, username]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function getAllUsers() {
    try {
        const result = await pool.query(`SELECT * FROM users`);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getUsersByEmail,
    getUsersByUsername,
    createNewUser,
    deleteUserByEmail,
    updateUsernameByEmail,
    updatePasswordByEmail,
    updateRoleByUsername,
    getAllUsers
}