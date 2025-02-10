// Provides the main layout of the application with a header, sidebar, and content area.
import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Box, Toolbar } from "@mui/material";
import SimulationCommands from "../common/SimulationCommandButton";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../../slices/uiSlice";

const MainLayout = ({ children }) => {
    const dispatch = useDispatch();

    const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

    const handleMenuClick = () => {
        dispatch(toggleSidebar());
    };

    return (
        <Box sx={{ display: "flex", width: '100%' }}>
            {/*Header with menu toggle button*/}
            <Header onMenuClick={handleMenuClick} />
            {/*Sidebar for navigation*/}
            <Sidebar open={sidebarOpen} onClose={handleMenuClick} />
            {/*Main content area*/}
            <Box
                component="main"
                sx={{ 
                    flexGrow: 1, 
                    p:3, 
                    marginTop: '64px', 
                    width: `calc(100% - ${sidebarOpen ? '240px' : '60px'})` }}    
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