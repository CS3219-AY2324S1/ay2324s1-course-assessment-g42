import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Paper, Typography, TextField, Button, Container } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { USER_API_URL } from '../config';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const user = { email, password };
        try {
            const response = await axios.post(
              USER_API_URL + '/user/login',
              user,
              { withCredentials: true, credentials: 'include' }
            );
            if (response.status === 200) {
                const userJsonString = JSON.stringify(response.data.user);
                // Store user details in cookie for login persistence
                Cookies.set('user', userJsonString, {expires: 7});
                navigate('/');
                // Refresh the page
                window.location.reload();
                // Reset login state
                setPassword('');
                setEmail('');
            }
        } catch (error) {
            if (error.response.status === 422) {
                //incorrect password entered
                toast.error("incorrect password", {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "dark",
                });
                return;
            } else if (error.response.status === 404) {
                //email not registered
                toast.error("Email does not exist", {
                    position: "top-center",
                    autoclose: 3000,
                    theme: "dark",
                });
                return;
            }
        }
    };

    useEffect(() => {
        const loggedInUser = Cookies.get('user');
        if (loggedInUser) {
            // If there is already a user logged in, navigate to the user profile page
            navigate('/');
        }
    }, [navigate]);

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
                        Log in
                    </Typography>
                    <form onSubmit={handleLogin}>
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
                        <Button
                            type="submit"
                            variant="contained"
                            style={{ backgroundColor: 'black', color: 'white', width: '100%' }}
                        >
                            Login
                        </Button>
                    </form>
                </Paper>
            </Container>
        </div>
    );
}

export default Login;

