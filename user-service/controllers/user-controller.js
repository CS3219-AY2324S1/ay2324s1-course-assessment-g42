const pool = require("../psql-db.js");
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
    let { username, email, password, password2, role } = req.body;

    console.log ({
        username, email, password, password2, role
    });

    // Check if email already registered
    pool.query(
        `SELECT * FROM users
        WHERE email = $1`, [email], (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: "An error occurred while checking for email existence."
                });
            }
    
            if (result.rows.length > 0) {
                return res.status(409).json({
                    error: "Email already exists."
                });
            }
        
            // Check if username already taken
            pool.query(
                `SELECT * FROM users
                WHERE username = $1`, [username], (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            error: "An error occurred while checking for username existence."
                        });
                    }
            
                    if (result.rows.length > 0) {
                        return res.status(422).json({
                            error: "Username already exists."
                        });
                    }    
                    // Continue with the registration process if the email and username not found
                    // Check password length < 8
                    if (password.length < 8) {
                        return res.status(403).json({
                            error: "Password not long enough"
                        });
                    }
                    
                    // Check that passwords match
                    if (password !== password2) {
                        return res.status(400).json({
                            error: "Passwords do not match",
                        });
                    }

                    // Register user
                    pool.query(
                        `INSERT INTO users (username, email, password, role) 
                        VALUES ($1, $2, $3, $4)`, [username, email, password, role], (err) => {
                            if (err) {
                                return res.status(500).json({
                                    error: "Failed to register user."
                                });
                            } else {
                                return res.status(200).json({ username, email });
                            }
                        }
                    );
                }
            );
        }
    );
}



async function loginUser (req, res) {
  let  { email, password } = req.body;
  pool.query( 
    `SELECT * FROM users WHERE email = $1`, [email], (err, result) => {
      if (result.rows.length == 0) {
        return res.status(404).json({
          error: "User does not exist."
        });
      } else if (result.rows.length > 0) {
        const user = result.rows[0];
        if (user.password == password) {
            let jwtSecretKey = process.env.JWT_SECRET_KEY;
            let data = {
                email: email,
                password: password,
            };
            
            const token = jwt.sign(data, jwtSecretKey, {expiresIn: '5d'});
            
            return res.cookie("token", token, {
                path: '/',
                httpOnly: true,
                maxAge : 7 * 24 * 60 * 60 * 1000 // 7 days expiry
            }).status(200).json({user});
        } else {
          return res.status(422).json({
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
                return res.status(500).send({error: "error deleting account"});
            } else {
                res.clearCookie('token');
                return res.status(200).send({message: "user deleted successfully"});
            }
        }
    )
}

async function updateUsername (req, res) {
    let {newUsername, email} = req.body;
    pool.query(
        `SELECT * FROM users
        WHERE username = $1`, [newUsername], (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: "An error occurred while checking for username existence."
                });
            }
    
            if (result.rows.length > 0) {
                return res.status(422).json({
                    error: "Username already exists."
                });
            }  

            pool.query(
                `UPDATE users SET username=$1 WHERE email=$2`,
                [newUsername, email],
                (error, result) => {
                    if (error) {
                        return res.status(500).send({ message: "Error updating username" });
                    } else {
                        pool.query(
                            `SELECT * FROM users WHERE email = $1`, [email], (err, result) => {
                                if (err) {
                                    return res.status(500).send({ message: "Error updating username" });
                                }
                                const user = result.rows[0];
                                return res.status(200).json({ user });
                            }
                        )
                    }
                }
            );
        }
    );
}

async function updatePassword (req, res) {
    let {newPassword, email} = req.body;
    
    if (newPassword.length < 8) {
        return res.status(403).json({
            error: "New password too short"
        })
    }
    pool.query(
        `UPDATE users SET password=$1 WHERE email=$2`,
        [newPassword, email],
        (error, result) => {
            if (error) {
                return res.status(500).send({ message: "Error updating password" });
            } else {
                pool.query(
                    `SELECT * FROM users WHERE email = $1`, [email], (err, result) => {
                        if (err) {
                            return res.status(500);
                        }
                        const user = result.rows[0];
                        return res.status(200).json({ user });
                    }
                )
            }
        }
    );
}

async function updateRole (req, res) {
    let {username, newRole} = req.body;
    console.log("Change to: " + newRole);

    pool.query(
        `UPDATE users SET role=$1 WHERE username=$2`,
        [newRole, username],
        (error, result) => {
            if (error) {
                return res.status(500).send({message: "Error updating role"});
            } else {
                return getUsers(req, res);
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
            return res.status(500);
        } else {
            if (result.rows.length >0) {
                const user = result.rows[0];
                console.log(user);
                return res.status(200).json({user});
            } else {
                return res.status(404);
            }
        }
        }
    )
}

async function getUsers (req, res) {

    pool.query(
        `SELECT * FROM users`, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500);
            } else {
                if (result.rows.length > 0) {
                    return res.status(200).json(result.rows);
                } else {
                    return res.status(404);
                }
            }
        })
}

async function clearCookie(req, res) {
    res.clearCookie('token');
    return res.status(200).send({message: "logged out successfully"});
}

module.exports = {
    registerUser,
    loginUser,
    deleteUser,
    updateUsername,
    updatePassword,
    updateRole,
    findByEmail,
    getUsers,
    clearCookie
};
