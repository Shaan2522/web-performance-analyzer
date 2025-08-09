/**
 * Formats time in milliseconds to a human-readable string.
 * @param {number} ms - Time in milliseconds.
 * @returns {string} Formatted time string.
 */
export const formatTime = (ms) => {
  if (ms < 1000) {
    return `${ms.toFixed(2)} ms`;
  } else {
    return `${(ms / 1000).toFixed(2)} s`;
  }
};

/**
 * Analyzes a single resource timing entry to identify potential bottlenecks.
 * @param {PerformanceResourceTiming} entry - A resource timing entry.
 * @returns {object} Analysis results.
 */
export const analyzeResource = (entry) => {
  const dnsLookup = entry.domainLookupEnd - entry.domainLookupStart;
  const tcpConnect = entry.connectEnd - entry.connectStart;
  const requestTime = entry.responseStart - entry.requestStart;
  const responseTime = entry.responseEnd - entry.responseStart;
  const totalTime = entry.duration;

  let bottleneck = 'None';
  if (dnsLookup > 50) bottleneck = 'DNS Lookup';
  if (tcpConnect > 50) bottleneck = 'TCP Connect';
  if (requestTime > 100) bottleneck = 'Request Time';
  if (responseTime > 100) bottleneck = 'Response Time';

  return {
    dnsLookup,
    tcpConnect,
    requestTime,
    responseTime,
    totalTime,
    bottleneck,
  };
};

/**
 * Filters network requests based on type or URL.
 * @param {Array<PerformanceResourceTiming>} requests - Array of resource timing entries.
 * @param {string} filterType - Type to filter by (e.g., 'script', 'img', 'css').
 * @param {string} filterUrl - Substring to filter URL by.
 * @returns {Array<PerformanceResourceTiming>} Filtered array.
 */
export const filterRequests = (requests, filterType = '', filterUrl = '') => {
  return requests.filter(req => {
    const typeMatch = filterType ? req.initiatorType === filterType : true;
    const urlMatch = filterUrl ? req.name.includes(filterUrl) : true;
    return typeMatch && urlMatch;
  });
};

/**
 * Sorts network requests.
 * @param {Array<PerformanceResourceTiming>} requests - Array of resource timing entries.
 * @param {string} sortBy - Key to sort by (e.g., 'duration', 'name', 'startTime').
 * @param {string} sortOrder - 'asc' or 'desc'.
 * @returns {Array<PerformanceResourceTiming>} Sorted array.
 */
export const sortRequests = (requests, sortBy = 'startTime', sortOrder = 'asc') => {
  return [...requests].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    // Handle string comparison for 'name'
    if (sortBy === 'name') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};
