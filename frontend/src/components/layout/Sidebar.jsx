// Renders a collapsibable sidebar with navigation links.
import React from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
import TrafficIcon from "@mui/icons-material/Traffic";
import { NavLink } from "react-router-dom";

const Sidebar = ({ open, onClose}) => {
    // Define the menu items for navigation
    const menuItems = [
        { text: 'Network Overview', icon: <NetworkCheckIcon />, path: '/' },
        { text: 'Traffic Analysis', icon: <TrafficIcon />, path: '/traffic-analysis' },
    ];
    return (
        <Drawer
            variant="permanent"
            anchor="left"
            open={open}
            sx={{
                width: open ? 240 : 60,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: open ? 240 : 60,
                    transition: 'none',
                    overflowX: 'hidden',
                    top: '64px',
                    ml: 1.8,
                    mr: 1.8,
                },
            }}
        >
            <List>
                {/*Render each menu item*/}
                {menuItems.map((item) => (
                    <ListItem
                        to={item.path}
                        key={item.text}
                        button="true"
                        component={NavLink}
                        sx={{cursor: 'pointer', textDecoration: 'none', color: 'inherit'}}
                        onClick={() => {
                            if (open) {
                                onClose(); // Close sidebar when an item is clicked
                            }
                        }}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon> {/*Icon for the menu item*/}
                        {open && <ListItemText primary={item.text} />} {/*Text for the menu item, shown only when open*/}
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;