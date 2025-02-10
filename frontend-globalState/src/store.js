// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import networkReducer from './slices/networkSlice';
import trafficReducer from './slices/trafficSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    network: networkReducer,
    traffic: trafficReducer,
    ui: uiReducer,
  },
});

export default store;


