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
                return res.status(403).json({
                    error: "An error occurred while checking for email existence."
                });
            }
    
            if (result.rows.length > 0) {
                return res.status(402).json({
                    error: "Email already exists."
                });
            }

            // Continue with the registration process if the email is not found
            // Check password length < 8
            if (password.length < 8) {
                return res.status(401).json({
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
                        return res.status(403).json({
                            error: "Failed to register user."
                        });
                    } else {
                        const token = jwt.sign(
                            { username : username, email: email },
                            process.env.JWT_SECRET_KEY,
                            {
                              expiresIn: "2h",
                            }
                          );

                        return res.status(200).json({ username, email, token });
                    }
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
        return res.status(400).json({
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
            return res.status(200).json({ 
                user: user,
                token: token
            });
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
                return res.status(400).send({error: "error deleting account"});
            } else {
                return res.status(200).send({message: "user deleted successfully"});
            }
        }
    )
}

async function updateUsername (req, res) {
    let {newUsername, email} = req.body;

    pool.query(
        `UPDATE users SET username=$1 WHERE email=$2`,
        [newUsername, email],
        (error, result) => {
            if (error) {
                return res.status(400).send({ message: "Error updating username" });
            } else {
                pool.query(
                    `SELECT * FROM users WHERE email = $1`, [email], (err, result) => {
                        if (err) {
                            return res.status(400).send({ message: "Error updating username" });
                        }
                        const user = result.rows[0];
                        return res.status(200).json({ user });
                    }
                )
            }
        }
    );
}

async function updatePassword (req, res) {
    let {newPassword, email} = req.body;
    
    if (newPassword.length < 8) {
        return res.status(401).json({
            error: "New password too short"
        })
    }
    pool.query(
        `UPDATE users SET password=$1 WHERE email=$2`,
        [newPassword, email],
        (error, result) => {
            if (error) {
                return res.status(400).send({ message: "Error updating password" });
            } else {
                pool.query(
                    `SELECT * FROM users WHERE email = $1`, [email], (err, result) => {
                        if (err) {
                            return res.status(402);
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
                return res.status(400).send({message: "Error updating role"});
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

async function getUsers (req, res) {

    pool.query(
        `SELECT * FROM users`, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result.rows.length > 0) {
                    return res.status(200).json(result.rows);
                } else {
                    return res.status(400) // chng to show that there are no users
                }
            }
        })
}

async function validateToken (req, res, next) {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
  
    try {
        const token = req.header(tokenHeaderKey);
  
        const verified = jwt.verify(token, jwtSecretKey);
        if(verified){
            next();
            return;
        }else{
            // Access Denied
            return res.status(401).send({error: 'Invalid token'});
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send({error: 'Invalid token'});
    }
}


module.exports = {
    registerUser,
    loginUser,
    deleteUser,
    updateUsername,
    updatePassword,
    updateRole,
    findByEmail,
    validateToken,
    getUsers
};
