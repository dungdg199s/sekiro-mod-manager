/**
 * Status notification system
 * @module statusBar
 */

import { $, addClass, removeClass } from '../utils/domHelpers.js';
import { DEBOUNCE_DELAYS } from '../constants.js';

let statusTimeout = null;

/**
 * Show status message
 * @param {string} message - Status message
 * @param {string} [type='info'] - Status type: 'info', 'success', 'warning', 'error'
 * @param {number} [duration=3000] - Display duration in ms
 */
export function showStatus(message, type = 'info', duration = DEBOUNCE_DELAYS.STATUS_DISPLAY) {
  const statusBar = $('#statusBar');
  const statusText = $('#statusText');
  
  if (!statusBar || !statusText) return;
  
  statusText.textContent = message;
  
  // Remove all type classes
  removeClass(statusBar, 'success', 'error', 'warning', 'info');
  
  // Add new type class
  addClass(statusBar, 'visible', type);
  
  // Clear existing timeout
  if (statusTimeout) {
    clearTimeout(statusTimeout);
  }
  
  // Auto hide after duration
  statusTimeout = setTimeout(() => {
    hideStatus();
  }, duration);
}

/**
 * Hide status bar
 */
export function hideStatus() {
  const statusBar = $('#statusBar');
  if (statusBar) {
    removeClass(statusBar, 'visible');
  }
  
  if (statusTimeout) {
    clearTimeout(statusTimeout);
    statusTimeout = null;
  }
}

/**
 * Show success status
 * @param {string} message - Success message
 */
export function showSuccess(message) {
  showStatus(message, 'success');
}

/**
 * Show error status
 * @param {string} message - Error message
 */
export function showError(message) {
  showStatus(message, 'error', 5000); // Longer duration for errors
}

/**
 * Show warning status
 * @param {string} message - Warning message
 */
export function showWarning(message) {
  showStatus(message, 'warning', 4000);
}

/**
 * Show info status
 * @param {string} message - Info message
 */
export function showInfo(message) {
  showStatus(message, 'info');
}
