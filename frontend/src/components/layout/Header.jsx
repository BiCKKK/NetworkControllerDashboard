// Renders the application header with a menu button, logo search bar, and action icons (notifications, avatar).
// Search, notifications, and user avatars are for future versions of the application.
import React from "react";
import { AppBar, Avatar, Box, IconButton, InputAdornment, TextField, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../assets/logo.png";

const Header = ({ onMenuClick }) => {
    return (
        <AppBar position="fixed" sx={{ backgroundColor: '#212121', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                {/*Menu button for toggling the sidebar*/}
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={onMenuClick}
                    sx={{ mr: 0, ml: 0 }}
                >
                    <MenuIcon />    
                </IconButton>
                {/*Logo diplayed in the header*/}
                <Box
                    component="img"
                    src={logo}
                    alt="SGFabric Logo"
                    sx={{ height: 60, width: 120, ml: 4, mr: 2, verticalAlign: 'middle' }}
                />
                {/*Search bar*/}
                <TextField 
                    variant="outlined"
                    placeholder="Search..."
                    size="small"
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: 1,
                        width: '500px',
                        ml: 2,
                    }}
                    InputProps={{
                        startAdornment:(
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                {/*Icons for notifications and user avatar*/}
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto'}}>
                    <IconButton color="inherit">
                        <NotificationsIcon />
                    </IconButton>
                    <IconButton color="inherit" sx={{ ml: 2 }}>
                        <Avatar alt="User Avatar" />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
