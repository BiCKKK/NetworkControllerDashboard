// Displays a tooltip with asset discovery data for a specific device, periodically updating.
import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import axios from 'axios';

const AssetDiscoveryTooltip = ({ dpid, nodeName }) => {
    const [assetData, setAssetData] = useState([]); // State to store fetched asset discovery data

    useEffect(() => {
        // Fetch asset discovery data from the backend
        const fetchAssetData = async () => {
            try {
                console.log(`Fetching asset discovery data for dpid: ${dpid}`)
                const response = await axios.get('http://localhost:5050/api/asset_discovery_data', {
                    params: {
                        dpid,
                        limit: 5,
                    },
                });
                console.log('Response data:', response.data);
                setAssetData(response.data || []);
            } catch (error) {
                console.error('Error fetching asset discovery data:', error);
                setAssetData([]);
            }
        };

        fetchAssetData();

        // Set up periodic fetching every 10 seconds
        const intervalId = setInterval(fetchAssetData, 10000);

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [dpid]);

    useEffect(() => {
        // Log updated asset data
        console.log('Updated asset data state:', assetData)
    })

    return (
        <Paper
            elevation={3}
            sx={{
                position: 'absolute',
                right: '130%',
                top: '50%',
                transform: 'translateY(-50%)',
                p: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                zIndex: 1000,
                border: '1px solid #ccc',
                maxWidth: 350,
            }}
        >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Asset Discovery Data - {nodeName}
            </Typography>
            {assetData.map((asset, index) => (
                <Box
                    key={index}
                    sx={{
                        mb: 1,
                        p: 1,
                        borderRadius: '4px',
                        backgroundColor: 'rgba(0, 0, 0, 0.03)',
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Device {index + 1}
                    </Typography>
                    <Typography variant="body2">MAC: {asset.mac_address}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Bytes: {asset.bytes}</Typography>
                        <Typography variant="body2">Packets: {asset.packets}</Typography>
                    </Box>
                    <Typography
                        variant="caption"
                        sx={{ color: '#888', display: 'block', mt: 0.5 }}
                    >
                        Last seen: {new Date(asset.timestamp).toLocaleString()}
                    </Typography>
                </Box>
            ))}
        </Paper>
    );
};

export default AssetDiscoveryTooltip;

