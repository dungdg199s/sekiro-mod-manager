/**
 * Simple event bus for decoupled communication between modules
 * @module eventBus
 */

/**
 * Event bus for pub/sub pattern
 * @class EventBus
 */
class EventBus {
  constructor() {
    this.events = new Map();
  }
  
  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(callback);
    
    return () => this.off(event, callback);
  }
  
  /**
   * Subscribe to an event (one-time only)
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  once(event, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }
  
  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function to remove
   */
  off(event, callback) {
    if (this.events.has(event)) {
      this.events.get(event).delete(callback);
      
      // Clean up empty event sets
      if (this.events.get(event).size === 0) {
        this.events.delete(event);
      }
    }
  }
  
  /**
   * Emit an event with data
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event handler for '${event}':`, error);
        }
      });
    }
  }
  
  /**
   * Clear all event listeners
   * @param {string} [event] - Specific event to clear, or all if not provided
   */
  clear(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }
  
  /**
   * Get list of all event names
   * @returns {string[]}
   */
  eventNames() {
    return Array.from(this.events.keys());
  }
  
  /**
   * Get listener count for an event
   * @param {string} event - Event name
   * @returns {number}
   */
  listenerCount(event) {
    return this.events.has(event) ? this.events.get(event).size : 0;
  }
}

// Export singleton instance
export const eventBus = new EventBus();

/**
 * Application event names
 * @constant {Object}
 */
export const APP_EVENTS = {
  // Mod events
  MODS_LOADED: 'mods:loaded',
  MOD_CREATED: 'mod:created',
  MOD_UPDATED: 'mod:updated',
  MOD_DELETED: 'mod:deleted',
  MOD_TOGGLED: 'mod:toggled',
  MOD_REORDERED: 'mod:reordered',
  
  // UI events
  MODAL_OPENED: 'modal:opened',
  MODAL_CLOSED: 'modal:closed',
  FILTER_CHANGED: 'filter:changed',
  LANGUAGE_CHANGED: 'language:changed',
  
  // Status events
  STATUS_SHOW: 'status:show',
  STATUS_HIDE: 'status:hide',
  
  // Error events
  ERROR: 'error',
  WARNING: 'warning'
};
