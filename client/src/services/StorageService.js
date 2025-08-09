import { openDB } from 'idb';

const DB_NAME = 'webperf-analyzer-db';
const DB_VERSION = 1;
const STORE_NAMES = {
  PERFORMANCE: 'performance-data',
  MEMORY: 'memory-snapshots',
  NETWORK: 'network-requests',
};

class StorageService {
  constructor() {
    this.dbPromise = null;
  }

  async initDb() {
    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAMES.PERFORMANCE)) {
          db.createObjectStore(STORE_NAMES.PERFORMANCE, { keyPath: '_id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains(STORE_NAMES.MEMORY)) {
          db.createObjectStore(STORE_NAMES.MEMORY, { keyPath: '_id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains(STORE_NAMES.NETWORK)) {
          db.createObjectStore(STORE_NAMES.NETWORK, { keyPath: '_id', autoIncrement: true });
        }
      },
    });
    return this.dbPromise;
  }

  async saveData(storeName, data) {
    const db = await this.initDb();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.add(data);
    await tx.done;
    console.log(`Data saved to ${storeName}:`, data);
  }

  async getAllData(storeName) {
    const db = await this.initDb();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const allData = await store.getAll();
    await tx.done;
    return allData;
  }

  async clearData(storeName) {
    const db = await this.initDb();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.clear();
    await tx.done;
    console.log(`All data cleared from ${storeName}.`);
  }

  async deleteOldData(storeName, retentionDays) {
    const db = await this.initDb();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;

    let cursor = await store.openCursor();
    while (cursor) {
      // Assuming data has a timestamp property
      if (cursor.value.timestamp && new Date(cursor.value.timestamp).getTime() < cutoff) {
        cursor.delete();
      }
      cursor = await cursor.continue();
    }
    await tx.done;
    console.log(`Old data (older than ${retentionDays} days) cleared from ${storeName}.`);
  }
}

export const storageService = new StorageService();
export { STORE_NAMES }; // Corrected: Export the existing constant