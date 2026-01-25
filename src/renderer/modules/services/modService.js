/**
 * Mod service for all mod-related operations
 * @module modService
 */

import { appState } from '../state/appState.js';
import { eventBus, APP_EVENTS } from '../utils/eventBus.js';

/**
 * Load all mods from electron API
 * @returns {Promise<Array>} Array of mods
 */
export async function loadMods() {
  try {
    const mods = await window.electronAPI.getMods();
    appState.state.mods = mods;
    eventBus.emit(APP_EVENTS.MODS_LOADED, mods);
    return mods;
  } catch (error) {
    console.error('Error loading mods:', error);
    eventBus.emit(APP_EVENTS.ERROR, { message: 'Failed to load mods', error });
    return [];
  }
}

/**
 * Get filtered mods based on current category filter
 * @returns {Array} Filtered mods
 */
export function getFilteredMods() {
  const { mods, currentCategoryFilter } = appState.state;
  
  if (currentCategoryFilter === 'all') {
    return mods;
  }
  
  return mods.filter(mod => 
    mod.categories && mod.categories.includes(currentCategoryFilter)
  );
}

/**
 * Create a new mod
 * @param {Object} modData - Mod data { filePath, name, description, categories }
 * @returns {Promise<Object>} Result object { success, mod?, error? }
 */
export async function createMod(modData) {
  try {
    const result = await window.electronAPI.saveMod(modData);
    
    if (result.success) {
      await loadMods();
      eventBus.emit(APP_EVENTS.MOD_CREATED, result.mod);
    }
    
    return result;
  } catch (error) {
    console.error('Error creating mod:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update an existing mod
 * @param {string} modId - Mod ID
 * @param {Object} modData - Mod data { name, description, categories }
 * @returns {Promise<Object>} Result object { success, mod?, error? }
 */
export async function updateMod(modId, modData) {
  try {
    const result = await window.electronAPI.updateMod(modId, modData);
    
    if (result.success) {
      await loadMods();
      eventBus.emit(APP_EVENTS.MOD_UPDATED, result.mod);
    }
    
    return result;
  } catch (error) {
    console.error('Error updating mod:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a mod
 * @param {string} modId - Mod ID
 * @returns {Promise<Object>} Result object { success, error? }
 */
export async function deleteMod(modId) {
  try {
    const result = await window.electronAPI.deleteMod(modId);
    
    if (result.success) {
      await loadMods();
      eventBus.emit(APP_EVENTS.MOD_DELETED, { modId });
    }
    
    return result;
  } catch (error) {
    console.error('Error deleting mod:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Toggle mod active state
 * @param {string} modId - Mod ID
 * @param {boolean} active - New active state
 * @param {Object} [options={}] - Additional options { continueOnConflict }
 * @returns {Promise<Object>} Result object { success, needConfirm?, conflicts?, error? }
 */
export async function toggleMod(modId, active, options = {}) {
  try {
    const { gameDir } = appState.state;
    
    if (!gameDir && !options.continueOnConflict) {
      return { 
        success: false, 
        error: 'Game directory not set',
        errorCode: 'NO_GAME_DIR'
      };
    }
    
    const result = await window.electronAPI.toggleMod({
      modId,
      active,
      gameDir,
      ...options
    });
    
    if (result.success) {
      await loadMods();
      eventBus.emit(APP_EVENTS.MOD_TOGGLED, { modId, active, result });
    }
    
    return result;
  } catch (error) {
    console.error('Error toggling mod:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Reorder mods (drag and drop)
 * @param {string} draggedId - ID of dragged mod
 * @param {string} targetId - ID of target mod
 * @returns {Promise<Object>} Result object { success, error? }
 */
export async function reorderMods(draggedId, targetId) {
  try {
    const result = await window.electronAPI.reorderMods(draggedId, targetId);
    
    if (result.success) {
      await loadMods();
      eventBus.emit(APP_EVENTS.MOD_REORDERED, { draggedId, targetId });
    }
    
    return result;
  } catch (error) {
    console.error('Error reordering mods:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get mod by ID
 * @param {string} modId - Mod ID
 * @returns {Object|null} Mod object or null
 */
export function getModById(modId) {
  const { mods } = appState.state;
  return mods.find(m => m.id === modId) || null;
}

/**
 * Get all unique categories from all mods
 * @returns {Promise<string[]>} Array of category names
 */
export async function getAllCategories() {
  try {
    const categories = await window.electronAPI.getAllCategories();
    appState.state.allCategories = categories;
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
}

/**
 * Get mods by category
 * @param {string} category - Category name
 * @returns {Array} Array of mods
 */
export function getModsByCategory(category) {
  const { mods } = appState.state;
  return mods.filter(mod => 
    mod.categories && mod.categories.includes(category)
  );
}

/**
 * Get mod count by category
 * @returns {Object} Object with category counts
 */
export function getCategoryCounts() {
  const { mods } = appState.state;
  const counts = {};
  
  mods.forEach(mod => {
    if (mod.categories) {
      mod.categories.forEach(cat => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    }
  });
  
  return counts;
}
