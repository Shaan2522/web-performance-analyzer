import React, { useState, useEffect } from 'react';
import MemoryProfiler from '../services/MemoryProfiler';
import MemoryChart from '../components/Memory/MemoryChart';
import LeakDetector from '../components/Memory/LeakDetector';
import LoadingSpinner from '../components/UI/LoadingSpinner'; // Import LoadingSpinner

function MemoryAnalyzerPage() {
  const [snapshots, setSnapshots] = useState([]);
  const [isProfiling, setIsProfiling] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // For initial loading if any

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (isProfiling) {
        MemoryProfiler.stopProfiling();
      }
    };
  }, [isProfiling]);

  const handleStartProfiling = () => {
    setIsLoading(true);
    MemoryProfiler.startProfiling(1000); // Take snapshot every 1 second
    setIsProfiling(true);
    setSendSuccess(false);
    setSendError(null);
    // Update snapshots state periodically
    const interval = setInterval(() => {
      setSnapshots(MemoryProfiler.getSnapshots());
    }, 1000);
    setIsLoading(false);
    return () => clearInterval(interval);
  };

  const handleStopProfiling = () => {
    MemoryProfiler.stopProfiling();
    setIsProfiling(false);
  };

  const handleSendSnapshots = async () => {
    setIsLoading(true);
    setSendError(null);
    setSendSuccess(false);
    try {
      await MemoryProfiler.sendAllSnapshotsToServer();
      setSendSuccess(true);
    } catch (error) {
      setSendError('Failed to send snapshots: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="memory-analyzer-page">
      <h1>Memory Analyzer</h1>
      <p className="page-subtitle">Analyze your application's memory usage and detect potential leaks.</p>

      <div className="profiling-controls">
        <button onClick={handleStartProfiling} disabled={isProfiling} className="button primary">Start Profiling</button>
        <button onClick={handleStopProfiling} disabled={!isProfiling} className="button secondary">Stop Profiling</button>
        <button onClick={handleSendSnapshots} disabled={snapshots.length === 0} className="button primary">Send Snapshots to Server</button>
      </div>
      {sendSuccess && <p className="success-message">Snapshots sent successfully!</p>}
      {sendError && <p className="error-message">{sendError}</p>}

      <div className="memory-data-display">
        <MemoryChart snapshots={snapshots} />
        <LeakDetector snapshots={snapshots} />
      </div>
    </div>
  );
}

export default MemoryAnalyzerPage;
