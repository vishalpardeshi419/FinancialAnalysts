import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LandingPage from './pages/landing';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

import Sidebar from './components/Sidebar';
import PlanForm from './components/PlanForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard/*"
          element={
            <div style={{ display: "flex", minHeight: "100vh" }}>
              <Sidebar />
              <div style={{ flex: 1, padding: "20px" }}>
                <Routes>
                  {/* Nested routes for the dashboard */}
                  <Route path="" element={<Dashboard />} />
                  <Route path="create-plan" element={<PlanForm />} />
                </Routes>
              </div>
            </div>
          }
        />
    </Routes>      
  </Router>
  );
};

export default App;
