// Provides a floating action button that displays a menu of network simulation commands when clicked.
import React, { useRef, useState } from "react"; 
import { Fab, Box, Menu, MenuItem, Typography } from "@mui/material"; 
import PlayArrowIcon from "@mui/icons-material/PlayArrow"; 
import axios from "axios";

// List of commands with corresponding API endpoints
const commands = [
    { name: 'Packet Count', endpoint: 'http://localhost:5100/api/packet_count' },
    { name: 'Start GOOSE Communication', endpoint: 'http://localhost:5100/api/start_goose' },
    { name: 'Start SV Communication', endpoint: 'http://localhost:5100/api/start_sv' },
    { name: 'Start IEC104 Communication', endpoint: 'http://localhost:5100/api/start_iec104' },
    { name: 'DoS Attack', endpoint: 'http://localhost:5100/api/dos_attack' },
    { name: 'Start SGLab GOOSE', endpoint: 'http://localhost:5100/api/sglab_goose' },
    { name: 'FDI Attack', endpoint: 'http://localhost:5100/api/fdi_attack' },
    { name: 'Performance Monitoring', endpoint: 'http://localhost:5100/api/perfmon' },
    { name: 'Mirror Attack', endpoint: 'http://localhost:5100/api/mirror_attack' },
]

const SimulationCommands = () => { 
    const [menuAnchor, setMenuAnchor] = useState(null); // State to control the menu anchor

    const handleButtomClick = (event) => {
        setMenuAnchor(event.currentTarget); // Open the menu at the button position
    };

    const handleCloseMenu = () => {
        setMenuAnchor(null); // Close the meny
    };

    const handleCommandTrigger = async (command) => {
        try {
            const response = await axios.post(command.endpoint); // Send POST request to the command's endpoint
            alert(`${command.name} triggered succesfully!`); // Show success message
        } catch (error) {
            alert(`Failed to trigger ${command.name}: ${error.response?.data?.error || error.message}`); // Show error message
        }
        setMenuAnchor(null); // Close the menu after triggering
    };

    return ( 
    
        <Box
            sx={{
                position: "fixed",
                bottom: 16,
                right: 16,
                zIndex: 1300, // Ensures it floats above other content 
            }}
        >
            <Fab
                color="primary"
                aria-label="simulate network commands"
                onClick={handleButtomClick} // Open menu on button click
                sx={{
                    "&:focus": {
                        outline: "none",
                        boxShadow: "none",
                    },
                }}
            >
                <PlayArrowIcon /> {/*Play icon for the button*/}
            </Fab>
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)} // Show meny if anchor is set
                onClose={handleCloseMenu} // Close menu on click outside 
                disablePortal
                disableScrollLock
                slotProps={{
                    paper: {
                        style: {
                            maxHeight: 48 * 4.5,
                            width: "20ch",
                        }
                    }
                }}
            >
                {commands.map((command, index) => (
                    <MenuItem key={index} onClick={() => handleCommandTrigger(command)}> {/*Trigger command on click*/}
                        <Typography variant="body1">{command.name}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    ); 
}; 

export default SimulationCommands; 