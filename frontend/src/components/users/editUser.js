import '../../App.css';
import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../helpers';
import { USER_API_URL } from '../../config';
import EditIcon from '@mui/icons-material/Edit';

function EditUser({ user }) {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

    const handleUpdateUsername = async (e) => {
        e.preventDefault();
        const email = user.email;
        const newDetails = { newUsername, email };

        //username cannot be blank
        if (newUsername === '') {
            toast.error('New username cannot be blank', {
                position: 'top-center',
                autoClose: 3000,
                theme: 'dark'
            })
            return;
        }

        try {
            //update with new user details
            const response = await axios.post(
              USER_API_URL + '/user/updateUsername',
              newDetails,
              { withCredentials: true, credentials: 'include' }
            );
            if (response.status === 200) {
                setNewUsername('');
                //update user details in cookie
                const userJsonString = JSON.stringify(response.data.user);
                Cookies.set('user', userJsonString, {expires: 7});
                //reload page to update username
                window.location.reload();
            }
        } catch (error) {
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
            } else if (error.response.status === 422) {
                toast.error('Username already exists', {
                    position: 'top-center',
                    autoClose: 3000,
                    theme: 'dark',
                });
            } else {
                toast.error("Unknown error occurred", {
                    position: 'top-center',
                    autoClose: 3000,
                    theme: 'dark',
                });
            }
            
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const email = user.email;
        const newDetails = { newPassword, email };
        try {
            const response = await axios.post(
              USER_API_URL + '/user/updatePassword',
              newDetails,
              { withCredentials: true, credentials: 'include' }
            );
            if (response.status === 200) {
                toast.success('Password updated successfully', {
                    position: 'top-center',
                    autoClose: 3000,
                    theme: 'dark',
                });
                setNewPassword('');
                //update user details in cookie
                const userJsonString = JSON.stringify(response.data.user);
                Cookies.set('user', userJsonString, {expires: 7});
            }
        } catch (error) {
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
            } else if (error.response.status === 403) {
                toast.error('New password must be at least 8 characters', {
                    position: 'top-center',
                    autoClose: 3000,
                    theme: 'dark',
                });
            } else {
                toast.error('Unknown error occurred', {
                    position: 'top-center',
                    autoClose: 3000,
                    theme: 'dark'
                });
            };
        }
    };

    return (
        <div>
            <form onSubmit={handleUpdateUsername}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <input
                        type="text"
                        id="username"
                        placeholder="New username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="edituser-custom-input"
                    />
                    <Tooltip title="Edit Username">
                        <Button
                            type="submit"
                            style={{
                                color: 'white' // Adjust the width to match the field
                            }}
                        >
                            <EditIcon style={{ fontSize: '25px' }}/>
                        </Button>
                    </Tooltip>
                </div>
            </form>
            <form onSubmit={handleUpdatePassword}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <input
                        type="text"
                        id="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="edituser-custom-input"
                    />
                    <Tooltip title="Edit Password">
                        <Button
                            type="submit"
                            style={{
                                color: 'white' // Adjust the width to match the field
                            }}
                        >
                            <EditIcon style={{ fontSize: '25px' }}/>
                        </Button>
                    </Tooltip>
                </div>
            </form>
    </div>
    );
}

export default EditUser;
