/**
 * Modal management
 * @module modal
 */

import { $, show, hide } from '../utils/domHelpers.js';

/**
 * Show modal
 * @param {string|HTMLElement} modal - Modal selector or element
 */
export function showModal(modal) {
  const element = typeof modal === 'string' ? $(modal) : modal;
  if (element) {
    show(element, 'flex');
  }
}

/**
 * Hide modal
 * @param {string|HTMLElement} modal - Modal selector or element
 */
export function hideModal(modal) {
  const element = typeof modal === 'string' ? $(modal) : modal;
  if (element) {
    hide(element);
  }
}

/**
 * Setup modal close handlers
 * @param {string|HTMLElement} modal - Modal selector or element
 * @param {string|HTMLElement} closeBtn - Close button selector or element
 */
export function setupModalClose(modal, closeBtn) {
  const modalEl = typeof modal === 'string' ? $(modal) : modal;
  const closeBtnEl = typeof closeBtn === 'string' ? $(closeBtn) : closeBtn;
  
  if (closeBtnEl) {
    closeBtnEl.addEventListener('click', () => hideModal(modalEl));
  }
  
  // Close on background click
  if (modalEl) {
    modalEl.addEventListener('click', (e) => {
      if (e.target === modalEl) {
        hideModal(modalEl);
      }
    });
  }
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalEl && modalEl.style.display === 'flex') {
      hideModal(modalEl);
    }
  });
}
