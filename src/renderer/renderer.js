let gameDir = localStorage.getItem('gameDir') || '';
let selectedModFile = null;
let currentLang = localStorage.getItem('language') || 'en';
let editingModId = null; // ID of the mod currently being edited

// Status bar and debounce
let statusTimeout = null;
const debounceTimers = new Map();

// i18n helper function
function t(key) {
  return translations[currentLang][key] || key;
}

function showStatus(message, type = 'info', duration = 3000) {
  const statusBar = document.getElementById('statusBar');
  const statusText = document.getElementById('statusText');

  statusText.textContent = message;
  statusBar.classList.remove('success', 'error', 'warning', 'info');
  statusBar.classList.add('visible', type);

  if (statusTimeout) {
    clearTimeout(statusTimeout);
  }

  statusTimeout = setTimeout(() => {
    statusBar.classList.remove('visible');
  }, duration);
}

function debounce(key, fn, delay = 500) {
  if (debounceTimers.has(key)) {
    clearTimeout(debounceTimers.get(key));
  }

  const timer = setTimeout(() => {
    debounceTimers.delete(key);
    fn();
  }, delay);

  debounceTimers.set(key, timer);
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('language', lang);

  // Update all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });

  // Reload mods to update UI text
  loadMods();
}

// Elements
const uploadBtn = document.getElementById('uploadBtn');
const uploadModal = document.getElementById('uploadModal');
const selectFileBtn = document.getElementById('selectFileBtn');
const cancelBtn = document.getElementById('cancelBtn');
const uploadForm = document.getElementById('uploadForm');
const modsContainer = document.getElementById('modsContainer');
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const selectGameDirBtn = document.getElementById('selectGameDirBtn');
const gameDirInput = document.getElementById('gameDirInput');
const languageSelect = document.getElementById('languageSelect');

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
  // Set language
  languageSelect.value = currentLang;
  setLanguage(currentLang);

  loadMods();

  // Tự động phát hiện game directory nếu chưa có
  if (!gameDir) {
    const detectedDir = await window.electronAPI.detectGameDir();
    if (detectedDir) {
      gameDir = detectedDir;
      gameDirInput.value = detectedDir;
      localStorage.setItem('gameDir', detectedDir);
      console.log('Auto-detected game directory:', detectedDir);
    }
  } else {
    gameDirInput.value = gameDir;
  }

  // Set up drag and drop for the file zone
  loadMods();
});

// Drag and drop file zone
function setupFileDropZone() {
  const dropZone = document.getElementById('fileDropZone');
  if (!dropZone) return;

  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragleave', e => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('drag-over');
  });

  dropZone.addEventListener('drop', async e => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('drag-over');

    const files = Array.from(e.dataTransfer.files);
    const archiveFiles = files.filter(f => {
      const name = f.name.toLowerCase();
      return name.endsWith('.zip') || name.endsWith('.rar');
    });

    if (archiveFiles.length === 0) {
      alert(t('dragDropZipOnlyMsg'));
      return;
    }

    // Process the first file
    const file = archiveFiles[0];
    selectedModFile = file.path;

    // Mở upload modal và điền thông tin
    uploadModal.style.display = 'flex';
    document.getElementById('modFilePath').value = file.path;

    // Tự động điền tên mod
    const modName = file.name.replace(/\.(zip|rar)$/i, '');
    document.getElementById('modName').value = modName;
    document.getElementById('modDescription').value = '';
  });
}

// Language change
languageSelect.addEventListener('change', e => {
  setLanguage(e.target.value);
});

// Settings panel
settingsBtn.addEventListener('click', () => {
  settingsPanel.style.display = 'flex';
});

closeSettingsBtn.addEventListener('click', () => {
  settingsPanel.style.display = 'none';
});

selectGameDirBtn.addEventListener('click', async () => {
  const result = await window.electronAPI.selectGameDir();

  if (!result) {
    return; // User cancelled
  }

  if (result.error) {
    // Hiển thị lỗi validation
    if (result.errorCode === 'INVALID_GAME_DIR') {
      alert(t('invalidGameDirMsg'));
    } else {
      alert(result.message || t('errorMsg').replace('{error}', 'Unknown error'));
    }
    return;
  }

  // Thành công
  gameDir = result.path;
  gameDirInput.value = result.path;
  localStorage.setItem('gameDir', result.path);
});

// Upload modal
uploadBtn.addEventListener('click', () => {
  uploadModal.style.display = 'flex';
});

cancelBtn.addEventListener('click', () => {
  closeUploadModal();
});

