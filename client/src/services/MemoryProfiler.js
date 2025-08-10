import { storageService, STORE_NAMES } from './StorageService';

class MemoryProfiler {
  constructor() {
    this.isProfiling = false;
  }

  /**
   * Takes a memory snapshot using available browser APIs.
   * Prefers performance.measureUserAgentSpecificMemory() if available, falls back to performance.memory.
   * @returns {object|null} A memory snapshot object or null if no API is available.
   */
  takeSnapshot() {
    let snapshot = null;
    if (window.performance && window.performance.measureUserAgentSpecificMemory) {
      try {
        console.warn("Using experimental performance.measureUserAgentSpecificMemory(). Ensure it's enabled.");
      } catch (e) {
        console.error('Error with measureUserAgentSpecificMemory:', e);
      }
    }

    if (window.performance && window.performance.memory) {
      snapshot = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        heapUsed: window.performance.memory.usedJSHeapSize,
        heapTotal: window.performance.memory.totalJSHeapSize,
      };
      return snapshot;
    } else {
      console.warn('No suitable memory profiling API found (performance.memory or measureUserAgentSpecificMemory).');
      return null;
    }
  }

  /**
   * Starts continuous memory profiling.
   */
  startProfiling() {
    if (this.isProfiling) {
      console.warn('Memory profiling is already active.');
      return;
    }
    console.log('Starting memory profiling...');
    this.isProfiling = true;
  }

  /**
   * Stops continuous memory profiling.
   */
  stopProfiling() {
    if (!this.isProfiling) {
      console.warn('Memory profiling is not active.');
      return;
    }
    console.log('Stopping memory profiling.');
    this.isProfiling = false;
  }
}

export default new MemoryProfiler();
