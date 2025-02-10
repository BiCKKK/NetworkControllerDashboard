import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedNode: '',
    timeRange: 'lastHour',
    trafficData: [],
};

const trafficSlice = createSlice({
    name: 'traffic',
    initialState,
    reducers: {
        setSelectedNode(state, action) {
            state.selectedNode = action.payload;
        },
        setTimeRange(state, action) {
            state.timeRange = action.payload;
        },
        setTrafficData(state, action) {
            state. trafficData = action.payload;
        },
    },
});

export const { setSelectedNode, setTimeRange, setTrafficData } = trafficSlice.actions;
export default trafficSlice.reducer;