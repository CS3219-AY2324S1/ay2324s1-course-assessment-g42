const pool = require("../psql-db.js");
const express = require("express");
const router = express.Router();

async function registerUser(req, res) {
    let { username, email, password, password2 } = req.body;

    console.log ({
        username, email, password, password2
    });

    if (password != password2) {
        return res.status(400).json({
            error: "Passwords do not match",
        });
    }
    if (password.length < 8) {
        return res.status(400).json({
            error: "Password not long enough"
        })
    }

    // Check if the user with the provided email already exists in the database
    pool.query(
        `SELECT * FROM users
        WHERE email = $1`, [email], (err, result) => {
            if (err) {
                throw err;
            }
            if (result.rows.length > 0) {
                return res.status(400).json({
                    error: "Email already exists."
                });
            }
            //register user
            pool.query(
                `INSERT INTO users (username, email, password) 
                VALUES ($1, $2, $3)`, [username, email, password], (err) => {
                    if (err) {
                        throw err;
                    } else {
                        return res.status(200).json({username, email});
                    }
                }
            )
        }
    )
}

async function loginUser (req, res) {
    let  { email, password } = req.body;
    pool.query( 
        `SELECT * FROM users WHERE email = $1`, [email], (err, result) => {
            if (result.rows.length == 0) {
                return res.status(400).json({
                    error: "User does not exist."
                });
            } else if (result.rows.length > 0) {
                const user = result.rows[0];
                if (user.password == password) {
                    return res.status(200).json({ user });
                } else {
                    return res.status(401).json({
                        error: "incorrect password"
                    });
                }
            }
        }
    )
}

async function deleteUser (req, res) {
    let { email } = req.body;

    pool.query(
        `DELETE FROM users WHERE email = $1`, [email], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                return res.status(200).send({message: "user deleted successfully"});
            }
        }
    )
}

async function updateUser (req, res) {
    let {newUsername, newPassword, email} = req.body;
    pool.query(
        `UPDATE users SET username=$1, password=$2 WHERE email=$3`, [newUsername, newPassword, email], (error, result) => {
            if (error) {
                console.log(error);
            } else {
                return res.status(200).send({message: "account details updated successfully"});
            }
        }
    )
}

async function findByEmail (req, res) {
    let { email } = req.body;
    pool.query(
        `SELECT * FROM users WHERE email=$1`, [email], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result.rows.length >0) {
                    const user = result.rows[0];
                    console.log(user);
                    return res.status(200).json({user});
                } else {
                    return res.status(400);
                }
            }
        }   
    )
}

module.exports = {
    registerUser,
    loginUser,
    deleteUser,
    updateUser,
    findByEmail,
};
