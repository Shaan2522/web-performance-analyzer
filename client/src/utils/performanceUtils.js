export const formatMetricValue = (value, type) => {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  switch (type) {
    case 'lcp':
    case 'inp':
      return `${value.toFixed(2)} ms`;
    case 'cls':
      return value.toFixed(4);
    default:
      return value.toString();
  }
};

export const getMetricStatus = (value, type) => {
  if (value === null || value === undefined) {
    return 'unknown';
  }
  switch (type) {
    case 'lcp': // Good: <= 2.5s, Needs Improvement: <= 4.0s, Poor: > 4.0s
      return value <= 2500 ? 'good' : (value <= 4000 ? 'needs-improvement' : 'poor');
    case 'inp': // Good: <= 200ms, Needs Improvement: <= 500ms, Poor: > 500ms
      return value <= 200 ? 'good' : (value <= 500 ? 'needs-improvement' : 'poor');
    case 'cls': // Good: <= 0.1, Needs Improvement: <= 0.25, Poor: > 0.25
      return value <= 0.1 ? 'good' : (value <= 0.25 ? 'needs-improvement' : 'poor');
    default:
      return 'unknown';
  }
};

// Add more helper functions as needed, e.g., for calculating averages, filtering data, etc.
