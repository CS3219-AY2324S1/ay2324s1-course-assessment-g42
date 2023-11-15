const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require("../models/user-model.js");

async function registerUser(req, res) {
    let { username, email, password, role } = req.body;

    console.log ({
        username, email, password, role
    });

    try {
        const result = await db.getUsersByEmail(email);
         if (result.rows.length > 0) {
            return res.status(409).json({
                error: "Email already exists."
            });
        }

        try {
            const result = await db.getUsersByUsername(username);
            if (result.rows.length > 0) {
                return res.status(422).json({
                    error: "Username already exists."
                });
            } else if (password.length < 8) {
                return res.status(403).json({
                    error: "Password not long enough"
                });
            }
            bcrypt.hash(password, 10)
            .then(async (hash) => {
                try {
                    // Make sure the function calling this is marked as async
                    await db.createNewUser(username, email, hash, role);
                    return res.status(200).json({ username, email });
                } catch (err) {
                    return res.status(500).json({
                        error: "Failed to register user."
                    });
                }
            })
            .catch(err => {
                return res.status(500).send({ message: "Error updating password" });
            });
        } catch (err) {
            return res.status(500).json({
                error: "An error occurred while checking for username existence."
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: "An error occurred while checking for email existence."
        });
    }
   
}

async function loginUser (req, res) {
    let  { email, password } = req.body;

    try {
        const result = await db.getUsersByEmail(email);
        if (result.rows.length == 0) {
            return res.status(404).json({
                error: "User does not exist."
            });
        } else if (result.rows.length > 0) {
            const user = result.rows[0];
            const hash = user.password;

            bcrypt.compare(password, hash)
            .then(result => {
                if (result) {
                    let jwtSecretKey = process.env.JWT_SECRET_KEY;
                    let data = {
                        email: email,
                        password: hash,
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
            })
            .catch(err => {
                return res.status(500).send({ message: "Error checking password" });
            })
        }

    } catch (err) {
        return res.status(500).json({
            error: "An error occurred while checking for email existence."
        });
    }
}

async function deleteUser (req, res) {
    let { email } = req.body;

    try {
        const result = db.deleteUserByEmail(email);
        res.clearCookie('token');
        return res.status(200).send({message: "user deleted successfully"});
    } catch (err) {
        return res.status(500).send({ error: "error deleting account" });
    }
}

async function updateUsername (req, res) {
    let {newUsername, email} = req.body;

    if (!newUsername || !email) {
        return res.status(423).json({ error: "Empty parameters given "});
    }
    
    try {
        const result = await db.getUsersByUsername(newUsername);
        if (result.rows.length > 0) {
            return res.status(422).json({
                error: "Username already exists"
            });
        }

        try {
            const result = await db.updateUsernameByEmail(newUsername, email);
            try {
                const result = await db.getUsersByEmail(email);
                const user = result.rows[0];
                return res.status(200).json({ user });
            } catch (err) {
                return res.status(500).send({message: "Error updating username"});
            }
        } catch (err) {
            return res.status(500).send({message: "Error updating username"});
        }
    } catch (err) {
        return res.status(500).json({
            error: "An error occured while checking for username existence."
        });
    }
}

async function updatePassword (req, res) {
    let {newPassword, email} = req.body;

    if(!newPassword || !email) {
        return res.status(402).json({ error: "Empty params given "});
    }
    
    if (newPassword.length < 8) {
        return res.status(403).json({
            error: "New password too short"
        })
    }

    bcrypt.hash(newPassword, 10)
    .then(async hash => {
        try {
            const result = await db.updatePasswordByEmail(hash, email);
            try {
                const result = await db.getUsersByEmail(email);
                const user = result.rows[0];
                return res.status(200).json({ user });
            } catch (err) {
                return res.status(500);
            }
        } catch (err) {
            return res.status(500).send({ message: "Error updating password "});
        }
    })
    .catch(err => {
        return res.status(500).send({ message: "Error updating password" });
    })
}

async function updateRole (req, res) {
    let {username, newRole} = req.body;
    console.log("Change to: " + newRole);

    try {
        const result = await db.updateRoleByUsername(newRole, username);
        return getUsers(req, res);
    } catch (err) {
        return res.status(500).send({ message: "Error updating role." });
    }
}
async function findByEmail (req, res) {
    let { email } = req.body;

    if(!email) {
        return res.status(403).json({ error: "No email given" });
    }
    try {
        const result = await db.getUsersByEmail(email);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            console.log(user);
            return res.status(200).json({ user });
        } else {
            return res.status(404).json({ error: "User does not exist." });
        }
    } catch (err) {
        return res.status(500);
    }

}

async function getUsers (req, res) {
    try {
        const result = await db.getAllUsers();
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows);
        } else {
            return res.status(404);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: "Error getting all users." });
    }
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