selectFileBtn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.selectModFile();
  if (filePath) {
    selectedModFile = filePath;
    document.getElementById('modFilePath').value = filePath;

    // Tự động điền tên mod từ tên file
    const fileName = filePath.split('\\').pop().split('/').pop();
    const modName = fileName.replace(/\.(zip|rar)$/i, ''); // Bỏ phần mở rộng .zip hoặc .rar
    document.getElementById('modName').value = modName;
  }
});

uploadForm.addEventListener('submit', async e => {
  e.preventDefault();

  // Kiểm tra edit mode hay upload mode
  if (editingModId) {
    // Edit mode - không cần file
    const modData = {
      name: document.getElementById('modName').value,
      description: document.getElementById('modDescription').value,
    };

    await updateMod(editingModId, modData);
  } else {
    // Upload mode - cần file
    if (!selectedModFile) {
      alert(t('selectModFileMsg'));
      return;
    }

    const modData = {
      filePath: selectedModFile,
      name: document.getElementById('modName').value,
      description: document.getElementById('modDescription').value,
    };

    const result = await window.electronAPI.saveMod(modData);

    if (result.success) {
      alert(t('modSavedMsg'));
      closeUploadModal();
      loadMods();
    } else {
      alert(t('errorMsg').replace('{error}', result.error));
    }
  }
});

function closeUploadModal() {
  uploadModal.style.display = 'none';
  uploadForm.reset();
  selectedModFile = null;
  editingModId = null;
  document.getElementById('modFilePath').value = '';

  // Reset UI về upload mode
  document.querySelector('.file-select-group').style.display = 'flex';
  document.querySelector('#uploadModal h2').textContent = t('uploadModalTitle');
  document.querySelector('#uploadForm button[type="submit"]').textContent = t('saveBtn');
}

// Load và hiển thị danh sách mod
async function loadMods() {
  const mods = await window.electronAPI.getMods();

  if (mods.length === 0) {
    modsContainer.innerHTML = `<div class="empty-state">${t('emptyState')}</div>`;
  } else {
    modsContainer.innerHTML = mods
      .map(
        (mod, index) => `
      <div class="mod-card" draggable="true" data-mod-id="${mod.id}" data-order="${index}">
        <div class="mod-header">
          <div class="drag-handle">☰</div>
          <h3>${escapeHtml(mod.name)}</h3>
          <label class="switch">
            <input type="checkbox" ${
              mod.active ? 'checked' : ''
            } onchange="toggleMod('${mod.id}', this.checked)">
            <span class="slider"></span>
          </label>
        </div>
        <p class="mod-description">${escapeHtml(mod.description || t('noDescription'))}</p>
        <div class="mod-footer">
          <span class="mod-date">📅 ${new Date(mod.createdAt).toLocaleDateString(
            currentLang === 'vi' ? 'vi-VN' : 'en-US'
          )}</span>
          <div class="mod-actions">
            <button class="btn btn-secondary btn-small" onclick="editMod('${
              mod.id
            }')">${t('editBtn')}</button>
            <button class="btn btn-danger btn-small" onclick="deleteMod('${
              mod.id
            }')">${t('deleteBtn')}</button>
          </div>
        </div>
      </div>
    `
      )
      .join('');

    // Setup drag and drop for reordering
    setupDragAndDropReorder();
  }

  // Thêm file drop zone phía dưới
  const dropZoneHtml = `
    <div class="file-drop-zone" id="fileDropZone">
      <div class="drop-zone-content">
        <div class="drop-zone-icon">📁</div>
        <div class="drop-zone-text">${t('dropZoneText')}</div>
        <div class="drop-zone-hint">${t('dropZoneHint')}</div>
      </div>
    </div>
  `;

  modsContainer.insertAdjacentHTML('beforeend', dropZoneHtml);

  // Setup file drop zone
  setupFileDropZone();
}

// Drag and drop reordering
let draggedElement = null;
let draggedOverElement = null;

function setupDragAndDropReorder() {
  const modCards = document.querySelectorAll('.mod-card');

  modCards.forEach(card => {
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragover', handleDragOver);
    card.addEventListener('drop', handleDrop);
    card.addEventListener('dragenter', handleDragEnter);
    card.addEventListener('dragleave', handleDragLeave);
    card.addEventListener('dragend', handleDragEnd);
  });
}

