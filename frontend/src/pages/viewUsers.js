import '../App.css';
import React, { useState, useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import axios from "axios";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';

import { logout } from '../helpers/logout';
import { USER_API_URL } from '../config';

function ViewUsers() {

    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    
    const handleRoleUpdate = async(e, username, oldRole) => {
        e.preventDefault();
        let newRole = '';
        if(oldRole === 'user') {
            newRole = "moderator";
        } else if (oldRole === "moderator") {
            newRole = "user";
        }
        const currUser = {username, newRole};
        try {
            const response = await axios.post(
              USER_API_URL + '/user/updateRole',
              currUser,
              { withCredentials: true, credentials: 'include' }
            );
            if (response.status === 200) {
                toast.success("Updated role successfully", {
                    position: 'top-center',
                    autoClose: 1000,
                    theme: 'dark',
                });
                setUsers(response.data)
                
            }
        } catch (error) {
            if (error.response.status === 401) {
                navigate('/');
                logout();
                console.log("Unauthorised Access, Logged out");
                
                toast.error("Unauthorised Access", {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "dark",
                });
                
                return;
            } 
            toast.error("Unknown error occurred", {
                position: 'top-center',
                autoClose: 3000,
                theme: 'dark',
            });
        }
        
    }
    
    useEffect(() => {
        const loggedInUser = Cookies.get('user');
        if (!loggedInUser) {
            navigate('/login');
            toast.error("Not signed in!", {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
            });
            toast.clearWaitingQueue();
            
            return;
        } else {
            const user = JSON.parse(loggedInUser);
            if (user.role !== "admin") {
                navigate('/');
                toast.error("Unauthorised access!", {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "dark",
                });
                toast.clearWaitingQueue();
                
                return;
            }
        }

        axios.post(
          USER_API_URL + "/user/getUsers",
          null,
          { withCredentials: true, credentials: 'include' }
        )
        .then(response => {       
          setUsers(response.data)
        })
        .catch(error => {
            if (error.response.status === 401) {
                navigate('/');
                logout();
                
                console.log("Unauthorised Access, Logged out");
                toast.error("Unauthorised Access", {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "dark",
                });

                return;
            } 
            toast.error("Unknown error occurred", {
                position: 'top-center',
                autoClose: 3000,
                theme: 'dark',
            });
        } );
      
    }, [navigate]);

    return (
        <div className='wrapper'>
            <h1> List of Users </h1>
            <div>

                {/* Table component below*/}
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 400 }} aria-label="simple table">

                {/* Insert table headers */}
                <TableHead>
                    <TableRow key="header">
                    <TableCell style={{ fontWeight: 'bold' }}>Username</TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Role</TableCell>
                    <TableCell align='center'></TableCell>
                    </TableRow>
                </TableHead>

                {/* Insert table body content */}
                <TableBody>
                    {users.map((user) => (
                    <TableRow
                        key={user.username}
                        sx={{
                        '&:last-child td, &:last-child th': { border: 0 }
                        }}
                    >
                        {/* Add table cells */}
                        <TableCell component="th" scope="row">
                        {user.username}
                        </TableCell>
                        <TableCell align="center">
                        {user.email}
                        </TableCell>
                        <TableCell align="center">
                        {user.role}
                        </TableCell>
                        <TableCell align = 'center'>
                            <form onSubmit={(e) => handleRoleUpdate (e, user.username, user.role)}>
                                {user.role === 'admin'
                                ? null
                                : user.role === 'user'
                                    ? 
                                    <Button type='submit'> 
                                    Change to moderator
                                    </Button>
                                    : 
                                    <Button type='submit'> 
                                    Change to user
                                    </Button>
                                }
                            </form>
                            
                            
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>

                </Table>
            </TableContainer>
            </div>
        </div>
      );    
}

export default ViewUsers;