import React from "react";
import MainLayout from "./components/layout/MainLayout";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NetworkOverview from "./pages/NetworkOverview";
import TrafficAnalysis from "./pages/TrafficAnalysis";
import store from "./store";
import { Provider } from "react-redux";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<NetworkOverview />} />
            <Route path="/traffic-analysis" element={<TrafficAnalysis />} />
          </Routes>
        </MainLayout>
      </Router> 
    </Provider>
  );
};

export default App;
