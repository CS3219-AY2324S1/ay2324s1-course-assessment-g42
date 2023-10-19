import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Popover } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import LogoutUser from './users/logoutUser';
import Cookies from 'js-cookie';

function NavBar() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const loggedInUser = Cookies.get('user');
        setIsAdmin(false);
        if (loggedInUser) {
            setIsLoggedIn(true);
            const user = JSON.parse(loggedInUser);
            if (user.role === 'admin') {
                setIsAdmin(true);                  
            } 
        }
    }, [setIsLoggedIn]);

    return (
        <AppBar position="static" sx={{ backgroundColor: 'black' }}>
            <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <a href="/">
                        <img src="/peerp.png" alt="peerP" width="100px" />
                    </a>
                    <Typography variant="text" component={Link} to="/questions/1" 
                    sx={{ textDecoration: 'none', color: 'white', 
                        marginLeft: 6, fontWeight: 400, fontSize: 18 
                    }}>
                        Questions
                    </Typography>
                    {isAdmin &&
                    <Typography variant="text" component={Link} to="/viewusers" 
                    sx={{ textDecoration: 'none', color: 'white', 
                        marginLeft: 8, fontWeight: 400, fontSize: 18 
                    }}>
                        Users
                    </Typography>
                    }
                </div>
                {isLoggedIn ? (
                <div>
                    <IconButton
                        onClick={handleMenuClick}
                        size="large"
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <Button component={Link} to="/userprofile" color="inherit">
                            profile
                        </Button>
                        <LogoutUser />
                    </Popover>
                </div>
                ) : (
                <div>
                    <Button component={Link} to="/login" variant="text" color="inherit">
                        Log In
                    </Button>
                    <Button component={Link} to="/signup" variant="text" color="inherit">
                        Register
                    </Button>
                </div>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
