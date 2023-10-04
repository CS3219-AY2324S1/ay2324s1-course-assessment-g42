import '../../App.css';
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import Cookies from 'js-cookie';

function LogoutUser({ user }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (user) {
            //clear user from cookie
            axios.post("/user/clearCookie", user);
            Cookies.remove('user');
            console.log("logged out");
            //navigate user to home
            navigate('/')
            // Refresh the page
            window.location.reload();
        } else {
            console.log("not logged in");
        }
      }

    return(
        <div>
            <Button variant="text" sx = {{ color:'black' }} onClick={handleLogout}>Logout</Button>
        </div>
    )
}

export default LogoutUser;