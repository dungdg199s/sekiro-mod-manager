/**
 * Debounce utility
 * @module debounce
 */

const timers = new Map();

/**
 * Debounce function calls
 * @param {string} key - Unique key for this debounce
 * @param {Function} fn - Function to debounce
 * @param {number} [delay=300] - Delay in milliseconds
 * @returns {void}
 * @example
 * debounce('search', () => performSearch(), 500)
 */
export function debounce(key, fn, delay = 300) {
  if (timers.has(key)) {
    clearTimeout(timers.get(key));
  }
  
  const timer = setTimeout(() => {
    timers.delete(key);
    fn();
  }, delay);
  
  timers.set(key, timer);
}

/**
 * Cancel a debounced function
 * @param {string} key - Debounce key
 */
export function cancelDebounce(key) {
  if (timers.has(key)) {
    clearTimeout(timers.get(key));
    timers.delete(key);
  }
}

/**
 * Clear all debounces
 */
export function clearAllDebounces() {
  timers.forEach(timer => clearTimeout(timer));
  timers.clear();
}

/**
 * Create a debounced version of a function
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function createDebounced(fn, delay = 300) {
  let timer = null;
  
  const debounced = function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
  
  debounced.cancel = function() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
  
  return debounced;
}
