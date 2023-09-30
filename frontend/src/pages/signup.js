import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Paper, Typography, TextField, Button, Container } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const role = 'user';
    const navigate = useNavigate();

    useEffect(() => {
        // If there is already a user logged in, navigate to the user profile page
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            navigate('/');
        }
    }, [navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        const user = { username, email, password, password2, role };
        try {
            const response = await axios.post('/user/register', user);
            if (response.status === 200) {
                toast.success('Account created successfully', {
                    position: 'top-center',
                    autoClose: 3000,
                    theme: 'dark'
                })
                navigate('/login');
                //reset state
                setUsername('');
                setPassword('');
                setEmail('');
                setPassword2('');
            }
        } catch (error) {
            if (error.response.status === 401) {
                toast.error('Password must have at least 8 characters', {
                    position: 'top-center',
                    autoClose: 3000,
                    theme: 'dark',
                });
            }  else if (error.response.status === 400) {
                toast.error('Passwords do not match', {
                position: 'top-center',
                autoClose: 3000,
                theme: 'dark',
                });
            } else if (error.response.status === 402) {
                toast.error('Email already registered. Login?', {
                    position: 'top-center',
                    autoClose: 3000,
                    theme: 'dark',
                });
            } else if (error.response.status === 403) {
                toast.error('Unknown error occured', {
                    position: 'top-center',
                    autoClose: 3000,
                    theme: 'dark',
                });
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
