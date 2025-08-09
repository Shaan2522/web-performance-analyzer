import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatBytes } from '../../utils/memoryUtils';

function MemoryChart({ snapshots }) {
  // Recharts expects data in an array of objects format
  // Each object should have a key for X-axis (e.g., timestamp) and Y-axis (e.g., heapUsed)
  const chartData = snapshots.map(s => ({
    timestamp: new Date(s.timestamp).toLocaleTimeString(),
    heapUsed: s.heapUsed,
    heapTotal: s.heapTotal,
  }));

  return (
    <div className="memory-chart">
      <h3>Memory Usage Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis tickFormatter={formatBytes} />
          <Tooltip formatter={(value) => formatBytes(value)} />
          <Legend />
          <Line type="monotone" dataKey="heapUsed" stroke="#8884d8" name="Heap Used" />
          <Line type="monotone" dataKey="heapTotal" stroke="#82ca9d" name="Heap Total" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MemoryChart;
