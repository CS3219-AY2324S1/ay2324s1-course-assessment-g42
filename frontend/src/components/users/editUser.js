import '../../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditUser({ user }) {
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    const handleUpdate = async () => {
        if (user) {
            const email = user.email;
            const newDetails = { newUsername, newPassword, email };
            //update user details with new fields
            const response = await axios.post(
              "/user/update",
              newDetails
            );
            navigate('/userprofile');
        } else {
            console.log("no user");
            navigate('/login');
        }
    }

    return(
        <div>
            <form onSubmit={handleUpdate}>
                <div>
                    <input type='username' id='username' placeholder='new username' onChange={({target}) => setNewUsername(target.value)} />
                </div>
                <div>
                    <input type='submit' value='Update Username'/>
                </div>
            </form>
            <form onSubmit={handleUpdate}>
                <div>
                    <input type='password' id='password' placeholder='new password' onChange={({target}) => setNewPassword(target.value)} />
                </div>
                <div>
                    <input type='submit' value='Update Password'/>
                </div>
            </form>
        </div>
    )
}

export default EditUser;