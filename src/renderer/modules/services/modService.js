/**
 * Mod service for all mod-related operations
 * @module modService
 */

import { appState } from '../state/appState.js';
import { eventBus, APP_EVENTS } from '../utils/eventBus.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('ModService');

/**
 * Load all mods from electron API
 * @returns {Promise<Array>} Array of mods
 */
export async function loadMods() {
  return await logger.timeAsync('loadMods', async () => {
    try {
      const mods = await window.electronAPI.getMods();
      appState.state.mods = mods;
      logger.success(`Loaded ${mods.length} mods`);
      eventBus.emit(APP_EVENTS.MODS_LOADED, mods);
      return mods;
    } catch (error) {
      logger.error('Error loading mods:', error);
      eventBus.emit(APP_EVENTS.ERROR, { message: 'Failed to load mods', error });
      return [];
    }
  });
}

/**
 * Get filtered mods based on current category filter
 * @returns {Array} Filtered mods
 */
export function getFilteredMods() {
  const { mods, currentCategoryFilter } = appState.state;
  logger.debug(`Filtering mods by category: ${currentCategoryFilter}`);
  
  if (currentCategoryFilter === 'all') {
    logger.debug(`Returning all ${mods.length} mods`);
    return mods;
  }
  
  const filtered = mods.filter(mod => 
    mod.categories && mod.categories.includes(currentCategoryFilter)
  );
  logger.debug(`Filtered to ${filtered.length} mods`);
  return filtered;
}

/**
 * Create a new mod
 * @param {Object} modData - Mod data { filePath, name, description, categories }
 * @returns {Promise<Object>} Result object { success, mod?, error? }
 */
export async function createMod(modData) {
  return await logger.timeAsync('createMod', async () => {
    try {
      logger.info('Creating new mod', modData);
      const result = await window.electronAPI.saveMod(modData);
      
      if (result.success) {
        logger.success('Mod created successfully', result.mod);
        await loadMods();
        eventBus.emit(APP_EVENTS.MOD_CREATED, result.mod);
      } else {
        logger.warn('Failed to create mod', result.error);
      }
      
      return result;
    } catch (error) {
      logger.error('Error creating mod:', error);
      return { success: false, error: error.message };
    }
  });
}

/**
 * Update an existing mod
 * @param {string} modId - Mod ID
 * @param {Object} modData - Mod data { name, description, categories }
 * @returns {Promise<Object>} Result object { success, mod?, error? }
 */
export async function updateMod(modId, modData) {
  return await logger.timeAsync('updateMod', async () => {
    try {
      logger.info(`Updating mod ${modId}`, modData);
      const result = await window.electronAPI.updateMod(modId, modData);
      
      if (result.success) {
        logger.success(`Mod ${modId} updated successfully`);
        await loadMods();
        eventBus.emit(APP_EVENTS.MOD_UPDATED, result.mod);
      } else {
        logger.warn(`Failed to update mod ${modId}`, result.error);
      }
      
      return result;
    } catch (error) {
      logger.error('Error updating mod:', error);
      return { success: false, error: error.message };
    }
  });
}

/**
 * Delete a mod
 * @param {string} modId - Mod ID
 * @returns {Promise<Object>} Result object { success, error? }
 */
export async function deleteMod(modId) {
  return await logger.timeAsync('deleteMod', async () => {
    try {
      logger.info(`Deleting mod ${modId}`);
      const result = await window.electronAPI.deleteMod(modId);
      
      if (result.success) {
        logger.success(`Mod ${modId} deleted successfully`);
        await loadMods();
        eventBus.emit(APP_EVENTS.MOD_DELETED, { modId });
      } else {
        logger.warn(`Failed to delete mod ${modId}`, result.error);
      }
      
      return result;
    } catch (error) {
      logger.error('Error deleting mod:', error);
      return { success: false, error: error.message };
    }
  });
}

/**
 * Toggle mod active state
 * @param {string} modId - Mod ID
 * @param {boolean} active - New active state
 * @param {Object} [options={}] - Additional options { continueOnConflict }
 * @returns {Promise<Object>} Result object { success, needConfirm?, conflicts?, error? }
 */
export async function toggleMod(modId, active, options = {}) {
  return await logger.timeAsync('toggleMod', async () => {
    try {
      logger.info(`Toggling mod ${modId} to ${active ? 'active' : 'inactive'}`, options);
      const { gameDir } = appState.state;
      
      if (!gameDir && !options.continueOnConflict) {
        logger.warn('Game directory not set');
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
        logger.success(`Mod ${modId} toggled successfully`);
        await loadMods();
        eventBus.emit(APP_EVENTS.MOD_TOGGLED, { modId, active, result });
      } else if (result.needConfirm) {
        logger.warn(`Mod ${modId} has conflicts`, result.conflicts);
      } else {
        logger.warn(`Failed to toggle mod ${modId}`, result.error);
      }
      
      return result;
    } catch (error) {
      logger.error('Error toggling mod:', error);
      return { success: false, error: error.message };
    }
  });
}

/**
 * Reorder mods (drag and drop)
 * @param {string} draggedId - ID of dragged mod
 * @param {string} targetId - ID of target mod
 * @returns {Promise<Object>} Result object { success, error? }
 */
export async function reorderMods(draggedId, targetId) {
  return await logger.timeAsync('reorderMods', async () => {
    try {
      logger.info(`Reordering: moving ${draggedId} to ${targetId}`);
      const result = await window.electronAPI.reorderMods(draggedId, targetId);
      
      if (result.success) {
        logger.success('Mods reordered successfully');
        await loadMods();
        eventBus.emit(APP_EVENTS.MOD_REORDERED, { draggedId, targetId });
      } else {
        logger.warn('Failed to reorder mods', result.error);
      }
      
      return result;
    } catch (error) {
      logger.error('Error reordering mods:', error);
      return { success: false, error: error.message };
    }
  });
}

/**
 * Get mod by ID
 * @param {string} modId - Mod ID
 * @returns {Object|null} Mod object or null
 */
export function getModById(modId) {
  logger.debug(`Getting mod by ID: ${modId}`);
  const { mods } = appState.state;
  const mod = mods.find(m => m.id === modId) || null;
  if (mod) {
    logger.debug('Mod found', mod);
  } else {
    logger.warn(`Mod ${modId} not found`);
  }
  return mod;
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
