import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isNetworkConnected: false,
    isSimulationRunning: false,
    simulationStatus: '',
    nodes: [],
    edges: [],
    nodeCount: 0, 
    activeNodeCount: 0, 
    lastUpdate: null,
};

const networkSlice = createSlice({
    name: 'network',
    initialState,
    reducers: {
        setNetworkConnected(state, action) {
            state.isNetworkConnected = action.payload;
        },
        setSimulationRunning(state, action) {
            state.isSimulationRunning = action.payload;
        },
        setSimulationStatus(state, action) {
            state.simulationStatus = action.payload;
        },
        setNodes(state, action) {
            state.nodes = action.payload;
        },
        setEdges(state, action) {
            state.edges = action.payload;
        },
        setNodeCount(state, action) {
            state.nodeCount = action.payload;
        },
        setActiveNodeCount(state, action) {
            state.activeNodeCount = action.payload;
        },
        setLastUpdate(state, action) {
            state.lastUpdate = action.payload;
        },
    },
});

export const {
    setNetworkConnected,
    setSimulationRunning,
    setSimulationStatus,
    setNodes,
    setEdges,
    setNodeCount,
    setActiveNodeCount,
    setLastUpdate,
} = networkSlice.actions;
export default networkSlice.reducer;
