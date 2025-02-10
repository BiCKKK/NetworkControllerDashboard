// Custom ReactFlow Node component
import React, { useState } from 'react'; 
import { Handle } from '@xyflow/react'; 
import ProgressBar from '../network/ProgressBar'; 
import AssetDiscoveryTooltip from './AssetDiscoveryTooltip';

// Node component represents each node in the network topology visualisation.
const Node = ({ data }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    // Determine if the node is a switch or has the Asset Discovery function installed.
    const isSwitch = data.deviceType === 'switch';
    const isAssetDiscoveryInstalled = data.functionsInstalled.some(
        (func) => func.type === 'assetdisc'
    );

    // Define the styling of the node based on its connection status.
    const nodeStyle = {
        padding: '10px',
        background: '#f9f9f9',
        borderRadius: '8px',
        border: data.status === 'connected' ? '2px solid green' : '1px solid #ccc',
        textAlign: 'center',
        minWidth: '120px',
        minHeight: '120px',
        position: 'relative',
        opacity: data.status === 'connected' ? 1 : 0.5,
    };

    if (data.status === 'connected') {
        nodeStyle.border = '2px solid green';
    } else {
        nodeStyle.opacity = 0.5;
    }

    // Handle drag-over events to enable dropping functions onto the node.
    const handleDragOver = (event) => {
        if (isSwitch && data.isActive) {
            event.preventDefault();
        }
    };

    // Handle drop events to install a function on the node.
    const handleDrop = (event) => {
        event.preventDefault();
        const functionData = JSON.parse(event.dataTransfer.getData('application/json'));
        if (data.onFunctionInstall) {
            data.onFunctionInstall(functionData);
        }
    };

    return ( 
        <div onDragOver={handleDragOver} onDrop={handleDrop} style={nodeStyle} data-id={data.label}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}> 
            {data.image && ( 
                <img 
                    src={data.image} 
                    alt={data.label} 
                    style={{ 
                        width: '60px', 
                        height: '60px', 
                        objectFit: 'cover', 
                        marginBottom: '10px', 
                    }} 
                /> 
            )} 
            <div style={{ fontWeight: 'bold' }}>{data.label}</div> 
            {isSwitch && (
                <ProgressBar 
                functionsInstalled={data.functionsInstalled}
                onRemoveFunction={data.onRemoveFunction}
                />
            )}
            
            {/*Show tooltip for connected switches with Asset Discovery installed.*/}
            {showTooltip && isSwitch && data.status === 'connected' && isAssetDiscoveryInstalled && (
                <AssetDiscoveryTooltip dpid={data.dpid} nodeName={data.label} />
            )}
            
            {/*Add handles for connecting nodes in the network topology.*/}
            <Handle type="target" position="top" style={{ background: '#555' }} id="top-target" />
            <Handle type="target" position="bottom" style={{ background: '#555' }} id="bottom-target" />
            <Handle type="target" position="left" style={{ background: '#555' }} id="left-target" /> 
            <Handle type="target" position="right" style={{ background: '#555' }} id="right-target" /> 
            <Handle type="source" position="top" style={{ background: '#555' }} id="top-source" /> 
            <Handle type="source" position="bottom" style={{ background: '#555' }} id="bottom-source" />
            <Handle type="source" position="left" style={{ background: '#555' }} id="left-source" />
            <Handle type="source" position="right" style={{ background: '#555' }} id="right-source" /> 
        </div> 
    ); 
}; 

export default Node; 