import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async e => {
        e.preventDefault();
        const user = { email, password };
        const response = await axios.post(
            "/user/login",
            user
        );
        if (response.status === 200) {
            const userJsonString = JSON.stringify(response.data.user);
            console.log(JSON.parse(userJsonString));
            //store user details in local storage for login persistence
            localStorage.setItem('user', userJsonString);
            
            navigate("/userprofile");
        }
        //reset login state
        setPassword("");
        setEmail("");
    }

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            //if there is already a user logged in
            //navigate to user profile page
            navigate("/userprofile");
        }
    }, [navigate]);

    return (
        <div className='App'>
            <p>Login Here</p>
            <form onSubmit={handleLogin}>
                <div>
                    <input type='email' id="email" name="email" placeholder='Email' onChange={({target}) => setEmail(target.value)}/>
                </div>
                <div>
                    <input type='password' id='password' name='password' placeholder='Password' onChange={({target}) => setPassword(target.value)}/>
                </div>
                <div>
                    <input type='submit' value='login'/>
                </div>
            </form>
        </div>
    )

}

export default Login;