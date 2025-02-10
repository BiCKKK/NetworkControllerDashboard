// Imported to the main Network Overview page.
// Differnet features can be spead out on new pages, for now there is an issue with network topology getting 
// reset after page change
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import { CartesianGrid, LineChart, XAxis, YAxis, Tooltip as RechartsTootip, Line, ResponsiveContainer } from 'recharts';

const TrafficAnalysis = () => {
    const [viewMode, setViewMode] = useState('entireNetwork');
    const [selectedNode, setSelectedNode] = useState('');
    const [timeRange, setTimeRange] = useState('lastHour');
    const [nodeOptions, setNodeOptions] = useState([]);
    const [monitoringData, setMonitoringData] = useState([]);

    useEffect(() => {
        const fetchNodes = async () => {
            try {
                const response = await axios.get('http://localhost:5050/api/topology');
                const { devices } = response.data;

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

    const fetchMonitoringData = useCallback(async () => {
        try {
            const url = 'http://localhost:5050/api/monitoring_data';
            const params = { limit: 100 };
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
            
            const formattedData = response.data.map(point => ({
                timestamp: new Date(point.timestamp).getTime(),
                bandwidth: point.bandwidth,
            }));
            
            setMonitoringData(formattedData);
        } catch (error) {
            console.error('Error fetching monitoring data:', error);
        }
    }, [viewMode, selectedNode, timeRange]);


    useEffect(() => {
        let intervalId;
        if ((viewMode === 'entireNetwork' || (viewMode === 'specificNode' && selectedNode))) {
            // Initial fetch than polling every second
            fetchMonitoringData();
            intervalId = setInterval(fetchMonitoringData, 1000);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [viewMode, selectedNode, timeRange, fetchMonitoringData]);

    // Memoise node options for the dropdown
    const memoisedNodeOptions = useMemo(() => nodeOptions, [nodeOptions]);

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
                                <MenuItem value="">
                                    <em>Select a node</em>
                                </MenuItem>
                                {memoisedNodeOptions.map((node) => (
                                    <MenuItem key={node.value} value={node.value}>
                                        {node.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    )}

                    {/* Time Range Selection */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            fullwidth
                            label="Time Range"
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                        >
                            <MenuItem value="lastHour">Last Hour</MenuItem>
                            <MenuItem value="last24Hours">Last 24 Hours</MenuItem>
                            <MenuItem value="lastWeek">Last Week</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>

            {/* Traffic Graphs Layout */}
            <Grid container spacing={3}>
                {/* Main Traffic Graph */}
                <Grid item xs={12} md={12}>
                    <Paper elevation={3} sx={{ p: 2, height: '400px' }}>
                        <Typography variant="h6" mb={2}>
                            Network Traffic Graph
                        </Typography>
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
                            {monitoringData.length === 0 ? (
                                <Typography variant="body2">
                                    No traffic data available. Please adjust the filters.
                                </Typography>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={monitoringData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis 
                                            dataKey="timestamp"
                                            type="number"
                                            domain={['auto', 'auto']}
                                            tickFormatter={(timestamp) => 
                                                new Date(timestamp).toLocaleTimeString()
                                            }
                                        />
                                        <YAxis
                                            label={{
                                                value: 'Bandwidth (bytes/s)',
                                                angle: -90,
                                                position: 'insideLeft',
                                                style: { textAnchor: 'middle' },
                                            }}
                                        />
                                        <RechartsTootip
                                            labelFormatter={(timestamp) => 
                                                new Date(timestamp).toLocaleTimeString()
                                            }
                                            formatter={(value) => [`${value} bytes/s`, 'Bandwidth']}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="bandwidth"
                                            stroke='#8884d8'
                                            dot={false}
                                            isAnimationActive={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};

export default TrafficAnalysis;

