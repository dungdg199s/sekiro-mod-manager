/**
 * LocalStorage wrapper with validation and error handling
 * @module storageManager
 */

/**
 * Storage manager for localStorage operations
 */
export const storage = {
  /**
   * Get item from localStorage with optional default value
   * @param {string} key - Storage key
   * @param {*} [defaultValue=null] - Default value if key doesn't exist
   * @returns {*} Stored value or default
   */
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      if (value === null) return defaultValue;
      
      // Try to parse as JSON
      try {
        return JSON.parse(value);
      } catch {
        // Return as string if not valid JSON
        return value;
      }
    } catch (error) {
      console.error(`Error reading '${key}' from storage:`, error);
      return defaultValue;
    }
  },
  
  /**
   * Set item in localStorage
   * @param {string} key - Storage key
   * @param {*} value - Value to store (will be JSON stringified)
   */
  set(key, value) {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    } catch (error) {
      console.error(`Error writing '${key}' to storage:`, error);
      
      // Handle quota exceeded error
      if (error.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded. Consider clearing old data.');
      }
    }
  },
  
  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing '${key}' from storage:`, error);
    }
  },
  
  /**
   * Clear all items from localStorage
   */
  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
  
  /**
   * Check if key exists in localStorage
   * @param {string} key - Storage key
   * @returns {boolean}
   */
  has(key) {
    return localStorage.getItem(key) !== null;
  },
  
  /**
   * Get all keys from localStorage
   * @returns {string[]}
   */
  keys() {
    return Object.keys(localStorage);
  },
  
  /**
   * Get storage size estimate in bytes
   * @returns {number}
   */
  size() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }
};
