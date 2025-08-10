import React, { useState, useEffect } from 'react';
import NetworkAnalyzer from '../services/NetworkAnalyzer';
import WaterfallChart from '../components/Network/WaterfallChart';
import ResourceTable from '../components/Network/ResourceTable';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useData } from '../context/DataContext';
import { STORE_NAMES } from '../services/StorageService';

function NetworkProfilerPage() {
  const { data, loading, error, saveData } = useData();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringIntervalId, setMonitoringIntervalId] = useState(null);

  const requests = data[STORE_NAMES.NETWORK] || [];

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (monitoringIntervalId) {
        clearInterval(monitoringIntervalId);
      }
      if (isMonitoring) {
        NetworkAnalyzer.stopMonitoring();
      }
    };
  }, [isMonitoring, monitoringIntervalId]);

  const handleStartMonitoring = () => {
    if (isMonitoring) return;

    NetworkAnalyzer.startMonitoring();
    setIsMonitoring(true);

    const intervalId = setInterval(async () => {
      const currentRequests = NetworkAnalyzer.getRequests();
      if (currentRequests.length > 0) {
        // Save the entire array of requests as one record for simplicity
        // In a real app, you might want to save individual requests
        await saveData(STORE_NAMES.NETWORK, { requests: currentRequests });
      }
    }, 1000); // Save requests every 1 second
    setMonitoringIntervalId(intervalId);
  };

  const handleStopMonitoring = () => {
    if (!isMonitoring) return;

    NetworkAnalyzer.stopMonitoring();
    setIsMonitoring(false);
    if (monitoringIntervalId) {
      clearInterval(monitoringIntervalId);
      setMonitoringIntervalId(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">Error loading network data: {error.message}</div>;

  return (
    <div className="network-profiler-page">
      <h1>Network Profiler</h1>
      <p className="page-subtitle">Analyze network requests and identify performance bottlenecks.</p>

      <div className="profiling-controls">
        <button onClick={handleStartMonitoring} disabled={isMonitoring} className="button primary">Start Monitoring</button>
        <button onClick={handleStopMonitoring} disabled={!isMonitoring} className="button secondary">Stop Monitoring</button>
      </div>

      <div className="network-data-display">
        <WaterfallChart data={requests.length > 0 ? requests[requests.length - 1].requests : []} />
        <ResourceTable resources={requests.length > 0 ? requests[requests.length - 1].requests : []} />
      </div>
    </div>
  );
}

export default NetworkProfilerPage;
