import ApiService from './ApiService';

class ReportGenerator {
  constructor() {}

  async fetchPerformanceData(startDate, endDate) {
    try {
      const response = await ApiService.get('/performance', { startDate, endDate });
      return response;
    } catch (error) {
      console.error('Error fetching performance data for report:', error.message);
      throw error;
    }
  }

  async fetchMemoryData(startDate, endDate) {
    try {
      const response = await ApiService.get('/memory', { startDate, endDate });
      return response;
    } catch (error) {
      console.error('Error fetching memory data for report:', error.message);
      throw error;
    }
  }

  /**
   * Generates a comprehensive performance report.
   * @param {Date} startDate - Start date for data collection.
   * @param {Date} endDate - End date for data collection.
   * @returns {object} An object containing performance and memory data.
   */
  async generateReport(startDate, endDate) {
    try {
      const performanceData = await this.fetchPerformanceData(startDate, endDate);
      const memoryData = await this.fetchMemoryData(startDate, endDate);

      const report = {
        generatedAt: new Date().toISOString(),
        dateRange: {
          start: startDate ? startDate.toISOString() : 'All Time',
          end: endDate ? endDate.toISOString() : 'All Time',
        },
        performanceMetrics: performanceData,
        memorySnapshots: memoryData,
        // Add more sections as needed (e.g., network data, custom events)
      };
      return report;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  /**
   * Formats a report into a human-readable HTML string.
   * @param {object} report - The report object.
   * @returns {string} HTML string of the report.
   */
  formatReportToHtml(report) {
    let html = `<h1>Performance Report</h1>`;
    html += `<p>Generated At: ${new Date(report.generatedAt).toLocaleString()}</p>`;
    html += `<p>Date Range: ${report.dateRange.start} to ${report.dateRange.end}</p>`;

    html += `<h2>Performance Metrics</h2>`;
    if (report.performanceMetrics && report.performanceMetrics.length > 0) {
      html += `<table border="1" style="width:100%; border-collapse: collapse;">`;
      html += `<thead><tr><th>URL</th><th>LCP (ms)</th><th>INP (ms)</th><th>CLS</th><th>Timestamp</th></tr></thead>`;
      html += `<tbody>`;
      report.performanceMetrics.forEach(metric => {
        html += `<tr>
          <td>${metric.url}</td>
          <td>${metric.lcp ? metric.lcp.toFixed(2) : 'N/A'}</td>
          <td>${metric.inp ? metric.inp.toFixed(2) : 'N/A'}</td>
          <td>${metric.cls ? metric.cls.toFixed(4) : 'N/A'}</td>
          <td>${new Date(metric.timestamp).toLocaleString()}</td>
        </tr>`;
      });
      html += `</tbody></table>`;
    } else {
      html += `<p>No performance metrics found for this period.</p>`;
    }

    html += `<h2>Memory Snapshots</h2>`;
    if (report.memorySnapshots && report.memorySnapshots.length > 0) {
      html += `<table border="1" style="width:100%; border-collapse: collapse;">`;
      html += `<thead><tr><th>URL</th><th>Heap Used (Bytes)</th><th>Heap Total (Bytes)</th><th>Timestamp</th></tr></thead>`;
      html += `<tbody>`;
      report.memorySnapshots.forEach(snapshot => {
        html += `<tr>
          <td>${snapshot.url}</td>
          <td>${snapshot.heapUsed}</td>
          <td>${snapshot.heapTotal}</td>
          <td>${new Date(snapshot.timestamp).toLocaleString()}</td>
        </tr>`;
      });
      html += `</tbody></table>`;
    } else {
      html += `<p>No memory snapshots found for this period.</p>`;
    }

    return html;
  }
}

export default new ReportGenerator();