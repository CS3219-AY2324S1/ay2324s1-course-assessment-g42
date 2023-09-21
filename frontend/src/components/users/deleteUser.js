import '../../App.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DeleteUser({ user }) {
    const navigate = useNavigate();

    const handleDelete = async (e) => {
        if (user) {
            //only delete if user is logged in
            const email = user.email;
            //delete user by email
            await axios.post(
                "/user/delete",
                { email }
            );
            //clear user from local storage
            localStorage.clear();
        } else {
            //if user not logged in, redirect to home
            console.log("no user");
        }
        navigate('/');
    }

    return(
        <div>
            <button onClick={handleDelete}>Delete Account</button>
        </div>
    )
}

export default DeleteUser;