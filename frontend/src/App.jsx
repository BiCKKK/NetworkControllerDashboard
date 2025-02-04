import React from "react";
import MainLayout from "./components/layout/MainLayout";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NetworkOverview from "./pages/NetworkOverview";
import TrafficAnalysis from "./pages/TrafficAnalysis";

const App = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<NetworkOverview />} />
          <Route path="/traffic-analysis" element={<TrafficAnalysis />} />
        </Routes>
      </MainLayout>
    </Router> 
  );
};

export default App;
