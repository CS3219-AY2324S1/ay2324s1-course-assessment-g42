import '../../App.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

function LogoutUser({ user }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (user) {
            //clear user details from local storage
            localStorage.clear();
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