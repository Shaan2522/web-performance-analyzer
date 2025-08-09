/**
 * Compares two memory snapshots to identify changes.
 * @param {object} snapshot1 - The older memory snapshot.
 * @param {object} snapshot2 - The newer memory snapshot.
 * @returns {object} An object detailing the differences.
 */
export const compareSnapshots = (snapshot1, snapshot2) => {
  if (!snapshot1 || !snapshot2) {
    return { error: 'Both snapshots must be provided for comparison.' };
  }

  const heapUsedDiff = snapshot2.heapUsed - snapshot1.heapUsed;
  const heapTotalDiff = snapshot2.heapTotal - snapshot1.heapTotal;

  return {
    heapUsedDiff,
    heapTotalDiff,
    // Add more detailed comparisons if other metrics are collected
  };
};

/**
 * Detects potential memory leaks based on a series of snapshots.
 * This is a simplified heuristic and might require more sophisticated algorithms for real-world scenarios.
 * @param {Array<object>} snapshots - An array of memory snapshots.
 * @returns {object} An object indicating leak status and severity.
 */
export const detectMemoryLeak = (snapshots) => {
  if (snapshots.length < 2) {
    return { status: 'insufficient_data', message: 'Need at least 2 snapshots to detect leaks.' };
  }

  // Simple heuristic: check for consistent increase in heapUsed over time
  let increasingTrend = 0;
  for (let i = 1; i < snapshots.length; i++) {
    if (snapshots[i].heapUsed > snapshots[i - 1].heapUsed) {
      increasingTrend++;
    } else if (snapshots[i].heapUsed < snapshots[i - 1].heapUsed) {
      increasingTrend--;
    }
  }

  const trendRatio = increasingTrend / (snapshots.length - 1);

  let status = 'no_leak_detected';
  let severity = 'low';
  let message = 'No significant memory leak detected.';

  if (trendRatio > 0.7) { // More than 70% of snapshots show an increase
    status = 'potential_leak';
    severity = 'high';
    message = 'High potential for memory leak: Consistent increase in heap usage.';
  } else if (trendRatio > 0.3) { // More than 30% show an increase
    status = 'possible_leak';
    severity = 'medium';
    message = 'Possible memory leak: Heap usage shows an increasing trend.';
  }

  return { status, severity, message, trendRatio };
};

/**
 * Formats memory size in bytes to a human-readable string (e.g., KB, MB).
 * @param {number} bytes - The number of bytes.
 * @returns {string} Formatted string.
 */
export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