function handleDragStart(e) {
  draggedElement = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDragEnter(e) {
  if (this !== draggedElement) {
    this.classList.add('drag-over');
    draggedOverElement = this;
  }
}

function handleDragLeave(e) {
  this.classList.remove('drag-over');
}

async function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }

  if (draggedElement !== this) {
    // Lấy order của 2 cards
    const draggedId = draggedElement.dataset.modId;
    const targetId = this.dataset.modId;

    // Gọi API để update order
    const result = await window.electronAPI.reorderMods(draggedId, targetId);

    if (result.success) {
      // Reload lại danh sách
      loadMods();
    } else {
      alert(t('errorMsg').replace('{error}', result.error));
    }
  }

  return false;
}

function handleDragEnd(e) {
  this.classList.remove('dragging');

  // Xóa tất cả drag-over classes
  document.querySelectorAll('.mod-card').forEach(card => {
    card.classList.remove('drag-over');
  });

  draggedElement = null;
  draggedOverElement = null;
}

// Kích hoạt/vô hiệu hóa mod
function toggleMod(modId, active, options = {}) {
  // Hỗ trợ cả kiểu boolean cũ lẫn options object mới
  const continueOnConflict =
    typeof options === 'boolean'
      ? options
      : Boolean(options.continueOnConflict);
  // Kiểm tra gameDir ngay lập tức
  if (!gameDir && !continueOnConflict) {
    showStatus(t('selectGameDirMsg'), 'warning');
    setTimeout(() => loadMods(), 100);
    return;
  }

  debounce(
    `toggleMod`,
    () => {
      toggleModWrapper(modId, active);
    },
    300
  );
}

async function toggleModWrapper(modId, active) {
  showStatus(active ? t('activatingMod') : t('deactivatingMod'), 'info', 10000);

  const result = await window.electronAPI.toggleMod({
    modId,
    active,
    gameDir,
    continueOnConflict,
  });

  // Xử lý conflict warning
  if (result.needConfirm && result.conflicts) {
    const conflictList = result.conflicts
      .slice(0, 5)
      .map(c => `  • ${c.file}\n    (${c.mod1} ↔ ${c.mod2})`)
      .join('\n\n');

    const moreConflicts =
      result.conflicts.length > 5
        ? t('conflictWarningMore').replace('{count}', result.conflicts.length - 5)
        : '';

    const message =
      t('conflictWarningTitle').replace('{count}', result.conflicts.length) +
      `\n\n${conflictList}${moreConflicts}` +
      t('conflictWarningMessage');

    if (confirm(message)) {
      toggleMod(modId, active, true);
    } else {
      loadMods();
    }
    return;
  }

  if (result.success) {
    if (active) {
      const msg =
        result.conflictsResolved > 0
          ? t('modActivatedWithConflictsMsg').replace('{count}', result.conflictsResolved)
          : t('modActivatedMsg');
      showStatus(msg, 'success');
    } else {
      showStatus(t('modDeactivatedMsg'), 'success');
    }
    loadMods();
  } else {
    showStatus(t('errorMsg').replace('{error}', result.error), 'error');
    loadMods();
  }
}

// Xóa mod
async function deleteMod(modId) {
  if (!confirm(t('confirmDeleteMsg'))) {
    return;
  }

  const result = await window.electronAPI.deleteMod(modId);

  if (result.success) {
    alert(t('modDeletedMsg'));
    loadMods();
  } else {
    // Xử lý lỗi đặc biệt cho active mod
    if (result.error === 'ACTIVE_MOD') {
      alert(t('cannotDeleteActiveMod'));
    } else {
      alert(t('errorMsg').replace('{error}', result.error));
    }
    loadMods();
  }
}

// Chỉnh sửa mod
async function editMod(modId) {
  const mods = await window.electronAPI.getMods();
  const mod = mods.find(m => m.id === modId);

  if (!mod) {
    alert(t('errorMsg').replace('{error}', 'Mod not found'));
    return;
  }

  // Lưu ID đang edit
  editingModId = modId;

  // Điền thông tin vào form
  document.getElementById('modName').value = mod.name;
  document.getElementById('modDescription').value = mod.description || '';
  document.getElementById('modFilePath').value = '';

  // Ẩn phần chọn file (không thể thay đổi file archive)
  document.querySelector('.file-select-group').style.display = 'none';

  // Thay đổi tiêu đề và nút
  document.querySelector('#uploadModal h2').textContent = t('editModalTitle');
  document.querySelector('#uploadForm button[type="submit"]').textContent = t('updateBtn');

  // Mở modal
  uploadModal.style.display = 'flex';
}

// Cập nhật mod
async function updateMod(modId, modData) {
  const result = await window.electronAPI.updateMod(modId, modData);

  if (result.success) {
    alert(t('modUpdatedMsg'));
    closeUploadModal();
    loadMods();
  } else {
    alert(t('errorMsg').replace('{error}', result.error));
  }
}

// Utility function
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
