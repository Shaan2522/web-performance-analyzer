import { openDB } from 'idb';

const DB_NAME = 'webperf-analyzer-db';
const DB_VERSION = 2; // Incremented version to trigger upgrade

export const STORE_NAMES = {
  PERFORMANCE: 'performance-data',
  MEMORY: 'memory-snapshots',
  NETWORK: 'network-logs',
  REPORTS: 'reports',
  BUDGETS: 'budgets',
  SETTINGS: 'user-settings',
};

class StorageService {
  constructor() {
    this.dbPromise = this.initDb();
  }

  async initDb() {
    return openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log(`Upgrading DB from version ${oldVersion} to ${newVersion}`);
        // Create stores if they don't exist
        Object.values(STORE_NAMES).forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
          }
        });

        // Example of a more complex schema for settings (using a fixed key)
        if (db.objectStoreNames.contains(STORE_NAMES.SETTINGS)) {
            // Settings might not use auto-incrementing keys
            // Re-creating or modifying is complex, usually handled by version checks
        }
      },
    });
  }

  async saveData(storeName, data) {
    const db = await this.dbPromise;
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    // Add a timestamp if one doesn't exist
    const dataToSave = { ...data, timestamp: data.timestamp || new Date().toISOString() };
    const id = await store.add(dataToSave);
    await tx.done;
    console.log(`Data saved to ${storeName} with id ${id}:`, dataToSave);
    return id;
  }

  async getAllData(storeName) {
    const db = await this.dbPromise;
    return db.getAll(storeName);
  }

  async getDataById(storeName, id) {
    const db = await this.dbPromise;
    return db.get(storeName, id);
  }

  async updateData(storeName, data) {
    const db = await this.dbPromise;
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    // Ensure the object has an id to update
    if (!data.id) {
      throw new Error('An `id` property is required to update an item.');
    }
    const id = await store.put(data);
    await tx.done;
    console.log(`Data in ${storeName} with id ${id} updated.`);
    return id;
  }

  async deleteData(storeName, id) {
    const db = await this.dbPromise;
    const tx = db.transaction(storeName, 'readwrite');
    await tx.objectStore(storeName).delete(id);
    await tx.done;
    console.log(`Data with id ${id} deleted from ${storeName}.`);
  }

  async clearData(storeName) {
    const db = await this.dbPromise;
    const tx = db.transaction(storeName, 'readwrite');
    await tx.objectStore(storeName).clear();
    await tx.done;
    console.log(`All data cleared from ${storeName}.`);
  }

  async deleteOldData(storeName, retentionDays) {
    const db = await this.dbPromise;
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;

    let cursor = await store.openCursor();
    while (cursor) {
      if (cursor.value.timestamp && new Date(cursor.value.timestamp).getTime() < cutoff) {
        await cursor.delete();
      }
      cursor = await cursor.continue();
    }
    await tx.done;
    console.log(`Old data (older than ${retentionDays} days) cleared from ${storeName}.`);
  }
}

export const storageService = new StorageService();
