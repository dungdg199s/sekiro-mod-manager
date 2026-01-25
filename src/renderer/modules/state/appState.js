/**
 * Application state management with reactive updates
 * @module appState
 */

import { storage } from './storageManager.js';
import { STORAGE_KEYS, DEFAULTS } from '../constants.js';

/**
 * Application state with reactive proxy
 * @class AppState
 */
class AppState {
  constructor() {
    // Initialize state from localStorage and defaults
    this._state = {
      gameDir: storage.get(STORAGE_KEYS.GAME_DIR, ''),
      currentLang: storage.get(STORAGE_KEYS.LANGUAGE, DEFAULTS.LANGUAGE),
      selectedModFile: null,
      editingModId: null,
      currentCategories: [],
      currentCategoryFilter: DEFAULTS.CATEGORY_FILTER,
      mods: [],
      allCategories: []
    };
    
    // Event listeners for state changes
    this._listeners = new Map();
    
    // Create reactive proxy
    this.state = new Proxy(this._state, {
      set: (target, property, value) => {
        const oldValue = target[property];
        
        // Only update if value actually changed
        if (oldValue === value) return true;
        
        target[property] = value;
        
        // Persist certain values to localStorage
        this._persistIfNeeded(property, value);
        
        // Notify listeners
        this._notify(property, value, oldValue);
        
        return true;
      }
    });
  }
  
  /**
   * Persist state property to localStorage if needed
   * @private
   * @param {string} property - Property name
   * @param {*} value - Property value
   */
  _persistIfNeeded(property, value) {
    const persistMap = {
      gameDir: STORAGE_KEYS.GAME_DIR,
      currentLang: STORAGE_KEYS.LANGUAGE
    };
    
    if (persistMap[property]) {
      storage.set(persistMap[property], value);
    }
  }
  
  /**
   * Notify listeners of state change
   * @private
   * @param {string} property - Property name
   * @param {*} value - New value
   * @param {*} oldValue - Previous value
   */
  _notify(property, value, oldValue) {
    if (this._listeners.has(property)) {
      this._listeners.get(property).forEach(callback => {
        try {
          callback(value, oldValue);
        } catch (error) {
          console.error(`Error in state listener for '${property}':`, error);
        }
      });
    }
    
    // Also notify wildcard listeners
    if (this._listeners.has('*')) {
      this._listeners.get('*').forEach(callback => {
        try {
          callback(property, value, oldValue);
        } catch (error) {
          console.error('Error in wildcard state listener:', error);
        }
      });
    }
  }
  
  /**
   * Subscribe to state changes
   * @param {string} property - Property name or '*' for all changes
   * @param {Function} callback - Callback function (value, oldValue) => void
   * @returns {Function} Unsubscribe function
   */
  subscribe(property, callback) {
    if (!this._listeners.has(property)) {
      this._listeners.set(property, new Set());
    }
    this._listeners.get(property).add(callback);
    
    // Return unsubscribe function
    return () => {
      const listeners = this._listeners.get(property);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this._listeners.delete(property);
        }
      }
    };
  }
  
  /**
   * Update multiple properties at once (batched)
   * @param {Object} updates - Object with properties to update
   */
  batch(updates) {
    Object.entries(updates).forEach(([key, value]) => {
      this.state[key] = value;
    });
  }
  
  /**
   * Reset state to defaults
   * @param {string[]} [properties] - Specific properties to reset, or all if not provided
   */
  reset(properties) {
    if (properties) {
      properties.forEach(prop => {
        if (prop in this._state) {
          this.state[prop] = this._getDefaultValue(prop);
        }
      });
    } else {
      // Reset all
      this.state.selectedModFile = null;
      this.state.editingModId = null;
      this.state.currentCategories = [];
      this.state.currentCategoryFilter = DEFAULTS.CATEGORY_FILTER;
    }
  }
  
  /**
   * Get default value for a property
   * @private
   * @param {string} property - Property name
   * @returns {*} Default value
   */
  _getDefaultValue(property) {
    const defaults = {
      gameDir: '',
      currentLang: DEFAULTS.LANGUAGE,
      selectedModFile: null,
      editingModId: null,
      currentCategories: [],
      currentCategoryFilter: DEFAULTS.CATEGORY_FILTER,
      mods: [],
      allCategories: []
    };
    return defaults[property];
  }
  
  /**
   * Get snapshot of current state
   * @returns {Object} State snapshot
   */
  snapshot() {
    return { ...this._state };
  }
  
  /**
   * Debug: log current state
   */
  debug() {
    console.log('Current App State:', this.snapshot());
  }
}

// Export singleton instance
export const appState = new AppState();
