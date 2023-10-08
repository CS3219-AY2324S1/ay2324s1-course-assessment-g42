import '../../App.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { logout } from '../../helpers';

function LogoutUser() {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
        logout();
      }
    

    return(
        <div>
            <Button variant="text" sx = {{ color:'black' }} onClick={handleLogout}>Logout</Button>
        </div>
    )
}

export default LogoutUser;