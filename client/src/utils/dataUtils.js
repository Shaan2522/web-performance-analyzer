/**
 * Validates if a given value is a non-empty string.
 * @param {string} value - The value to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
export const isValidString = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Validates if a given value is a non-negative number.
 * @param {number} value - The value to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
export const isValidNumber = (value) => {
  return typeof value === 'number' && value >= 0;
};

/**
 * Formats a date object into a readable string.
 * @param {Date} date - The date object to format.
 * @returns {string} Formatted date string.
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString();
};

/**
 * Transforms raw API data into a more consumable format for UI components.
 * @param {Array<object>} rawData - The raw data from API.
 * @returns {Array<object>} Transformed data.
 */
export const transformPerformanceData = (rawData) => {
  return rawData.map(item => ({
    ...item,
    lcp: item.lcp !== undefined && item.lcp !== null ? parseFloat(item.lcp.toFixed(2)) : null,
    inp: item.inp !== undefined && item.inp !== null ? parseFloat(item.inp.toFixed(2)) : null,
    cls: item.cls !== undefined && item.cls !== null ? parseFloat(item.cls.toFixed(4)) : null,
    timestamp: new Date(item.timestamp),
  }));
};

/**
 * Transforms raw API memory data into a more consumable format for UI components.
 * @param {Array<object>} rawData - The raw data from API.
 * @returns {Array<object>} Transformed data.
 */
export const transformMemoryData = (rawData) => {
  return rawData.map(item => ({
    ...item,
    heapUsed: item.heapUsed !== undefined && item.heapUsed !== null ? parseInt(item.heapUsed) : null,
    heapTotal: item.heapTotal !== undefined && item.heapTotal !== null ? parseInt(item.heapTotal) : null,
    timestamp: new Date(item.timestamp),
  }));
};

/**
 * Cleans up an object by removing properties with undefined or null values.
 * @param {object} obj - The object to clean.
 * @returns {object} The cleaned object.
 */
export const cleanObject = (obj) => {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined && value !== null));
};
