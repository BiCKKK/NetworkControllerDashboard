import { Box, Typography } from "@mui/material"; 
import React, { useState } from "react"; 
import ContextMenu from "../common/ContextMenu";

// ProgressBar component shows installed functions on a node and provides context menu options.
const ProgressBar = ({ functionsInstalled, onRemoveFunction }) => {
    const [contextMenuPosition, setContextMenuPosition] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    // Handle right-click to show context menu for a specific slot.
    const handleContextMenu = (event, idx) => {
        event.preventDefault();
        setSelectedSlot(idx);
        setContextMenuPosition({
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
        });
    };

    // Close the context menu.
    const handleCloseContextMenu = () => {
        setContextMenuPosition(null);
        setSelectedSlot(null);
    };

    // Handle function removal from a slot.
    const handleRemoveFunction = () => {
        if (selectedSlot !== null && onRemoveFunction) {
            onRemoveFunction(selectedSlot);
        }
        handleCloseContextMenu();
    }

    return ( 
        <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {functionsInstalled.map((func, idx) => (
                <Box 
                    key={idx} 
                    sx={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: func ? func.color : '#e0e0e0', 
                        border: '1px solid #ccc', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        cursor: func ? 'pointer' : 'default', 
                        position: 'relative' 
                    }}  
                    onContextMenu={(event) => func && handleContextMenu(event, idx)}
                > 
                    {func && ( 
                        <Typography 
                            variant="caption" 
                            sx={{ color: '#fff', fontWeight: 'bold' }} 
                        > 
                            {func.type.slice(0, 2)} 
                        </Typography> 
                    )} 
                </Box> 
            ))} 

            <ContextMenu
                anchorPosition={contextMenuPosition}
                onClose={handleCloseContextMenu}
                onRemove={handleRemoveFunction} />
        </Box> 
    ); 
}; 

export default ProgressBar; 