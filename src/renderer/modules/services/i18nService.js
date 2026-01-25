/**
 * Internationalization service
 * @module i18nService
 */

import { appState } from '../state/appState.js';
import { eventBus, APP_EVENTS } from '../utils/eventBus.js';
import { storage } from '../state/storageManager.js';
import { STORAGE_KEYS } from '../constants.js';

// Import translations (will use existing translations.js)
let translations = null;

/**
 * Initialize i18n service with translations
 * @param {Object} translationsData - Translations object
 */
export function initI18n(translationsData) {
  translations = translationsData;
}

/**
 * Get translation for key
 * @param {string} key - Translation key
 * @param {Object} [replacements] - Key-value pairs for replacements
 * @returns {string} Translated text
 * @example
 * t('errorMsg', { error: 'File not found' })
 */
export function t(key, replacements = {}) {
  const lang = appState.state.currentLang;
  let text = translations?.[lang]?.[key] || key;
  
  // Replace placeholders
  Object.entries(replacements).forEach(([placeholder, value]) => {
    text = text.replace(`{${placeholder}}`, value);
  });
  
  return text;
}

/**
 * Change language
 * @param {string} lang - Language code ('vi' or 'en')
 */
export function setLanguage(lang) {
  if (!translations || !translations[lang]) {
    console.warn(`Language '${lang}' not available`);
    return;
  }
  
  appState.state.currentLang = lang;
  storage.set(STORAGE_KEYS.LANGUAGE, lang);
  updateUI();
  eventBus.emit(APP_EVENTS.LANGUAGE_CHANGED, lang);
}

/**
 * Get current language
 * @returns {string} Current language code
 */
export function getCurrentLanguage() {
  return appState.state.currentLang;
}

/**
 * Update UI with current language
 */
export function updateUI() {
  // Update elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  
  // Update placeholders with data-i18n-placeholder attribute
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
  
  // Update titles with data-i18n-title attribute
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    el.title = t(key);
  });
}

/**
 * Get available languages
 * @returns {string[]} Array of language codes
 */
export function getAvailableLanguages() {
  return translations ? Object.keys(translations) : [];
}

/**
 * Check if language is available
 * @param {string} lang - Language code
 * @returns {boolean}
 */
export function isLanguageAvailable(lang) {
  return translations && lang in translations;
}
