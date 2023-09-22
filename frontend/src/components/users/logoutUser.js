import '../../App.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutUser({ user }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (user) {
            //clear user details from local storage
            localStorage.clear();
            console.log("logged out");
            //navigate user to home
            navigate('/')
        } else {
            console.log("not logged in");
        }
      }

    return(
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default LogoutUser;