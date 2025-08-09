import ApiService from './ApiService';
import { STORE_NAMES } from './StorageService';

class MemoryProfiler {
  constructor() {
    this.snapshots = [];
    this.isProfiling = false;
    this.profilingInterval = null;
  }

  /**
   * Takes a memory snapshot using available browser APIs.
   * Prefers performance.measureUserAgentSpecificMemory() if available, falls back to performance.memory.
   * @returns {object|null} A memory snapshot object or null if no API is available.
   */
  takeSnapshot() {
    let snapshot = null;
    if (window.performance && window.performance.measureUserAgentSpecificMemory) {
      // This API is experimental and requires specific browser flags/permissions
      // It provides more detailed memory usage.
      try {
        // This is an async API, but for simplicity in this example, we'll treat it as sync
        // In a real app, you'd await this or use a callback.
        // For now, we'll just log a warning if it's not truly sync.
        console.warn("Using experimental performance.measureUserAgentSpecificMemory(). Ensure it's enabled.");
        // This API returns a Promise, so we can't directly assign its result synchronously.
        // For a synchronous snapshot, we'll rely on performance.memory for now.
        // A more robust implementation would handle this asynchronously.
      } catch (e) {
        console.error('Error with measureUserAgentSpecificMemory:', e);
      }
    }

    // Fallback to performance.memory (deprecated but widely supported)
    if (window.performance && window.performance.memory) {
      snapshot = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        heapUsed: window.performance.memory.usedJSHeapSize,
        heapTotal: window.performance.memory.totalJSHeapSize,
        // Add other relevant memory properties if needed
        // e.g., external, arrayBuffers (from measureUserAgentSpecificMemory if available)
      };
      this.snapshots.push(snapshot);
      return snapshot;
    } else {
      console.warn('No suitable memory profiling API found (performance.memory or measureUserAgentSpecificMemory).');
      return null;
    }
  }

  /**
   * Starts continuous memory profiling at a given interval.
   * @param {number} intervalMs - The interval in milliseconds to take snapshots.
   */
  startProfiling(intervalMs = 1000) {
    if (this.isProfiling) {
      console.warn('Memory profiling is already active.');
      return;
    }
    console.log(`Starting memory profiling every ${intervalMs}ms...`);
    this.isProfiling = true;
    this.snapshots = []; // Clear previous snapshots
    this.profilingInterval = setInterval(() => {
      this.takeSnapshot();
    }, intervalMs);
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
    clearInterval(this.profilingInterval);
    this.isProfiling = false;
    this.profilingInterval = null;
  }

  /**
   * Gets all collected memory snapshots.
   * @returns {Array<object>} An array of memory snapshot objects.
   */
  getSnapshots() {
    return [...this.snapshots]; // Return a copy
  }

  /**
   * Sends a specific memory snapshot to the backend.
   * @param {object} snapshot - The memory snapshot to send.
   */
  async sendSnapshotToServer(snapshot) {
    try {
      // Use ApiService for POST request
      const response = await ApiService.post('/memory', snapshot, STORE_NAMES.MEMORY);
      console.log('Memory snapshot sent:', response);
      return response;
    } catch (error) {
      console.error('Error sending memory snapshot:', error.message);
      throw error;
    }
  }

  /**
   * Sends all collected memory snapshots to the backend.
   */
  async sendAllSnapshotsToServer() {
    if (this.snapshots.length === 0) {
      console.warn('No snapshots to send.');
      return;
    }
    console.log(`Sending ${this.snapshots.length} snapshots to server...`);
    try {
      // Send snapshots one by one or as a batch
      for (const snapshot of this.snapshots) {
        await this.sendSnapshotToServer(snapshot);
      }
      console.log('All snapshots sent successfully.');
    } catch (error) {
      console.error('Failed to send all snapshots:', error);
      throw error;
    }
  }
}

export default new MemoryProfiler();
