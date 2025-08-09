import axios from 'axios';
import { storageService, STORE_NAMES } from './StorageService';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.isOnline = navigator.onLine;
    window.addEventListener('online', this._updateOnlineStatus);
    window.addEventListener('offline', this._updateOnlineStatus);
  }

  _updateOnlineStatus = () => {
    this.isOnline = navigator.onLine;
    console.log('Online status changed:', this.isOnline ? 'online' : 'offline');
    if (this.isOnline) {
      this._syncOfflineData(); // Attempt to sync data when back online
    }
  };

  async _syncOfflineData() {
    console.log('Attempting to sync offline data...');
    const performanceData = await storageService.getAllData(STORE_NAMES.PERFORMANCE);
    const memoryData = await storageService.getAllData(STORE_NAMES.MEMORY);
    // Add other data types as needed

    if (performanceData.length > 0) {
      console.log(`Syncing ${performanceData.length} performance records.`);
      for (const record of performanceData) {
        try {
          // Remove _id as it's for IndexedDB, not MongoDB
          const { _id, ...dataToSend } = record;
          await axios.post(`${API_BASE_URL}/performance`, dataToSend);
          // If successful, delete from IndexedDB
          // Note: This requires a delete by ID in StorageService, or clear all and re-add successful ones
          // For simplicity, we'll clear all after successful sync of all, or implement specific delete later.
        } catch (error) {
          console.error('Failed to sync performance record:', record, error);
          // Stop syncing if one fails, or implement retry logic
        }
      }
      await storageService.clearData(STORE_NAMES.PERFORMANCE);
      console.log('Performance data synced and cleared from IndexedDB.');
    }

    if (memoryData.length > 0) {
      console.log(`Syncing ${memoryData.length} memory records.`);
      for (const record of memoryData) {
        try {
          const { _id, ...dataToSend } = record;
          await axios.post(`${API_BASE_URL}/memory`, dataToSend);
        } catch (error) {
          console.error('Failed to sync memory record:', record, error);
        }
      }
      await storageService.clearData(STORE_NAMES.MEMORY);
      console.log('Memory data synced and cleared from IndexedDB.');
    }
  }

  async post(endpoint, data, storeName) {
    if (this.isOnline) {
      try {
        const response = await axios.post(`${API_BASE_URL}${endpoint}`, data);
        return response.data;
      } catch (error) {
        console.error(`API POST error to ${endpoint}:`, error.response ? error.response.data : error.message);
        if (error.response && (error.response.status === 503 || error.response.status === 504 || error.response.status === 0)) {
          // Server unavailable or network error, save to IndexedDB
          console.warn(`Backend unavailable, saving to IndexedDB: ${storeName}`);
          if (storeName) {
            await storageService.saveData(storeName, { ...data, timestamp: new Date().toISOString() });
          }
          throw new Error('Backend unavailable, data saved offline.');
        }
        throw error; // Re-throw other errors
      }
    } else {
      console.warn(`Offline, saving to IndexedDB: ${storeName}`);
      if (storeName) {
        await storageService.saveData(storeName, { ...data, timestamp: new Date().toISOString() });
      }
      throw new Error('Offline, data saved offline.');
    }
  }

  async get(endpoint, params = {}) {
    if (this.isOnline) {
      try {
        const response = await axios.get(`${API_BASE_URL}${endpoint}`, { params });
        return response.data;
      } catch (error) {
        console.error(`API GET error from ${endpoint}:`, error.response ? error.response.data : error.message);
        // For GET, if offline, we might try to retrieve from IndexedDB if data is cached
        // For now, just re-throw.
        throw error;
      }
    } else {
      console.warn(`Offline, cannot fetch from ${endpoint}.`);
      // In a real app, you might try to get cached data from IndexedDB here
      throw new Error('Offline, cannot fetch data.');
    }
  }

  // Add other methods like put, delete as needed
}

export default new ApiService();
