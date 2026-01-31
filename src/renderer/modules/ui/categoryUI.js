/**
 * Category UI components
 * @module categoryUI
 */

import { escapeHtml } from '../utils/sanitize.js';
import { PREDEFINED_CATEGORIES } from '../constants.js';
import { t } from '../services/i18nService.js';
import { appState } from '../state/appState.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('CategoryUI');

/**
 * Render categories grid with checkboxes
 * @param {HTMLElement} container - Container element
 * @param {Array} selectedCategories - Currently selected categories
 */
export function renderCategoriesGrid(container, selectedCategories = []) {
  logger.fnStart('renderCategoriesGrid', { selectedCategories });
  
  if (!container) {
    logger.warn('Container not found');
    return;
  }
  
  logger.info(`Rendering ${PREDEFINED_CATEGORIES.length} category checkboxes`);
  
  container.innerHTML = PREDEFINED_CATEGORIES.map(category => `
    <label class="category-checkbox">
      <input 
        type="checkbox" 
        value="${escapeHtml(category)}" 
        ${selectedCategories.includes(category) ? 'checked' : ''}
        data-category="${escapeHtml(category)}"
      />
      <span>${escapeHtml(category)}</span>
    </label>
  `).join('');
  
  logger.fnEnd('renderCategoriesGrid');
}

/**
 * Get selected categories from grid
 * @param {HTMLElement} container - Container element
 * @returns {Array} Array of selected category names
 */
export function getSelectedCategories(container) {
  if (!container) return [];
  
  const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}

/**
 * Render category filter bar
 * @param {HTMLElement} container - Container element
 */
export function renderCategoryFilters(container) {
  if (!container) return;
  
  const { currentCategoryFilter } = appState.state;
  
  const allButton = `
    <button 
      class="category-filter ${currentCategoryFilter === 'all' ? 'active' : ''}" 
      data-category="all"
    >
      <span data-i18n="filterAll">${t('filterAll')}</span>
    </button>
  `;
  
  const categoryButtons = PREDEFINED_CATEGORIES.map(category => `
    <button 
      class="category-filter ${currentCategoryFilter === category ? 'active' : ''}" 
      data-category="${escapeHtml(category)}"
    >
      ${escapeHtml(category)}
    </button>
  `).join('');
  
  container.innerHTML = allButton + categoryButtons;
}

/**
 * Setup category filter click handlers
 * @param {HTMLElement} container - Container element
 * @param {Function} onFilterChange - Callback when filter changes (category) => void
 */
export function setupCategoryFilterEvents(container, onFilterChange) {
  if (!container) return;
  
  container.addEventListener('click', (e) => {
    const button = e.target.closest('.category-filter');
    if (!button) return;
    
    const category = button.dataset.category;
    if (category && onFilterChange) {
      onFilterChange(category);
    }
  });
}

/**
 * Setup category checkbox change handlers
 * @param {HTMLElement} container - Container element
 * @param {Function} onChange - Callback when checkbox changes (categories) => void
 */
export function setupCategoryCheckboxEvents(container, onChange) {
  if (!container) return;
  
  container.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      const categories = getSelectedCategories(container);
      if (onChange) {
        onChange(categories);
      }
    }
  });
}
