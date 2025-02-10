// This component renders a context menu that appears at a specific position based on user interaction.
import React from "react";
import { Menu, MenuItem } from "@mui/material";

const ContextMenu = ({anchorPosition, onClose, onRemove}) => {
    return (
        <Menu
            open={Boolean(anchorPosition)} // Open menu if anchorPosition is set
            onClose={onClose} // Trigger onClose callback when the menu is closed
            anchorReference="anchorPosition" // Position the menu relative to anchorPosition
            anchorPosition={
                anchorPosition
                    ? {top: anchorPosition.mouseY, left: anchorPosition.mouseX} // Set the position based on mouse coordinates
                    : undefined   
            }
        >
            <MenuItem onClick={onRemove}>Remove Function</MenuItem> {/*Option to remove a function*/}
        </Menu>
    );
};

export default ContextMenu;