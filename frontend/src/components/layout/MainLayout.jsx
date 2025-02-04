// Provides the main layout of the application with a header, sidebar, and content area.
import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Box, Toolbar } from "@mui/material";
import SimulationCommands from "../common/SimulationCommandButton";

const MainLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false); // State to control the sidebar's open/close state

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen); // Toggle the sidebar state
    };

    return (
        <Box sx={{ display: "flex", width: '100%' }}>
            {/*Header with menu toggle button*/}
            <Header onMenuClick={toggleSidebar} />
            {/*Sidebar for navigation*/}
            <Sidebar open={sidebarOpen} onClose={toggleSidebar} />
            {/*Main content area*/}
            <Box
                component="main"
                sx={{ flexGrow: 1, p:3, marginTop: '64px', width: `calc(100% - ${sidebarOpen ? '240px' : '60px'})` }}    
            >
                <Toolbar />
                {children} {/*Render child components*/}
            </Box>
            {/*Floating action button for simulation commands*/}
            <SimulationCommands />
            
        </Box>
    );
};

export default MainLayout;