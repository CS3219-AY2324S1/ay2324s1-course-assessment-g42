import '../../App.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';
import Cookies from 'js-cookie';

//import handleLogout from './logoutUser';

function DeleteUser({ user }) {
    const navigate = useNavigate();

    const handleDelete = async (e) => {
        if (user) {
            //only delete if user is logged in
            const email = user.email;
            //delete user by email
            try {
                const res = await axios.post(
                    "/user/delete",
                    { email }
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
                    Cookies.remove('user');                
                    window.location.reload();
                    axios.post("/user/clearCookie");
                    
                    console.log("logged out");
                    
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
        <div>
            <Button variant="text" sx = {{ color: 'black' }} onClick={handleDelete}> Delete Account </Button>
        </div>
    )
}

export default DeleteUser;