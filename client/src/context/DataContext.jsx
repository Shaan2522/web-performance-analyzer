import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService, STORE_NAMES } from '../services/StorageService';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const allData = {};
      for (const storeName of Object.values(STORE_NAMES)) {
        allData[storeName] = await storageService.getAllData(storeName);
      }
      setData(allData);
      setError(null);
    } catch (err) {
      console.error('Error fetching data from IndexedDB:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const saveData = async (storeName, record) => {
    try {
      const id = await storageService.saveData(storeName, record);
      const newData = { ...record, id };
      setData(prevData => ({
        ...prevData,
        [storeName]: [...prevData[storeName], newData]
      }));
      return newData;
    } catch (err) {
      console.error(`Error saving data to ${storeName}:`, err);
      // Optionally re-throw or handle error state
    }
  };

  const updateData = async (storeName, record) => {
    try {
      await storageService.updateData(storeName, record);
      setData(prevData => ({
        ...prevData,
        [storeName]: prevData[storeName].map(item => item.id === record.id ? record : item)
      }));
    } catch (err) {
      console.error(`Error updating data in ${storeName}:`, err);
    }
  };

  const deleteData = async (storeName, id) => {
    try {
      await storageService.deleteData(storeName, id);
      setData(prevData => ({
        ...prevData,
        [storeName]: prevData[storeName].filter(item => item.id !== id)
      }));
    } catch (err) {
      console.error(`Error deleting data from ${storeName}:`, err);
    }
  };

  const value = {
    data,
    loading,
    error,
    saveData,
    updateData,
    deleteData,
    fetchAllData, // Expose fetchAllData to allow manual refresh
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};