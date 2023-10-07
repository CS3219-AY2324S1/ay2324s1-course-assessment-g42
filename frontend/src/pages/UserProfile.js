import '../App.css';
import axios from "axios";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Grid, Container } from '@mui/material';

import EditUser from '../components/users/editUser';
import LogoutUser from '../components/users/logoutUser';
import DeleteUser from '../components/users/deleteUser';

function UserProfile() {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const navigate = useNavigate();
    
    useEffect(() => {
        const loggedInUser = Cookies.get('user');
        
        const getUser = async () => {
            const user = JSON.parse(loggedInUser);
            console.log(user);
            const email = user.email;

            //find user by stored email
            axios.post("/user/findByEmail", { email })
                .then((response) => {
                    const userObject = response.data.user; // Access the user object from the response
                    setUser(userObject);
                    setIsLoading(false); // Set loading state to false after data is fetched
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        navigate('/');
                        Cookies.remove('user');                
                        window.location.reload();
                        axios.post("/user/clearCookie");
                        
                        console.log("Unauthorised Access, Logged out");
                        
                        toast.error("Unauthorised Access", {
                            position: "top-center",
                            autoClose: 3000,
                            theme: "dark",
                        });
                        
                        return;
                    }
                    console.error('Error fetching user:', error);
                    setIsLoading(false); // Set loading state to false in case of an error
                }
            );
        }
        if (loggedInUser) {
            getUser();
        } else {
            //if no user session
            navigate('/login');
            toast.error("Not signed in!", {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
            });
            toast.clearWaitingQueue();
            return;
        }
    }, [navigate]);

    return (
        <Container
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
          }}
        >
            <Paper
                style={{
                    padding: '24px',
                    width: '80%',
                    borderColor: 'black',
                    backgroundColor: 'white',
                    color: 'black',
                }}
                elevation={3}
            >
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : (
                            <>
                                <div>
                                    <Typography
                                        variant="h5"
                                        component="div"
                                        sx={{ fontWeight: 600, marginLeft: 7, marginTop: 3, 
                                            fontSize: 28,
                                            whiteSpace: 'nowrap',    
                                            overflow: 'hidden',       
                                            textOverflow: 'ellipsis' 
                                        }} 
                                    >
                                        {user.username}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        component="div"
                                        sx={{ fontWeight: 200, marginLeft: 7 }} 
                                    >
                                        {user.email}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        component="div"
                                        sx={{ fontWeight: 200, marginLeft: 7 }} 
                                    >
                                        {user.role}
                                    </Typography>
                                </div>
                            </>
                        )}
                    </Grid>
                    <Grid item xs={8}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <EditUser user={user} />
                            <div style={{ border: '1px solid rgba(0, 0, 0, 0.4)', 
                                borderRadius: '6px', 
                                marginBottom: '10px',
                                marginTop: '10px' 
                            }}>
                                <LogoutUser />
                            </div>
                            <div style={{ border: '1px solid rgba(0, 0, 0, 0.4)', borderRadius: '6px' }}>
                                <DeleteUser user={user} />
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
      );
    }

export default UserProfile;