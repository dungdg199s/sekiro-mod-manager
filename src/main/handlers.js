const { ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');
const {
  MODS_DIR,
  extractArchive,
  isValidGameDir,
  detectGameDirectory,
  readMods,
  saveMods,
} = require('./helpers');

let mainWindow;

function setMainWindow(window) {
  mainWindow = window;
}

/**
 * Lấy danh sách mod
 */
ipcMain.handle('get-mods', async () => {
  return readMods();
});

/**
 * Chọn file zip/rar mod
 */
ipcMain.handle('select-mod-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Archive Files', extensions: ['zip', 'rar'] }],
  });

  if (result.canceled) {
    return null;
  }

  return result.filePaths[0];
});

/**
 * Lưu mod mới
 */
ipcMain.handle('save-mod', async (event, modData) => {
  try {
    const { filePath, name, description } = modData;

    // Tạo ID unique cho mod
    const modId = Date.now().toString();
    const fileExt = path.extname(filePath);
    const modArchivePath = path.join(MODS_DIR, `${modId}${fileExt}`);

    // Copy file archive vào thư mục mods
    fs.copyFileSync(filePath, modArchivePath);

    // Đọc danh sách mod hiện tại
    const mods = readMods();

    // Thêm mod mới
    const newMod = {
      id: modId,
      name,
      description,
      zipPath: modArchivePath,
      active: false,
      createdAt: new Date().toISOString(),
    };

    mods.push(newMod);

    // Lưu lại danh sách
    saveMods(mods);

    return { success: true, mod: newMod };
  } catch (error) {
    console.error('Error saving mod:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Cập nhật thông tin mod
 */
ipcMain.handle('update-mod', async (event, modId, modData) => {
  try {
    const { name, description } = modData;

    // Đọc danh sách mod
    const mods = readMods();
    const mod = mods.find(m => m.id === modId);

    if (!mod) {
      return { success: false, error: 'Mod not found' };
    }

    // Cập nhật thông tin
    mod.name = name;
    mod.description = description;
    mod.updatedAt = new Date().toISOString();

    // Lưu lại
    saveMods(mods);

    return { success: true, mod };
  } catch (error) {
    console.error('Error updating mod:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Reorder mods (drag and drop)
 */
ipcMain.handle('reorder-mods', async (event, draggedId, targetId) => {
  try {
    const mods = readMods();

    // Tìm index của 2 mods
    const draggedIndex = mods.findIndex(m => m.id === draggedId);
    const targetIndex = mods.findIndex(m => m.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      return { success: false, error: 'Mod not found' };
    }

    // Reorder: remove và insert
    const [draggedMod] = mods.splice(draggedIndex, 1);
    mods.splice(targetIndex, 0, draggedMod);

    // Lưu lại
    saveMods(mods);

    return { success: true };
  } catch (error) {
    console.error('Error reordering mods:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Chọn thư mục game
 */
ipcMain.handle('select-game-dir', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select Sekiro game directory',
  });

  if (result.canceled) {
    return null;
  }

  const selectedPath = result.filePaths[0];

  // Validate game directory
  if (!isValidGameDir(selectedPath)) {
    return {
      error: true,
      errorCode: 'INVALID_GAME_DIR',
    };
  }

  return { path: selectedPath };
});

/**
 * Tự động phát hiện thư mục game
 */
ipcMain.handle('detect-game-dir', async () => {
  const detectedPath = detectGameDirectory();
  return detectedPath;
});

/**
 * Kích hoạt/vô hiệu hóa mod
 */
ipcMain.handle('toggle-mod', async (event, { modId, active, gameDir, continueOnConflict }) => {
  try {
    const mods = readMods();
    const mod = mods.find(m => m.id === modId);

    if (!mod) {
      return { success: false, error: 'Mod not found' };
    }

    if (!gameDir) {
      return { success: false, error: 'Game directory not specified' };
    }

    // Cập nhật trạng thái mod
    mod.active = active;
    mod.gameDir = gameDir;

    // Lấy tất cả mod đang active
    const activeMods = mods.filter(m => m.active);

    if (activeMods.length === 0) {
      // Không có mod nào active, xóa thư mục mods
      const modsTargetDir = path.join(gameDir, 'mods');
      if (fs.existsSync(modsTargetDir)) {
        fs.rmSync(modsTargetDir, { recursive: true, force: true });
      }
      saveMods(mods);
      return { success: true, mod };
    }

    // Kiểm tra conflicts trước khi extract
    const fileMap = new Map(); // key: đường dẫn file, value: tên mod
    const conflicts = [];

    for (const activeMod of activeMods) {
      const ext = path.extname(activeMod.zipPath).toLowerCase();
      let entries = [];

      if (ext === '.zip') {
        const zip = new AdmZip(activeMod.zipPath);
        entries = zip.getEntries().map(e => ({ name: e.entryName, isDirectory: e.isDirectory }));
      } else if (ext === '.rar') {
        // RAR - skip conflict check vì phức tạp, sẽ kiểm tra khi extract
        continue;
      }

      for (const entry of entries) {
        if (!entry.isDirectory) {
          const filePath = entry.name;
          if (fileMap.has(filePath)) {
            conflicts.push({
              file: filePath,
              mod1: fileMap.get(filePath),
              mod2: activeMod.name,
            });
          } else {
            fileMap.set(filePath, activeMod.name);
          }
        }
      }
    }

    // Nếu có conflicts và chưa được xác nhận, trả về warning
    if (conflicts.length > 0 && !continueOnConflict) {
      return {
        success: false,
        needConfirm: true,
        conflicts: conflicts,
        message: 'Phát hiện file trùng lặp giữa các mod',
      };
    }

    // Xóa và tạo lại thư mục mods
    const modsTargetDir = path.join(gameDir, 'mods');
    if (fs.existsSync(modsTargetDir)) {
      fs.rmSync(modsTargetDir, { recursive: true, force: true });
    }
    fs.mkdirSync(modsTargetDir, { recursive: true });

    // Extract tất cả mod active vào gameDir/mods
    for (const activeMod of activeMods) {
      await extractArchive(activeMod.zipPath, modsTargetDir);
    }

    // Cập nhật trạng thái
    saveMods(mods);

    return { success: true, mod, conflictsResolved: conflicts.length };
  } catch (error) {
    console.error('Error toggling mod:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Xóa mod
 */
ipcMain.handle('delete-mod', async (event, modId) => {
  try {
    const mods = readMods();
    const modIndex = mods.findIndex(m => m.id === modId);

    if (modIndex === -1) {
      return { success: false, error: 'Mod not found' };
    }

    const mod = mods[modIndex];

    // Kiểm tra xem mod có đang active không
    if (mod.active) {
      return {
        success: false,
        error: 'ACTIVE_MOD',
        message: 'Mod đang được kích hoạt. Vui lòng vô hiệu hóa mod trước khi xóa!',
      };
    }

    // Xóa file zip
    if (fs.existsSync(mod.zipPath)) {
      fs.unlinkSync(mod.zipPath);
    }

    // Xóa mod khỏi danh sách
    mods.splice(modIndex, 1);
    saveMods(mods);

    return { success: true };
  } catch (error) {
    console.error('Error deleting mod:', error);
    return { success: false, error: error.message };
  }
});

module.exports = {
  setMainWindow,
};
