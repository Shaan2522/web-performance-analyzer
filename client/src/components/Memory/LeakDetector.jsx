import React, { useEffect, useState } from 'react';
import { detectMemoryLeak } from '../../utils/memoryUtils';

function LeakDetector({ snapshots }) {
  const [leakAnalysis, setLeakAnalysis] = useState(null);

  useEffect(() => {
    if (snapshots && snapshots.length > 1) {
      setLeakAnalysis(detectMemoryLeak(snapshots));
    } else {
      setLeakAnalysis(null);
    }
  }, [snapshots]);

  if (!leakAnalysis) {
    return (
      <div className="leak-detector">
        <h3>Memory Leak Analysis</h3>
        <p>Insufficient data for leak detection. Take more snapshots.</p>
      </div>
    );
  }

  let statusColor = 'gray';
  switch (leakAnalysis.severity) {
    case 'high':
      statusColor = 'red';
      break;
    case 'medium':
      statusColor = 'orange';
      break;
    case 'low':
      statusColor = 'green';
      break;
    default:
      statusColor = 'gray';
  }

  return (
    <div className="leak-detector">
      <h3>Memory Leak Analysis</h3>
      <p>Status: <span style={{ color: statusColor }}>{leakAnalysis.status.replace(/_/g, ' ').toUpperCase()}</span></p>
      <p>Severity: <span style={{ color: statusColor }}>{leakAnalysis.severity.toUpperCase()}</span></p>
      <p>Message: {leakAnalysis.message}</p>
      {leakAnalysis.trendRatio !== undefined && (
        <p>Heap Usage Trend: {(leakAnalysis.trendRatio * 100).toFixed(2)}% increasing snapshots</p>
      )}
    </div>
  );
}

export default LeakDetector;
