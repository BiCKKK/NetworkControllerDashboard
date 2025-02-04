// Imported to the main Network Overview page.
// Differnet features can be spead out on new pages, for now there is an issue with network topology getting 
// reset after page change
import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, MenuItem, TextField } from '@mui/material';
import axios from 'axios';

const TrafficAnalysis = () => {
    const [viewMode, setViewMode] = useState('entireNetwork');
    const [selectedNode, setSelectedNode] = useState('');
    const [timeRange, setTimeRange] = useState('lastHour');
    const [nodeOptions, setNodeOptions] = useState([]);
    const [monitoringData, setMonitoringData] = useState([]);

    useEffect(() => {
        const fetchNodes = async () => {
            try {
                const response= await axios.get('http://localhost:5050/api/topology');
                const devices = response.data.devices;

                const options = devices.map(device => ({
                    label: device.name,
                    value: device.id,
                }));

                setNodeOptions(options);
            } catch (error) {
                console.error('Error fetching node options:', error);
            }
        };
        fetchNodes();
    }, []);

    useEffect(() => {
        const fetchMonitoringData = async () => {
            try {
                let url = 'http://localhost:5050/api/monitoring_data';
                const params = {
                    limit: 100,
                };
                if (viewMode === 'specificNode' && selectedNode) {
                    params.device_id = selectedNode;
                }

                const now = new Date();
                let startTime;

                if (timeRange === 'lastHour') {
                    startTime = new Date(now.getTime() - 60 * 60 * 1000);
                } else if (timeRange === 'last24Hours') {
                    startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                } else if (timeRange === 'lastWeek') {
                    startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                }

                if (startTime) {
                    params.start_time = startTime.toISOString();
                }

                const response = await axios.get(url, { params });
                setMonitoringData(response.data);
            } catch (error) {
                console.error('Error fetching monitoring data:', error)
            }
        };
        fetchMonitoringData();
    }, [viewMode, selectedNode, timeRange])

    return (
        <>
            {/* Dropdowns for filters */}
            <Paper elevation={3} sx={{ p: 2, mb: 3, mt: -10 }}>
                <Grid container spacing={2}>
                    {/* View Mode Selection */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            fullWidth
                            label="View Mode"
                            value={viewMode}
                            onChange={(e) => setViewMode(e.target.value)}
                        >
                            <MenuItem value="entireNetwork">Entire Network</MenuItem>
                            <MenuItem value="specificNode">Specific Node</MenuItem>
                        </TextField>
                    </Grid>

                    {/* Node Selection (conditional on view mode) */}
                    {viewMode === 'specificNode' && (
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label="Select Node"
                                value={selectedNode}
                                onChange={(e) => setSelectedNode(e.target.value)}
                            >
                                {nodeOptions.map((node) => (
                                    <MenuItem key={node.value} value={node.value}>
                                        {node.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    )}

                    {/* Time Range Selection */}
                    <Grid item xs={12} sm={6}>
                        
                    </Grid>
                </Grid>
            </Paper>

            {/* Traffic Graphs Layout */}
            <Grid container spacing={3}>
                {/* Main Traffic Graph */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2, height: '400px' }}>
                        <Typography variant="h6">Main Traffic Graph</Typography>
                        <Box
                            sx={{
                                mt: 2,
                                height: '90%',
                                backgroundColor: '#f5f5f5',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Typography variant="body2">Main traffic graph will be displayed here.</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};

export default TrafficAnalysis;

