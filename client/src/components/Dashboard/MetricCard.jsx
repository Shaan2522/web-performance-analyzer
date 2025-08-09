import React from 'react';
import { formatMetricValue, getMetricStatus } from '../../utils/performanceUtils';

function MetricCard({ title, value, type }) {
  const status = getMetricStatus(value, type);
  let statusColor = 'gray';

  switch (status) {
    case 'good':
      statusColor = 'green';
      break;
    case 'needs-improvement':
      statusColor = 'orange';
      break;
    case 'poor':
      statusColor = 'red';
      break;
    default:
      statusColor = 'gray';
  }

  return (
    <div className="metric-card">
      <h3>{title}</h3>
      <p className={`metric-value status-${status}`}>
        {formatMetricValue(value, type)}
      </p>
      <p className="metric-status" style={{ color: statusColor }}>
        Status: {status.charAt(0).toUpperCase() + status.slice(1)}
      </p>
    </div>
  );
}

export default MetricCard;
