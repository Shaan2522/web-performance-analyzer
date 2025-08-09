import { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';

const usePerformanceData = (interval = 5000) => {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const response = await ApiService.get('/performance');
      setPerformanceData(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching performance data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchPerformanceData(); // Fetch data every 'interval' milliseconds
    }, interval);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [interval]);

  return { performanceData, loading, error, refetch: fetchPerformanceData };
};

export default usePerformanceData;