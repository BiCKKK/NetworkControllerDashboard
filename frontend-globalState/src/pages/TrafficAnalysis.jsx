import React, { useCallback, useMemo, useEffect } from 'react';
import { Box, Grid, Paper, Typography, MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import { CartesianGrid, LineChart, XAxis, YAxis, Tooltip as RechartsTootip, Line, ResponsiveContainer } from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedNode, setTimeRange, setTrafficData } from '../slices/trafficSlice';

const TrafficAnalysis = () => {
    const dispatch = useDispatch();

    const selectedNode = useSelector((state) => state.traffic.setSelectedNode);
    const timeRange = useSelector((state) => state.traffic.setTimeRange);
    const trafficData = useSelector((state) => state.traffic.setTrafficData) || [];

    const [nodeOptions, setNodeOptions] = React.useState([]);

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
            let url = 'http://localhost:5050/api/monitoring_data';
            const params = { limit: 100 };
            if (selectedNode) {
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
            
            dispatch(setTrafficData(formattedData));
        } catch (error) {
            console.error('Error fetching monitoring data:', error);
        }
    }, [selectedNode, timeRange, dispatch]);

    useEffect(() => {
        let intervalId;
        if (timeRange) {
            // Initial fetch than polling every second
            fetchMonitoringData();
            intervalId = setInterval(fetchMonitoringData, 1000);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [selectedNode, timeRange, fetchMonitoringData]);

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
                            label="Time Range"
                            value={timeRange}
                            onChange={(e) => dispatch(setTimeRange(e.target.value))}
                        >
                            <MenuItem value="lastHour">Last Hour</MenuItem>
                            <MenuItem value="last24Hours">Last 24 Hours</MenuItem>
                            <MenuItem value="lastWeek">Last Week</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            fullWidth
                            label="Select Node"
                            value={selectedNode}
                            onChange={(e) => dispatch(setSelectedNode(e.target.value))}
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
                            {trafficData.length === 0 ? (
                                <Typography variant="body2">
                                    No traffic data available. Please adjust the filters.
                                </Typography>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={trafficData}>
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

