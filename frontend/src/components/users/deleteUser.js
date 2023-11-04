import '../../App.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';
import Cookies from 'js-cookie';

import { logout } from '../../helpers';
import { USER_API_URL } from '../../config';

function DeleteUser({ user }) {
    const navigate = useNavigate();

    const handleDelete = async (e) => {
        if (user) {
            //only delete if user is logged in
            const email = user.email;
            //delete user by email
            try {
                const res = await axios.post(
                    USER_API_URL + "/user/delete",
                    { email },
                    { withCredentials: true, credentials: 'include' }
                );
                if (res.status === 200) {
                    //clear user from cookie
                    Cookies.remove('user');
                    navigate('/');
                    // Refresh the page
                    window.location.reload();
                }   
            } catch (err) {
                if (err.response.status === 401) {
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
                toast.error("Unknown error occurred", {
                    position: 'top-center',
                    autoClose: 3000,
                    theme: 'dark'
                });
            };
        } else {
            //if user not logged in, redirect to home
            console.log("no user");
        }
    }

    return(
        <div style={{ border: '1px solid white', width: '60%', borderRadius: '6px', overflow: 'hidden' }}>
            <Button variant="text" sx = {{ color: 'white', fontSize: '14px' }} onClick={handleDelete}> 
                Delete Account 
            </Button>
        </div>
    )
}

export default DeleteUser;