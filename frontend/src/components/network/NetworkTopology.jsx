// Renders a network topology visualisation using ReactFlow.
import React, { useEffect, useMemo } from "react"; 
import { ReactFlow, Background, Controls, MiniMap, 
    useEdgesState, useNodesState, } from "@xyflow/react"; 
import Node from "./Node"; 
import TopologySidebar from "./TopologySidebar";
import "@xyflow/react/dist/style.css"; 
import CustomEdge from "../common/CustomEdge";

const NetworkTopology = ( { nodes, edges } ) => { 
    // Define custom edge types for the topology
    const edgeTypes = {
        custom: CustomEdge,
    };

    return ( 
        <div style={{ width: '100%', height: '1000px', display: 'flex' }}> 
            {/*Network visualisation area*/}
            <div style={{ width: '80%', height: '100%', border: '1px solid #ccc' }}> 
                <ReactFlow 
                    nodes={nodes} 
                    edges={edges} 
                    nodeTypes={{ customNode: Node }}
                    edgeTypes={edgeTypes} 
                    style={{ width: '100%', height: '90%' }} 
                    fitView 
                    nodesDraggable={false} // Prevent dragging of nodes
                    nodesConnectable={false} // Prevent node connection
                    defaultEdgeOptions={{ type: 'straight'}}
                > 
                    <MiniMap /> {/*Mini map for navigation*/}
                    <Controls /> {/*Zoom and pan controls*/}
                    <Background /> {/*Background grid*/}
                </ReactFlow> 
            </div> 
            {/*Sidebar for additional topology interactions*/}
            <TopologySidebar /> 
        </div> 
    ); 
}; 

export default NetworkTopology; 

