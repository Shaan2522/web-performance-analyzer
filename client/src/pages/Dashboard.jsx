import React from 'react';
import usePerformanceData from '../hooks/usePerformanceData';
import MetricCard from '../components/Dashboard/MetricCard';
import LiveChart from '../components/Dashboard/LiveChart';
import LoadingSpinner from '../components/UI/LoadingSpinner'; // Import LoadingSpinner

function DashboardPage() {
  const { performanceData, loading, error } = usePerformanceData();

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">Error loading dashboard data: {error.message}</div>;

  // Extract latest metrics for MetricCards
  const latestData = performanceData.length > 0 ? performanceData[0] : {};

  // Prepare data for charts (e.g., LCP over time)
  const lcpValues = performanceData.map(data => data.lcp).filter(lcp => lcp !== undefined && lcp !== null).reverse();
  const inpValues = performanceData.map(data => data.inp).filter(inp => inp !== undefined && inp !== null).reverse();
  const clsValues = performanceData.map(data => data.cls).filter(cls => cls !== undefined && cls !== null).reverse();

  return (
    <div className="dashboard-page">
      <h1>Performance Dashboard</h1>
      <p className="page-subtitle">Overview of your application's performance metrics.</p>

      <div className="metrics-grid">
        <MetricCard title="Latest LCP" value={latestData.lcp} type="lcp" />
        <MetricCard title="Latest INP" value={latestData.inp} type="inp" />
        <MetricCard title="Latest CLS" value={latestData.cls} type="cls" />
      </div>

      <div className="charts-grid">
        {lcpValues.length > 0 ? (
          <LiveChart data={lcpValues} title="LCP Trend (ms)" label="LCP" />
        ) : (
          <p className="no-data-message">No LCP data available for chart.</p>
        )}
        {inpValues.length > 0 ? (
          <LiveChart data={inpValues} title="INP Trend (ms)" label="INP" />
        ) : (
          <p className="no-data-message">No INP data available for chart.</p>
        )}
        {clsValues.length > 0 ? (
          <LiveChart data={clsValues} title="CLS Trend" label="CLS" />
        ) : (
          <p className="no-data-message">No CLS data available for chart.</p>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
