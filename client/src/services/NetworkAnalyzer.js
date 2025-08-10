import { storageService, STORE_NAMES } from './StorageService';

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

  
}

export default new NetworkAnalyzer();
