import React from "react"; 
import NetworkFunction from "./NetworkFunction";
import { networkFunctions } from "../../function_colours";

// Sidebar component for displaying network functions that can be dragged onto nodes.
const TopologySidebar = () => { 
    return ( 
        <div style={{ width: '20%', padding: '10px', background: '#f0f0f0' }}> 
            <h4>Network Functions</h4> 
            {networkFunctions.map((func) => ( 
                <NetworkFunction
                    key={func.type}
                    functionData={func}
                /> 
            ))} 
        </div> 
    ); 
}; 

export default TopologySidebar; 