import '../../App.css';
import React from 'react';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
// import Cookies from 'js-cookie';

//import HandleLogout from './handleLogout';
import { logout } from '../../helpers';
//import Cookies from 'js-cookie';

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