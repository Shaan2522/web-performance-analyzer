import { onLCP, onINP, onCLS } from 'web-vitals';
import ApiService from './ApiService';
import { STORE_NAMES } from './StorageService';

class PerformanceCollector {
  constructor() {
    this.metrics = {
      lcp: null,
      inp: null,
      cls: null,
      navigation: [],
      resources: [],
      paints: [],
    };
    this.performanceObservers = [];
    this.isMonitoring = false;
  }

  startMonitoring() {
    if (this.isMonitoring) {
      console.warn('Performance monitoring is already active.');
      return;
    }

    console.log('Starting performance monitoring...');
    this.isMonitoring = true;

    // Clear previous metrics
    this.metrics = {
      lcp: null,
      inp: null,
      cls: null,
      navigation: [],
      resources: [],
      paints: [],
    };

    // Core Web Vitals
    onLCP(metric => { this.metrics.lcp = metric; });
    onINP(metric => { this.metrics.inp = metric; });
    onCLS(metric => { this.metrics.cls = metric; });

    // Navigation Timing
    const navObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.entryType === 'navigation') {
          this.metrics.navigation.push(entry.toJSON());
        }
      });
    });
    navObserver.observe({ type: 'navigation', buffered: true });
    this.performanceObservers.push(navObserver);

    // Resource Timing
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.entryType === 'resource') {
          this.metrics.resources.push(entry.toJSON());
        }
      });
    });
    resourceObserver.observe({ type: 'resource', buffered: true });
    this.performanceObservers.push(resourceObserver);

    // Paint Timing (FCP, LCP - though LCP is also from web-vitals)
    const paintObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.entryType === 'paint') {
          this.metrics.paints.push(entry.toJSON());
        }
      });
    });
    paintObserver.observe({ type: 'paint', buffered: true });
    this.performanceObservers.push(paintObserver);
  }

  stopMonitoring() {
    if (!this.isMonitoring) {
      console.warn('Performance monitoring is not active.');
      return;
    }

    console.log('Stopping performance monitoring...');
    this.performanceObservers.forEach(observer => observer.disconnect());
    this.performanceObservers = [];
    this.isMonitoring = false;
  }

  getMetrics() {
    return { ...this.metrics }; // Return a copy to prevent external modification
  }

  async sendToServer() {
    if (!this.isMonitoring) {
      console.warn('Monitoring not active. Cannot send data.');
      return;
    }

    this.stopMonitoring(); // Stop monitoring before sending

    const currentUrl = window.location.href;
    const performancePayload = {
      url: currentUrl,
    };

    // Only include CWV metrics if they are available
    if (this.metrics.lcp && this.metrics.lcp.value !== null) {
      performancePayload.lcp = this.metrics.lcp.value;
    }
    if (this.metrics.inp && this.metrics.inp.value !== null) {
      performancePayload.inp = this.metrics.inp.value;
    }
    if (this.metrics.cls && this.metrics.cls.value !== null) {
      performancePayload.cls = this.metrics.cls.value;
    }

    try {
      // Use ApiService for POST request
      const performanceResponse = await ApiService.post('/performance', performancePayload, STORE_NAMES.PERFORMANCE);
      console.log('Performance data sent:', performanceResponse);

      // You might want to send navigation, resources, paints separately or as part of a larger payload
      // For now, we'll just log them.
      console.log('Navigation Timing:', this.metrics.navigation);
      console.log('Resource Timing:', this.metrics.resources);
      console.log('Paint Timing:', this.metrics.paints);

      return performanceResponse;
    } catch (error) {
      console.error('Error sending performance data:', error.message);
      throw error; // Re-throw to allow caller to handle
    }
  }
}

export default new PerformanceCollector();
