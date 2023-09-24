import '../../App.css';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, TextField  } from '@mui/material';

function EditUser({ user }) {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');

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
            const response = await axios.post('/user/updateUsername', newDetails);
            if (response.status === 200) {
                setNewUsername('');
                //update user details in local storage
                const userJsonString = JSON.stringify(response.data.user);
                localStorage.setItem('user', userJsonString);
                //reload page to update username
                window.location.reload();
            }
        } catch (error) {
            toast.error("Unknown error occurred", {
                position: 'top-center',
                autoClose: 3000,
                theme: 'dark',
            });
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const email = user.email;
        const newDetails = { newPassword, email };
        try {
            const response = await axios.post('/user/updatePassword', newDetails);
            if (response.status === 200) {
                toast.success('Password updated successfully', {
                    position: 'top-center',
                    autoClose: 3000,
                    theme: 'dark',
                });
                setNewPassword('');
                //update user details in local storage
                const userJsonString = JSON.stringify(response.data.user);
                localStorage.setItem('user', userJsonString);
            }
        } catch (error) {
            if (error.response.status === 401) {
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
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        type="text"
                        id="username"
                        placeholder="New username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        variant="outlined"
                        style={{
                            marginRight: '10px', // Add some spacing between the field and button
                            padding: '6px', // Adjust padding for height
                            fontSize: '14px'
                        }}
                        InputProps={{ style: { color: 'black' } }}
                    />
                    <Button
                        type="submit"
                        style={{
                        backgroundColor: 'black',
                        color: 'white',
                        width: '10%', // Adjust the width to match the field
                        padding: '6px', // Adjust padding for height
                        fontSize: '14px', // Reduce font size for button text
                        }}
                    >
                        Save
                    </Button>
                </div>
            </form>
            <form onSubmit={handleUpdatePassword}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    type="password"
                    id="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    variant="outlined"
                    style={{ 
                        marginRight: '10px', // Add some spacing between the field and button
                        padding: '6px', // Adjust padding for height
                        fontSize: '14px'
                    }}
                    InputProps={{ style: { color: 'black' } }}
                />
                <Button
                    type="submit"
                    style={{ 
                        backgroundColor: 'black',
                        color: 'white',
                        width: '10%', // Adjust the width to match the field
                        padding: '6px', // Adjust padding for height
                        fontSize: '14px', // Reduce font size for button text
                    }}
                >
                    Save
                </Button>
            </div>
        </form>
    </div>
);
}

export default EditUser;
