import '../App.css';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function ViewUsers() {

    const [users, setUsers] = useState([]);
    useEffect(() => {
        axios.post("/user/getUsers")
        .then(response => {       
          setUsers(response.data)
        })
        .catch(error => console.error(error));
      
    }, []);

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
                    </TableRow>
                </TableHead>

                {/* Insert table body content */}
                <TableBody>
                    {users.map((user) => (
                    <TableRow
                        key={user.username}
                        sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { cursor: 'pointer' }
                        }}
                        //onClick={() => handleClickOpen(question.id)}
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