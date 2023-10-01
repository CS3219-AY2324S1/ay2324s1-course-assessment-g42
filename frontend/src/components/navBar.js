import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Popover } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import LogoutUser from './users/logoutUser';

function NavBar() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            setIsLoggedIn(true);
            const user = JSON.parse(loggedInUser);
            if (user.role === 'admin') {
                setIsAdmin(true);                  
              } else {
                setIsAdmin(false);
              }
        } else {
            setIsAdmin(false);
        }
    }, [setIsLoggedIn]);

    return (
        <AppBar position="static" sx={{ backgroundColor: 'black' }}>
            <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                <div>
                    <Typography variant="text" component={Link} to="/" 
                    sx={{ textDecoration: 'none', 
                        color: 'white', fontWeight: 600, 
                        fontSize: 22, marginLeft: 4 
                    }}>
                        Peer Prep
                    </Typography>
                    <Typography variant="text" component={Link} to="/questions" 
                    sx={{ textDecoration: 'none', color: 'white', 
                        marginLeft: 8, fontWeight: 400, fontSize: 18 
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
                        <LogoutUser user = {user}/>
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
