import '../App.css';
import axios from "axios";
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import EditUser from '../components/users/editUser';
import LogoutUser from '../components/users/logoutUser';
import DeleteUser from '../components/users/deleteUser';

function UserProfile() {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const navigate = useNavigate();
    
    useEffect(() => {
        const loggedInUser = localStorage.getItem('user'); 
        const getUser = async () => {
            const user = JSON.parse(loggedInUser);
            console.log(user);
            const email = user.email;
            //find user by stored email
            axios.post("/user/findByEmail", { email })
                .then((response) => {
                    const userObject = response.data.user; // Access the user object from the response
                    setUser(userObject);
                    setIsLoading(false); // Set loading state to false after data is fetched
                })
                .catch((error) => {
                    console.error('Error fetching user:', error);
                    setIsLoading(false); // Set loading state to false in case of an error
                }
            );
        }
        if (loggedInUser) {
            getUser();
        } else {
            //if no user session
            navigate('/login');
        }
    }, [navigate, setUser]);

    return (
        <div className='App'>
            <p>User Profile</p>
            {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                    <p>username: {user.username}</p>
                    <p>email: {user.email}</p>
                    </>
                )
            }
            <p>Change Username/Password</p>
            <div>
                <EditUser user={user}/>
                <LogoutUser user={user}/>
                <DeleteUser user={user}/>
                <Link to='/'>Home</Link>
            </div>
        </div>
    )
}

export default UserProfile;