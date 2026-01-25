/**
 * Application constants
 * @module constants
 */

/**
 * Predefined mod categories based on Nexus Mods standard
 * @constant {string[]}
 */
export const PREDEFINED_CATEGORIES = [
  'Audio',
  'Skins',
  'Items',
  'Weapons',
  'Gameplay',
  'UI',
  'Utilities',
  'Visuals & Graphics'
];

/**
 * Debounce delays in milliseconds
 * @constant {Object}
 */
export const DEBOUNCE_DELAYS = {
  TOGGLE_MOD: 300,
  STATUS_DISPLAY: 3000,
  SEARCH: 300
};

/**
 * LocalStorage keys
 * @constant {Object}
 */
export const STORAGE_KEYS = {
  GAME_DIR: 'gameDir',
  LANGUAGE: 'language'
};

/**
 * Default values
 * @constant {Object}
 */
export const DEFAULTS = {
  LANGUAGE: 'en',
  CATEGORY_FILTER: 'all'
};

/**
 * DOM element selectors
 * @constant {Object}
 */
export const SELECTORS = {
  UPLOAD_BTN: '#uploadBtn',
  UPLOAD_MODAL: '#uploadModal',
  SELECT_FILE_BTN: '#selectFileBtn',
  CANCEL_BTN: '#cancelBtn',
  UPLOAD_FORM: '#uploadForm',
  MODS_CONTAINER: '#modsContainer',
  SETTINGS_BTN: '#settingsBtn',
  SETTINGS_PANEL: '#settingsPanel',
  CLOSE_SETTINGS_BTN: '#closeSettingsBtn',
  SELECT_GAME_DIR_BTN: '#selectGameDirBtn',
  GAME_DIR_INPUT: '#gameDirInput',
  LANGUAGE_SELECT: '#languageSelect',
  CATEGORIES_GRID: '#categoriesGrid',
  FILTER_CATEGORIES: '#filterCategories',
  STATUS_BAR: '#statusBar',
  STATUS_TEXT: '#statusText'
};
