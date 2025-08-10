import { useData } from '../context/DataContext';
import { STORE_NAMES } from '../services/StorageService'; // Keep STORE_NAMES for filtering

const usePerformanceData = () => {
  const { data, loading, error, fetchAllData } = useData();

  const performanceData = data[STORE_NAMES.PERFORMANCE] || [];

  return { performanceData, loading, error, refetch: fetchAllData };
};

export default usePerformanceData;