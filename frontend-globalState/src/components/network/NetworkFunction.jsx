// Renders a draggable network function for drag-and-drop interaction.
import React from "react";

const NetworkFunction = ({ functionData }) => {
  const handleDragStart = (event) => {
    //Set the function data as the drag event payload
    event.dataTransfer.setData('application/json', JSON.stringify(functionData));
  };
  
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      style={{
        cursor: 'move',
        backgroundColor: functionData.color,
        color: '#fff',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '5px',
      }}
    >
      {functionData.label}
    </div>
  );
};

export default NetworkFunction; 