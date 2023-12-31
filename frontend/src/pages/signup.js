import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Paper, Typography, TextField, Button, Container } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { standardToast } from '../styles/toastStyles';

import { USER_API_URL } from '../config';

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const role = 'user';
    const navigate = useNavigate();

    useEffect(() => {
        // If there is already a user logged in, navigate to the user profile page
        const loggedInUser = Cookies.get('user');
        if (loggedInUser) {
            navigate('/');
        }
    }, [navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== password2) {
            toast.error("Passwords do not match", standardToast);
            return;
        }

        if (password.length < 8) {
            toast.error("Passwords must have at least 8 characters", standardToast);
            return;
        }
        const user = { username, email, password, role };
        try {
            const response = await axios.post(
              USER_API_URL + '/user/register',
              user,
              { withCredentials: true, credentials: 'include' }
            );
            if (response.status === 200) {
                toast.success('Account created successfully', standardToast);
                navigate('/login');
                //reset state
                setUsername('');
                setPassword('');
                setEmail('');
                setPassword2('');
            }
        } catch (error) {
            if (error.response.status === 409) {
                toast.error('Email already registered. Login?', standardToast);
            } else if (error.response.status === 422) {
                toast.error('Username already exists', standardToast);
            } else if (error.response.status === 500) {
                toast.error('Unknown error occured', standardToast);
            }
        }
    };

    return (
        <div>
            <Container
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '80vh',
                }}
            >
                <Paper
                    style={{
                        padding: '24px',
                        width: '300px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                    }}
                    elevation={3}
                >
                <Typography variant="h6" component="div" mb={2}>
                    Sign Up
                </Typography>
                    <form onSubmit={handleRegister}>
                        <TextField
                            type="text"
                            id="username"
                            name="username"
                            label="Username"
                            variant="outlined"
                            style={{ marginBottom: '16px', width: '100%' }}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            type="email"
                            id="email"
                            name="email"
                            label="Email"
                            variant="outlined"
                            style={{ marginBottom: '16px', width: '100%' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{ style: { color: 'black' } }}
                        />
                        <TextField
                            type="password"
                            id="password"
                            name="password"
                            label="Password"
                            variant="outlined"
                            style={{ marginBottom: '16px', width: '100%' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{ style: { color: 'black' } }}
                        />
                        <TextField
                            type="password"
                            id="password2"
                            name="password2"
                            label="Confirm Password"
                            variant="outlined"
                            style={{ marginBottom: '16px', width: '100%' }}
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            InputProps={{ style: { color: 'black' } }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            style={{ backgroundColor: 'black', color: 'white', width: '100%' }}
                        >
                            Register
                        </Button>
                    </form>
                </Paper>
            </Container>
        </div>
    );
}

export default Signup;
