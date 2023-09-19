const pool = require("../psql-db.js");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

// Move the route logic to a function that can be used in user-route.js
async function registerUser(req, res) {
    let { name, email, password, password2 } = req.body;

    console.log({
        name,
        email,
        password,
        password2
    });
    let errors = [];
    if (password != password2) {
        errors.push({ message: "Passwords do not match" });
        res.render("register", { errors });
    } else {
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        // Check if the user with the provided email already exists in the database
        pool.query(
            `SELECT * FROM users
            WHERE email = $1`, [email], (err, result) => {
                if (err) {
                    throw err;
                }
                console.log(result.rows);
            }
        );
    }
}

module.exports = {
    registerUser,
};
