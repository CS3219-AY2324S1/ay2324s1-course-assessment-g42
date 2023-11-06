import '../../App.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { logout } from '../../helpers';

function LogoutUser({ color }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
        logout();
      }
    

    return(
        <div style={{ border: '1px solid white', borderRadius: '6px', marginRight: '10px', overflow: 'hidden' }}>
            <Button variant="text" sx={{ color: color, fontSize: '13px' }} onClick={handleLogout}>Logout</Button>
        </div>
    )
}

export default LogoutUser;