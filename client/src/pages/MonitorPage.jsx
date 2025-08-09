import React, { useEffect, useState } from 'react';
import PerformanceCollector from '../services/PerformanceCollector';
import { formatMetricValue, getMetricStatus } from '../utils/performanceUtils';
import LoadingSpinner from '../components/UI/LoadingSpinner'; // Import LoadingSpinner

function MonitorPage() {
  const [metrics, setMetrics] = useState(PerformanceCollector.getMetrics());
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);

  useEffect(() => {
    // Start monitoring when component mounts
    PerformanceCollector.startMonitoring();
    setIsLoadingMetrics(false); // Metrics start collecting immediately

    // Update metrics state periodically (e.g., every second) to show live data
    const interval = setInterval(() => {
      setMetrics(PerformanceCollector.getMetrics());
    }, 1000);

    // Cleanup function: stop monitoring and send data when component unmounts
    return () => {
      clearInterval(interval);
      PerformanceCollector.stopMonitoring();
    };
  }, []);

  const handleSendMetrics = async () => {
    setIsSending(true);
    setSendError(null);
    setSendSuccess(false);
    try {
      await PerformanceCollector.sendToServer();
      setSendSuccess(true);
    } catch (error) {
      setSendError('Failed to send data: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSending(false);
    }
  };

  if (isLoadingMetrics) return <LoadingSpinner />;

  return (
    <div className="monitor-page"> {/* Added monitor-page class */} 
      <h1>Performance Monitor</h1>
      <p className="page-subtitle">Monitoring performance metrics for the current page.</p> {/* Added page-subtitle class */} 

      <div className="profiling-controls">
        <button onClick={handleSendMetrics} disabled={isSending}>
          {isSending ? 'Sending...' : 'Send Metrics to Server'}
        </button>
      </div>
      {sendSuccess && (
        <p style={{ textAlign: 'center' }} className="success-message">
          Metrics sent successfully!
        </p>
      )}
      {sendError && (
        <p style={{ color: 'red', textAlign: 'center' }} className="error-message">
          {sendError}
        </p>
      )}

      <div className="monitor-metrics-grid"> {/* New container for grid layout */} 
        <div className="metric-section"> {/* Added metric-section class */} 
          <h2>Core Web Vitals</h2>
          <div>
            <h3>LCP (Largest Contentful Paint):</h3>
            <p>
              Value: {formatMetricValue(metrics.lcp?.value, 'lcp')}
              <span className={`status-${getMetricStatus(metrics.lcp?.value, 'lcp')}`}>
                ({getMetricStatus(metrics.lcp?.value, 'lcp')})
              </span>
            </p>
            <h3>INP (Interaction to Next Paint):</h3>
            <p>
              Value: {formatMetricValue(metrics.inp?.value, 'inp')}
              <span className={`status-${getMetricStatus(metrics.inp?.value, 'inp')}`}>
                ({getMetricStatus(metrics.inp?.value, 'inp')})
              </span>
            </p>
            <h3>CLS (Cumulative Layout Shift):</h3>
            <p>
              Value: {formatMetricValue(metrics.cls?.value, 'cls')}
              <span className={`status-${getMetricStatus(metrics.cls?.value, 'cls')}`}>
                ({getMetricStatus(metrics.cls?.value, 'cls')})
              </span>
            </p>
          </div>
        </div>

        <div className="metric-section"> {/* Added metric-section class */} 
          <h2>Navigation Timing</h2>
          {metrics.navigation.length > 0 ? (
            <ul>
              {metrics.navigation.map((nav, index) => (
                <li key={index}>Duration: {nav.duration.toFixed(2)} ms, Type: {nav.type}</li>
              ))}
            </ul>
          ) : (
            <p>No navigation timing data collected yet.</p>
          )}
        </div>

        <div className="metric-section"> {/* Added metric-section class */} 
          <h2>Paint Timing</h2>
          {metrics.paints.length > 0 ? (
            <ul>
              {metrics.paints.map((paint, index) => (
                <li key={index}>Name: {paint.name}, Start: {paint.startTime.toFixed(2)} ms</li>
              ))}
            </ul>
          ) : (
            <p>No paint timing data collected yet.</p>
          )}
        </div>
      </div> {/* End of monitor-metrics-grid */} 

      <div className="metric-section"> {/* Resource Timing remains full width */} 
        <h2>Resource Timing ({metrics.resources.length} resources)</h2>
        {metrics.resources.length > 0 ? (
          <ul>
            {metrics.resources.map((resource, index) => (
              <li key={index}>URL: {resource.name.substring(0, 50)}..., Duration: {resource.duration.toFixed(2)} ms</li>
            ))}
          </ul>
        ) : (
          <p>No resource timing data collected yet.</p>
        )}
      </div>
    </div>
  );
}

export default MonitorPage;
