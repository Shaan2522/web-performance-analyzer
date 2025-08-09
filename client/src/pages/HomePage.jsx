import React from 'react';

function HomePage() {
  return (
    <div className="home-page">
      <h1>Welcome to WebPerf Analyzer!</h1>
      <p className="tagline">Your comprehensive tool for web performance monitoring and analysis.</p>

      <section className="features-section">
        <h2>Key Features</h2>
        <div className="feature-card">
          <h3>Performance Monitoring</h3>
          <p>Track Core Web Vitals (LCP, INP, CLS), navigation timings, resource loading, and paint metrics in real-time. Understand how your page loads and renders for users.</p>
        </div>
        <div className="feature-card">
          <h3>Memory Analysis</h3>
          <p>Take memory snapshots over time to identify increasing heap usage, potential memory leaks, and optimize your application's memory footprint.</p>
        
        </div>
        <div className="feature-card">
          <h3>Network Profiling</h3>
          <p>Visualize network requests with a waterfall chart, analyze resource loading times, identify bottlenecks, and optimize asset delivery.</p>
        </div>
        <div className="feature-card">
          <h3>Interactive Dashboard</h3>
          <p>View key performance metrics and trends on an interactive dashboard with real-time updates. Get a quick overview of your application's health.</p>
        </div>
        <div className="feature-card">
          <h3>Comprehensive Reporting</h3>
          <p>Generate detailed performance and memory reports in various formats (JSON, HTML, PDF) for historical analysis, sharing, and compliance.</p>
        </div>
        <div className="feature-card">
          <h3>Offline Support</h3>
          <p>Continue collecting and storing performance data even when offline. Data is automatically synced to the server once connectivity is restored.</p>
        </div>
      </section>

      <section className="get-started-section">
        <h2>Get Started</h2>
        <p>Navigate through the <b>Navbar</b> at the top to explore different analysis tools and gain insights into your web application's performance.</p>
      </section>
    </div>
  );
}

export default HomePage;