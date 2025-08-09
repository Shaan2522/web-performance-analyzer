import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class NetworkAnalyzer {
  constructor() {
    this.resourceTimings = [];
    this.performanceObserver = null;
    this.isMonitoring = false;
  }

  startMonitoring() {
    if (this.isMonitoring) {
      console.warn('Network monitoring is already active.');
      return;
    }

    console.log('Starting network monitoring...');
    this.isMonitoring = true;
    this.resourceTimings = []; // Clear previous data

    this.performanceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.entryType === 'resource') {
          this.resourceTimings.push(entry.toJSON());
        }
      });
    });
    this.performanceObserver.observe({ type: 'resource', buffered: true });
  }

  stopMonitoring() {
    if (!this.isMonitoring) {
      console.warn('Network monitoring is not active.');
      return;
    }

    console.log('Stopping network monitoring.');
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    this.isMonitoring = false;
  }

  getRequests() {
    return [...this.resourceTimings]; // Return a copy
  }

  async sendRequestsToServer() {
    if (this.resourceTimings.length === 0) {
      console.warn('No network requests to send.');
      return;
    }

    this.stopMonitoring(); // Stop monitoring before sending

    try {
      // For simplicity, sending all collected resources in one go.
      // In a real app, you might batch or send periodically.
      const response = await axios.post(`${API_BASE_URL}/network`, { requests: this.resourceTimings });
      console.log('Network requests sent:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending network requests:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
}

export default new NetworkAnalyzer();
