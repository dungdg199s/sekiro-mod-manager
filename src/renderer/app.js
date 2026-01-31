/**
 * Main application module
 * @module app
 */

import { appState } from './modules/state/appState.js';
import { eventBus, APP_EVENTS } from './modules/utils/eventBus.js';
import { initI18n, t, setLanguage, updateUI } from './modules/services/i18nService.js';
import { 
  loadMods, 
  getFilteredMods, 
  createMod, 
  updateMod, 
  deleteMod, 
  toggleMod, 
  reorderMods,
  getModById
} from './modules/services/modService.js';
import { validateModData } from './modules/services/validationService.js';
import { renderModList, setupModCardEvents } from './modules/ui/modCard.js';
import {
  renderCategoriesGrid,
  getSelectedCategories,
  renderCategoryFilters,
  setupCategoryFilterEvents,
  setupCategoryCheckboxEvents
} from './modules/ui/categoryUI.js';
import { setupModReordering } from './modules/ui/dragAndDrop.js';
import { setupFileDropZone } from './modules/ui/dropZone.js';
import { showModal, hideModal, setupModalClose } from './modules/ui/modal.js';
import { showStatus, showSuccess, showError, showWarning } from './modules/ui/statusBar.js';
import { $, hide, show } from './modules/utils/domHelpers.js';
import { debounce } from './modules/utils/debounce.js';
import { SELECTORS, DEBOUNCE_DELAYS } from './modules/constants.js';
import { createLogger } from './modules/utils/logger.js';

const logger = createLogger('App');

/**
 * Main App class
 */
class App {
  constructor() {
    logger.info('App instance created');
    this.initialized = false;
  }
  
  /**
   * Initialize application
   */
  async init() {
    if (this.initialized) {
      logger.warn('App already initialized');
      return;
    }
    
    logger.fnStart('init');
    
    // Initialize i18n with global translations
    logger.info('Initializing i18n');
    
    if (!window.translations) {
      logger.error('window.translations not found! Make sure translations.js is loaded.');
      logger.warn('Using empty translations object');
    }
    
    initI18n(window.translations || {});
    
    // Setup all event listeners
    logger.info('Setting up UI');
    this.setupUI();
    this.setupStateSubscriptions();
    
    // Load initial data
    logger.info('Loading initial data');
    await this.loadInitialData();
    
    // Initial render
    logger.info('Rendering UI');
    this.render();
    
    this.initialized = true;
    logger.success('App initialized successfully');
    logger.fnEnd('init');
  }
  
