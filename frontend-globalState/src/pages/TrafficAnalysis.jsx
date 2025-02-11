import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Box,
    Grid,
    Paper,
    Typography,
    MenuItem,
    TextField,
} from "@mui/material";
import ReactApexChart from "react-apexcharts"; 
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedNode, setTimeRange, setTrafficData } from "../slices/trafficSlice";

// Sample options for IP address and protocol filters
const ipOptions = [
    { label: "192.168.1.1", value: "192.168.1.1" },
    { label: "10.0.0.1", value: "10.0.0.1" },
    { label: "172.16.0.1", value: "172.16.0.1" },
];
  
const protocolOptions = [
    { label: "HTTP", value: "HTTP" },
    { label: "HTTPS", value: "HTTPS" },
    { label: "TCP", value: "TCP" },
    { label: "UDP", value: "UDP" },
];

// Sample data generator for historical traffic
const generateSampleData = () => {
    const data = [];
    const now = Date.now();
    // Generate data points for the past 1 hour (60 data points, one per minute)
    for (let i = 60; i >= 0; i--) {
        data.push({
        timestamp: now - i * 60 * 1000,
        bandwidth: Math.floor(Math.random() * 1000) + 100, // sample random value
        });
    }
    return data;
};

const TrafficAnalysis = () => {
    const dispatch = useDispatch();
    // Global state for traffic filters
    const selectedNode = useSelector((state) => state.traffic.selectedNode);
    const timeRange = useSelector((state) => state.traffic.timeRange);
    const trafficData = useSelector((state) => state.traffic.trafficData) || [];
    
    // Local state for additional filters (can be later moved to Redux)
    const [selectedIP, setSelectedIP] = useState("");
    const [selectedProtocol, setSelectedProtocol] = useState("");
    const [nodeOptions, setNodeOptions] = useState([]);

    // Fetch node options from topology API
    useEffect(() => {
        const fetchNodes = async () => {
            try {
                const response = await axios.get("http://localhost:5050/api/topology");
                const { devices } = response.data;
                const options = devices.map((device) => ({
                    label: device.name,
                    value: device.id,
                }));
                setNodeOptions(options);
            } catch (error) {
                console.error("Error fetching node options:", error);
            }
        };
        fetchNodes();
    }, []);

    useEffect(() => {
        const sample = generateSampleData();
        dispatch(setTrafficData(sample));
    }, []);

    // Memoize node options
    const memoizedNodeOptions = useMemo(() => nodeOptions, [nodeOptions]);

    // ApexCharts configuration for mixed line and bar chart
    const chartOptions = {
        chart: {
            id: "traffic-chart",
            animations: {
                enabled: true,
                easing: "linear",
                dynamicAnimation: {
                    speed: 1000,
                },
            },
            zoom: {
                enabled: true,
            },
        },
        xaxis: {
            type: "datetime",
            labels: {
                datetimeUTC: false,
            },
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            x: {
                format: "HH:mm:ss",
            },
        },
        legend: {
            show: true,
        },
    };

    // We define two series: one line series for live traffic and one bar series for historical volume.
    // For demonstration, both series use the same sample data.
    const chartSeries = [
        {
            name: "Live Traffic",
            type: "line",
            data: trafficData.map((point) => [point.timestamp, point.bandwidth]),
        },
        {
            name: "Historical Traffic",
            type: "column",
            data: trafficData.map((point) => [point.timestamp, point.bandwidth * 0.8]), // example: historical volume slightly lower
        },
    ];

    return (
        <>
        {/* Filters Section */}
            <Paper elevation={3} sx={{ p: 2, mb: 3, mt: -10 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
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
                    <Grid item xs={12} sm={3}>
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
                            {memoizedNodeOptions.map((node) => (
                                <MenuItem key={node.value} value={node.value}>
                                {node.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            select
                            fullWidth
                            label="IP Address"
                            value={selectedIP}
                            onChange={(e) => setSelectedIP(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Select IP</em>
                            </MenuItem>
                            {ipOptions.map((ip) => (
                                <MenuItem key={ip.value} value={ip.value}>
                                {ip.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            select
                            fullWidth
                            label="Protocol"
                            value={selectedProtocol}
                            onChange={(e) => setSelectedProtocol(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Select Protocol</em>
                            </MenuItem>
                            {protocolOptions.map((protocol) => (
                                <MenuItem key={protocol.value} value={protocol.value}>
                                {protocol.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid> 
                </Grid>
            </Paper>

            {/* Traffic Graph */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <Paper elevation={3} sx={{ p: 2, height: "500px" }}>
                        <Typography variant="h6" mb={2}>
                            Network Traffic Analysis
                        </Typography>
                        <Box
                            sx={{
                                height: "90%",
                                width: "100%",
                                backgroundColor: "#f5f5f5",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <ReactApexChart
                                options={chartOptions}
                                series={chartSeries}
                                type="line"
                                height="100%"
                                width="100%"
                                style={{height: "100%", width: "100%"}}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};

export default TrafficAnalysis;


