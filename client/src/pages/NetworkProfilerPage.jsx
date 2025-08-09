import React, { useState, useEffect } from 'react';
import NetworkAnalyzer from '../services/NetworkAnalyzer';
import WaterfallChart from '../components/Network/WaterfallChart';
import ResourceTable from '../components/Network/ResourceTable';
import LoadingSpinner from '../components/UI/LoadingSpinner'; // Import LoadingSpinner

function NetworkProfilerPage() {
  const [requests, setRequests] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // For initial loading if any

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (isMonitoring) {
        NetworkAnalyzer.stopMonitoring();
      }
    };
  }, [isMonitoring]);

  const handleStartMonitoring = () => {
    setIsLoading(true);
    NetworkAnalyzer.startMonitoring();
    setIsMonitoring(true);
    setSendSuccess(false);
    setSendError(null);
    // Update requests state periodically
    const interval = setInterval(() => {
      setRequests(NetworkAnalyzer.getRequests());
    }, 1000);
    setIsLoading(false);
    return () => clearInterval(interval);
  };

  const handleStopMonitoring = () => {
    NetworkAnalyzer.stopMonitoring();
    setIsMonitoring(false);
  };

  const handleSendRequests = async () => {
    setIsLoading(true);
    setSendError(null);
    setSendSuccess(false);
    try {
      await NetworkAnalyzer.sendRequestsToServer();
      setSendSuccess(true);
    } catch (error) {
      setSendError('Failed to send network requests: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="network-profiler-page">
      <h1>Network Profiler</h1>
      <p className="page-subtitle">Analyze network requests and identify performance bottlenecks.</p>

      <div className="profiling-controls">
        <button onClick={handleStartMonitoring} disabled={isMonitoring} className="button primary">Start Monitoring</button>
        <button onClick={handleStopMonitoring} disabled={!isMonitoring} className="button secondary">Stop Monitoring</button>
        <button onClick={handleSendRequests} disabled={requests.length === 0} className="button primary">Send Requests to Server</button>
      </div>
      {sendSuccess && <p className="success-message">Network requests sent successfully!</p>}
      {sendError && <p className="error-message">{sendError}</p>}

      <div className="network-data-display">
        <WaterfallChart data={requests} />
        <ResourceTable resources={requests} />
      </div>
    </div>
  );
}

export default NetworkProfilerPage;
