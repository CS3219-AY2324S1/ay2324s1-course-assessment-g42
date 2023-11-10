import '../App.css';
import axios from "axios";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';

import EditUser from '../components/users/editUser';
import LogoutUser from '../components/users/logoutUser';
import DeleteUser from '../components/users/deleteUser';
import QuestionHistory from '../components/users/questionHistory';
import { logout } from '../helpers';
import { USER_API_URL, HISTORY_API_URL } from '../config';
function UserProfile() {
    const [user, setUser] = useState({});
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const navigate = useNavigate();
    
    useEffect(() => {
        const loggedInUser = Cookies.get('user');
        
        const getUser = async () => {
            const user = JSON.parse(loggedInUser);
            console.log(user);
            const email = user.email;

            //find user by stored email
            axios.post(
              USER_API_URL + "/user/findByEmail",
              { email },
              { withCredentials: true, credentials: 'include' }
            )
                .then((response) => {
                    const userObject = response.data.user; // Access the user object from the response
                    setUser(userObject);
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        navigate('/');
                        logout();
                        
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
        const getHistory = async () => {
            const user = JSON.parse(loggedInUser);
            console.log(user);
            const email = user.email;

            //find user by stored email
            axios.post(
              HISTORY_API_URL + "/history/findByEmail",
              { email },
              { withCredentials: true, credentials: 'include' }
            )
                .then((response) => {
                    const historyObject = response.data.history; // Access the user object from the response
                    setHistory(historyObject);
                    
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        navigate('/');
                        logout();
                        
                        console.log("Unauthorised Access, Logged out");
                        
                        toast.error("Unauthorised Access", {
                            position: "top-center",
                            autoClose: 3000,
                            theme: "dark",
                        });
                        
                        return;
                    }
                    console.error('Error fetching history:', error);
                    setIsLoading(false); // Set loading state to false in case of an error
                }
            );
        }
        if (loggedInUser) {
            getUser();
            getHistory();
            setIsLoading(false); // Set loading state to false after data is fetched
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
        <>
            <div className='grad-box'>
                <Grid container spacing={0.5} direction="row" justifyContent="center" alignItems="center" marginBottom='10px'>
                    <Grid item xs={6}>
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : (
                            <>
                                <p className="userprofile-title-text">
                                    Hi, {user.username}
                                </p>
                                <p className="userprofile-caption-text">
                                    {user.email}
                                </p>
                                <p className="userprofile-caption-text">
                                    {user.role}
                                </p>
                            </>
                        )}
                    </Grid>
                    <Grid item xs={6}>
                        <div style={{ marginLeft: '20%', width: '40%', marginTop: '5%' }}>
                            <div style={{ marginBottom: '10px' }}>
                                <EditUser user={user}/>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <LogoutUser color="white" />
                                <DeleteUser user={user} />
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>

            <QuestionHistory history={history}/>
        </>
    )
}

export default UserProfile;