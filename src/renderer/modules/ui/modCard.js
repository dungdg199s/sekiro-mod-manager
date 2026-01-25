/**
 * Mod card rendering
 * @module modCard
 */

import { escapeHtml } from '../utils/sanitize.js';
import { t } from '../services/i18nService.js';
import { appState } from '../state/appState.js';

/**
 * Create mod card HTML
 * @param {Object} mod - Mod object
 * @param {number} index - Mod index for ordering
 * @returns {string} HTML string
 */
export function createModCard(mod, index) {
  const { currentLang } = appState.state;
  
  const categoriesHtml = mod.categories && mod.categories.length > 0
    ? `<div class="mod-categories">
        ${mod.categories.map(cat => 
          `<span class="mod-category">${escapeHtml(cat)}</span>`
        ).join('')}
       </div>`
    : '';
  
  const dateStr = new Date(mod.createdAt).toLocaleDateString(
    currentLang === 'vi' ? 'vi-VN' : 'en-US'
  );
  
  return `
    <div class="mod-card" draggable="true" data-mod-id="${escapeHtml(mod.id)}" data-order="${index}">
      <div class="mod-header">
        <div class="drag-handle">☰</div>
        <h3>${escapeHtml(mod.name)}</h3>
        <label class="switch">
          <input 
            type="checkbox" 
            ${mod.active ? 'checked' : ''} 
            data-action="toggle-mod"
            data-mod-id="${escapeHtml(mod.id)}"
          >
          <span class="slider"></span>
        </label>
      </div>
      ${categoriesHtml}
      <p class="mod-description">${escapeHtml(mod.description || t('noDescription'))}</p>
      <div class="mod-footer">
        <span class="mod-date">📅 ${dateStr}</span>
        <div class="mod-actions">
          <button 
            class="btn btn-secondary btn-small" 
            data-action="edit-mod"
            data-mod-id="${escapeHtml(mod.id)}"
          >
            ${t('editBtn')}
          </button>
          <button 
            class="btn btn-danger btn-small" 
            data-action="delete-mod"
            data-mod-id="${escapeHtml(mod.id)}"
          >
            ${t('deleteBtn')}
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render mod list in container
 * @param {HTMLElement} container - Container element
 * @param {Array} mods - Array of mods
 */
export function renderModList(container, mods) {
  if (!container) return;
  
  if (mods.length === 0) {
    const msg = appState.state.currentCategoryFilter === 'all' 
      ? t('emptyState')
      : t('noModsWithCategory');
    container.innerHTML = `<div class="empty-state">${msg}</div>`;
    return;
  }
  
  const modsHtml = mods.map((mod, index) => createModCard(mod, index)).join('');
  container.innerHTML = modsHtml;
}

/**
 * Setup event delegation for mod cards
 * @param {HTMLElement} container - Container element
 * @param {Object} handlers - Event handlers object
 */
export function setupModCardEvents(container, handlers) {
  if (!container) return;
  
  // Handle button clicks
  container.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    
    const action = target.dataset.action;
    const handler = handlers[action];
    
    if (handler) {
      e.preventDefault();
      handler(target.dataset);
    }
  });
  
  // Handle checkbox changes
  container.addEventListener('change', (e) => {
    if (e.target.dataset.action === 'toggle-mod') {
      const handler = handlers['toggle-mod'];
      if (handler) {
        handler({
          modId: e.target.dataset.modId,
          checked: e.target.checked
        });
      }
    }
  });
}
