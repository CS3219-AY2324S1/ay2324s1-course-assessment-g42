import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        //if there is already a user logged in
        //navigate to user profile page
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            navigate('/userProfile');
        }
    });

    const handleRegister = async e => {
        //prevent refresh
        e.preventDefault();

        const user = { username, email, password, password2 };
        console.log(user);
        //send username, password, email to server
        const response = await axios.post(
          "/user/register",
          user
        );
        if (response.status === 200) {
            setUsername("");
            setPassword("");
            setEmail("");
            setPassword2("");
            navigate("/login");
        }
    };

    return (
        <div className='App'>
            <p>Register</p>
            <form onSubmit={handleRegister}>
                <div> 
                    <input type='text' id='username' name='username' placeholder='Username' onChange={({target}) => setUsername(target.value)}/>
                </div>
                <div>
                    <input type='email' id="email" name="email" placeholder='Email' onChange={({target}) => setEmail(target.value)}/>
                </div>
                <div>
                    <input type='password' id='password' name='password' placeholder='Password' onChange={({target}) => setPassword(target.value)}/>
                </div>
                <div>
                    <input type='password' id='password2' name='password2' placeholder='Confirm Password' onChange={({target}) => setPassword2(target.value)}/>
                </div>
                <div>
                    <input type='submit' value='Register'/>
                </div>
            </form>
        </div>
    )
}

export default Signup;