  /**
   * Setup UI event listeners
   */
  setupUI() {
    // Upload button
    const uploadBtn = $(SELECTORS.UPLOAD_BTN);
    if (uploadBtn) {
      uploadBtn.addEventListener('click', () => this.handleUploadClick());
    }
    
    // Settings button
    const settingsBtn = $(SELECTORS.SETTINGS_BTN);
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => this.handleSettingsClick());
    }
    
    // Modals
    setupModalClose(SELECTORS.UPLOAD_MODAL, SELECTORS.CANCEL_BTN);
    setupModalClose(SELECTORS.SETTINGS_PANEL, SELECTORS.CLOSE_SETTINGS_BTN);
    
    // Upload form
    const uploadForm = $(SELECTORS.UPLOAD_FORM);
    if (uploadForm) {
      uploadForm.addEventListener('submit', (e) => this.handleUploadSubmit(e));
    }
    
    // Select file button
    const selectFileBtn = $(SELECTORS.SELECT_FILE_BTN);
    if (selectFileBtn) {
      selectFileBtn.addEventListener('click', () => this.handleSelectFile());
    }
    
    // Game directory
    const selectGameDirBtn = $(SELECTORS.SELECT_GAME_DIR_BTN);
    if (selectGameDirBtn) {
      selectGameDirBtn.addEventListener('click', () => this.handleSelectGameDir());
    }
    
    // Language select
    const languageSelect = $(SELECTORS.LANGUAGE_SELECT);
    if (languageSelect) {
      languageSelect.value = appState.state.currentLang;
      languageSelect.addEventListener('change', (e) => {
        setLanguage(e.target.value);
      });
    }
    
    // Mod cards event delegation
    const modsContainer = $(SELECTORS.MODS_CONTAINER);
    if (modsContainer) {
      setupModCardEvents(modsContainer, {
        'toggle-mod': (data) => this.handleToggleMod(data),
        'edit-mod': (data) => this.handleEditMod(data),
        'delete-mod': (data) => this.handleDeleteMod(data)
      });
      
      // Setup drag and drop for reordering
      setupModReordering(modsContainer, (draggedId, targetId) => {
        this.handleReorderMods(draggedId, targetId);
      });
    }
    
    // Category filters
    const filterCategories = $(SELECTORS.FILTER_CATEGORIES);
    if (filterCategories) {
      setupCategoryFilterEvents(filterCategories, (category) => {
        this.handleFilterChange(category);
      });
    }
    
    // Category checkboxes
    const categoriesGrid = $(SELECTORS.CATEGORIES_GRID);
    if (categoriesGrid) {
      setupCategoryCheckboxEvents(categoriesGrid, (categories) => {
        appState.state.currentCategories = categories;
      });
    }
    
    // File drop zone (will be rendered dynamically)
    this.setupFileDropZone();
  }
  
  /**
   * Setup state subscriptions
   */
  setupStateSubscriptions() {
    // Re-render when mods change
    appState.subscribe('mods', () => this.render());
    
    // Re-render when filter changes
    appState.subscribe('currentCategoryFilter', () => {
      this.render();
      renderCategoryFilters($(SELECTORS.FILTER_CATEGORIES));
    });
    
    // Update UI when language changes
    appState.subscribe('currentLang', () => {
      updateUI();
      this.render();
      renderCategoryFilters($(SELECTORS.FILTER_CATEGORIES));
    });
    
    // Update game dir input
    appState.subscribe('gameDir', (value) => {
      const input = $(SELECTORS.GAME_DIR_INPUT);
      if (input) input.value = value;
    });
  }
  
  /**
   * Load initial data
   */
  async loadInitialData() {
    // Load mods
    await loadMods();
    
    // Auto-detect game directory if not set
    if (!appState.state.gameDir) {
      try {
        const detectedDir = await window.electronAPI.detectGameDir();
        if (detectedDir) {
          appState.state.gameDir = detectedDir;
          console.log('Auto-detected game directory:', detectedDir);
        }
      } catch (error) {
        console.warn('Could not auto-detect game directory:', error);
      }
    }
    
    // Set game dir input
    const gameDirInput = $(SELECTORS.GAME_DIR_INPUT);
    if (gameDirInput) {
      gameDirInput.value = appState.state.gameDir;
    }
  }
  
  /**
   * Render main UI
   */
  render() {
    const modsContainer = $(SELECTORS.MODS_CONTAINER);
    if (!modsContainer) return;
    
    const mods = getFilteredMods();
    renderModList(modsContainer, mods);
    
    // Re-setup file drop zone after render
    this.setupFileDropZone();
  }
  
  /**
   * Setup file drop zone
   */
  setupFileDropZone() {
    const dropZone = $(SELECTORS.MODS_CONTAINER);
    if (dropZone) {
      setupFileDropZone(dropZone, (file) => {
        appState.state.selectedModFile = file.path;
        const filePathInput = $('#modFilePath');
        if (filePathInput) filePathInput.value = file.path;
        
        // Auto-fill mod name
        const modName = file.name.replace(/\.(zip|rar)$/i, '');
        const nameInput = $('#modName');
        if (nameInput) nameInput.value = modName;
        
        // Open upload modal
        showModal(SELECTORS.UPLOAD_MODAL);
      });
    }
  }
  
  /**
   * Handle upload button click
   */
  handleUploadClick() {
    appState.reset(['editingModId', 'selectedModFile', 'currentCategories']);
    
    const nameInput = $('#modName');
    const descInput = $('#modDescription');
    const filePathInput = $('#modFilePath');
    
    if (nameInput) nameInput.value = '';
    if (descInput) descInput.value = '';
    if (filePathInput) filePathInput.value = '';
    
    renderCategoriesGrid($(SELECTORS.CATEGORIES_GRID), []);
    
    const fileGroup = $('.file-select-group');
    if (fileGroup) show(fileGroup);
    
    const modalTitle = $('#uploadModal h2');
    const submitBtn = $(`#uploadForm button[type="submit"]`);
    if (modalTitle) modalTitle.textContent = t('uploadModalTitle');
    if (submitBtn) submitBtn.textContent = t('saveBtn');
    
    showModal(SELECTORS.UPLOAD_MODAL);
  }
  
  /**
   * Handle settings button click
   */
  handleSettingsClick() {
    showModal(SELECTORS.SETTINGS_PANEL);
  }
  
  /**
   * Handle upload form submit
   */
  async handleUploadSubmit(e) {
    e.preventDefault();
    
    const nameInput = $('#modName');
    const descInput = $('#modDescription');
    
    const modData = {
      name: nameInput ? nameInput.value : '',
      description: descInput ? descInput.value : '',
      categories: appState.state.currentCategories
    };
    
    if (appState.state.editingModId) {
      // Edit mode
      const result = await updateMod(appState.state.editingModId, modData);
      if (result.success) {
        showSuccess(t('modUpdatedMsg'));
        hideModal(SELECTORS.UPLOAD_MODAL);
        renderCategoryFilters($(SELECTORS.FILTER_CATEGORIES));
      } else {
        showError(t('errorMsg', { error: result.error }));
      }
    } else {
      // Create mode
      if (!appState.state.selectedModFile) {
        showWarning(t('selectModFileMsg'));
        return;
      }
      
      modData.filePath = appState.state.selectedModFile;
      
      const validation = validateModData(modData);
      if (!validation.valid) {
        showError(validation.errors.join(', '));
        return;
      }
      
      const result = await createMod(modData);
      if (result.success) {
        showSuccess(t('modSavedMsg'));
        hideModal(SELECTORS.UPLOAD_MODAL);
        renderCategoryFilters($(SELECTORS.FILTER_CATEGORIES));
      } else {
        showError(t('errorMsg', { error: result.error }));
      }
    }
  }
  
  /**
   * Handle select file button click
   */
  async handleSelectFile() {
    const filePath = await window.electronAPI.selectModFile();
    if (filePath) {
      appState.state.selectedModFile = filePath;
      $('#modFilePath').value = filePath;
      
      // Auto-fill mod name
      const fileName = filePath.split('\\').pop().split('/').pop();
      const modName = fileName.replace(/\.(zip|rar)$/i, '');
      $('#modName').value = modName;
    }
  }
  
  /**
   * Handle select game directory
   */
  async handleSelectGameDir() {
    const result = await window.electronAPI.selectGameDir();
    if (result) {
      if (result.error) {
        showError(t('invalidGameDirMsg'));
      } else if (result.path) {
        appState.state.gameDir = result.path;
        showSuccess('Game directory updated');
      }
    }
  }
  
  /**
   * Handle toggle mod
   */
  async handleToggleMod(data) {
    const { modId, checked } = data;
    
    if (!appState.state.gameDir) {
      showWarning(t('selectGameDirMsg'));
      setTimeout(() => this.render(), 100);
      return;
    }
    
    debounce('toggleMod', async () => {
      showStatus(checked ? t('activatingMod') : t('deactivatingMod'), 'info', 10000);
      
      const result = await toggleMod(modId, checked);
      
      if (result.needConfirm && result.conflicts) {
        // Handle conflicts
        const conflictList = result.conflicts
          .slice(0, 5)
          .map(c => `  • ${c.file}\\n    (${c.mod1} ↔ ${c.mod2})`)
          .join('\\n\\n');
        
        const moreConflicts = result.conflicts.length > 5
          ? t('conflictWarningMore', { count: result.conflicts.length - 5 })
          : '';
        
        const message =
          t('conflictWarningTitle', { count: result.conflicts.length }) +
          `\\n\\n${conflictList}${moreConflicts}` +
          t('conflictWarningMessage');
        
        if (confirm(message)) {
          await this.handleToggleMod({ modId, checked, continueOnConflict: true });
        } else {
          this.render();
        }
        return;
      }
      
      if (result.success) {
        if (checked) {
          const msg = result.conflictsResolved > 0
            ? t('modActivatedWithConflictsMsg', { count: result.conflictsResolved })
            : t('modActivatedMsg');
          showSuccess(msg);
        } else {
          showSuccess(t('modDeactivatedMsg'));
        }
      } else {
        showError(t('errorMsg', { error: result.error }));
      }
    }, DEBOUNCE_DELAYS.TOGGLE_MOD);
  }
  
  /**
   * Handle edit mod
   */
  async handleEditMod(data) {
    const mod = getModById(data.modId);
    if (!mod) {
      showError(t('errorMsg', { error: 'Mod not found' }));
      return;
    }
    
    appState.state.editingModId = mod.id;
    appState.state.currentCategories = mod.categories || [];
    
    const nameInput = $('#modName');
    const descInput = $('#modDescription');
    const filePathInput = $('#modFilePath');
    
    if (nameInput) nameInput.value = mod.name;
    if (descInput) descInput.value = mod.description || '';
    if (filePathInput) filePathInput.value = '';
    
    renderCategoriesGrid($(SELECTORS.CATEGORIES_GRID), mod.categories || []);
    
    const fileGroup = $('.file-select-group');
    if (fileGroup) hide(fileGroup);
    
    const modalTitle = $('#uploadModal h2');
    const submitBtn = $(`#uploadForm button[type="submit"]`);
    if (modalTitle) modalTitle.textContent = t('editModalTitle');
    if (submitBtn) submitBtn.textContent = t('updateBtn');
    
    showModal(SELECTORS.UPLOAD_MODAL);
  }
  
  /**
   * Handle delete mod
   */
  async handleDeleteMod(data) {
    if (!confirm(t('confirmDeleteMsg'))) {
      return;
    }
    
    const result = await deleteMod(data.modId);
    
    if (result.success) {
      showSuccess(t('modDeletedMsg'));
      renderCategoryFilters($(SELECTORS.FILTER_CATEGORIES));
    } else {
      if (result.error === 'ACTIVE_MOD') {
        showError(t('cannotDeleteActiveMod'));
      } else {
        showError(t('errorMsg', { error: result.error }));
      }
    }
  }
  
  /**
   * Handle reorder mods
   */
  async handleReorderMods(draggedId, targetId) {
    const result = await reorderMods(draggedId, targetId);
    if (!result.success) {
      showError(t('errorMsg', { error: result.error }));
    }
  }
  
  /**
   * Handle filter change
   */
  handleFilterChange(category) {
    appState.state.currentCategoryFilter = category;
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init().catch(error => {
    console.error('Failed to initialize app:', error);
  });
  
  // Expose app instance for debugging
  window.__app = app;
});
