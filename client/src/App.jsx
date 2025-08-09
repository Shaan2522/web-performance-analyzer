import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import MonitorPage from './pages/MonitorPage';
import DashboardPage from './pages/Dashboard';
import MemoryAnalyzerPage from './pages/MemoryAnalyzerPage';
import NetworkProfilerPage from './pages/NetworkProfilerPage';
import ReportsPage from './pages/ReportsPage';
import HomePage from './pages/HomePage'; // Import HomePage from its new location
import ErrorBoundary from './components/UI/ErrorBoundary';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/monitor" element={<MonitorPage />} />
            <Route path="/memory" element={<MemoryAnalyzerPage />} />
            <Route path="/network" element={<NetworkProfilerPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </MainLayout>
      </ErrorBoundary>
    </Router>
  );
}

export default App;