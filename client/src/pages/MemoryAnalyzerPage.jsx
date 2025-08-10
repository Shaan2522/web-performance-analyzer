import React, { useState, useEffect } from 'react';
import MemoryProfiler from '../services/MemoryProfiler';
import MemoryChart from '../components/Memory/MemoryChart';
import LeakDetector from '../components/Memory/LeakDetector';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useData } from '../context/DataContext';
import { STORE_NAMES } from '../services/StorageService';

function MemoryAnalyzerPage() {
  const { data, loading, error, saveData } = useData();
  const [isProfiling, setIsProfiling] = useState(false);
  const [profilingIntervalId, setProfilingIntervalId] = useState(null);

  const snapshots = data[STORE_NAMES.MEMORY] || [];

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (profilingIntervalId) {
        clearInterval(profilingIntervalId);
      }
      if (isProfiling) {
        MemoryProfiler.stopProfiling();
      }
    };
  }, [isProfiling, profilingIntervalId]);

  const handleStartProfiling = () => {
    if (isProfiling) return;

    MemoryProfiler.startProfiling(); // Start internal profiler
    setIsProfiling(true);

    const intervalId = setInterval(async () => {
      const snapshot = MemoryProfiler.takeSnapshot();
      if (snapshot) {
        await saveData(STORE_NAMES.MEMORY, snapshot);
      }
    }, 1000); // Take snapshot and save every 1 second
    setProfilingIntervalId(intervalId);
  };

  const handleStopProfiling = () => {
    if (!isProfiling) return;

    MemoryProfiler.stopProfiling();
    setIsProfiling(false);
    if (profilingIntervalId) {
      clearInterval(profilingIntervalId);
      setProfilingIntervalId(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">Error loading memory data: {error.message}</div>;

  return (
    <div className="memory-analyzer-page">
      <h1>Memory Analyzer</h1>
      <p className="page-subtitle">Analyze your application's memory usage and detect potential leaks.</p>

      <div className="profiling-controls">
        <button onClick={handleStartProfiling} disabled={isProfiling} className="button primary">Start Profiling</button>
        <button onClick={handleStopProfiling} disabled={!isProfiling} className="button secondary">Stop Profiling</button>
      </div>

      <div className="memory-data-display">
        <MemoryChart snapshots={snapshots} />
        <LeakDetector snapshots={snapshots} />
      </div>
    </div>
  );
}

export default MemoryAnalyzerPage;
