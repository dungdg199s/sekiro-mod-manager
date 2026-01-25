const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');
const { createExtractorFromFile } = require('node-unrar-js');

// Mod storage path
const MODS_DIR = path.join(process.env.LOCALAPPDATA, 'Sekiro', 'mods');
const MODS_DATA_FILE = path.join(MODS_DIR, 'mods.json');

/**
 * Extract archive file (ZIP or RAR)
 */
async function extractArchive(archivePath, targetDir) {
  const ext = path.extname(archivePath).toLowerCase();

  if (ext === '.zip') {
    // Extract ZIP
    const zip = new AdmZip(archivePath);
    zip.extractAllTo(targetDir, true);
  } else if (ext === '.rar') {
    // Extract RAR
    try {
      const extractor = await createExtractorFromFile({
        filepath: archivePath,
        targetPath: targetDir,
      });

      const extracted = extractor.extract();
      const files = [...extracted.files];

      return true;
    } catch (error) {
      console.error('RAR extraction error:', error);
      throw new Error('Failed to extract RAR file: ' + error.message);
    }
  } else {
    throw new Error('Unsupported archive file format');
  }
}

/**
 * Tạo thư mục mods nếu chưa tồn tại
 */
function ensureModsDir() {
  if (!fs.existsSync(MODS_DIR)) {
    fs.mkdirSync(MODS_DIR, { recursive: true });
  }
  if (!fs.existsSync(MODS_DATA_FILE)) {
    fs.writeFileSync(MODS_DATA_FILE, JSON.stringify([]));
  }
}

/**
 * Validate game directory (kiểm tra sekiro.exe)
 */
function isValidGameDir(dirPath) {
  if (!dirPath || !fs.existsSync(dirPath)) {
    return false;
  }
  const sekiroExe = path.join(dirPath, 'sekiro.exe');
  return fs.existsSync(sekiroExe);
}

/**
 * Tự động tìm thư mục game Sekiro
 */
function detectGameDirectory() {
  // Danh sách các đường dẫn Steam phổ biến
  const possiblePaths = [
    'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Sekiro',
    'C:\\Program Files\\Steam\\steamapps\\common\\Sekiro',
    'D:\\Steam\\steamapps\\common\\Sekiro',
    'D:\\SteamLibrary\\steamapps\\common\\Sekiro',
    'E:\\Steam\\steamapps\\common\\Sekiro',
    'E:\\SteamLibrary\\steamapps\\common\\Sekiro',
    'F:\\Steam\\steamapps\\common\\Sekiro',
    'F:\\SteamLibrary\\steamapps\\common\\Sekiro',
  ];

  // Kiểm tra từng đường dẫn
  for (const gamePath of possiblePaths) {
    if (isValidGameDir(gamePath)) {
      console.log('Game directory detected:', gamePath);
      return gamePath;
    }
  }

  // Nếu không tìm thấy, thử đọc từ registry (Windows)
  try {
    const { execSync } = require('child_process');
    const registryPath = 'HKEY_LOCAL_MACHINE\\SOFTWARE\\Wow6432Node\\Valve\\Steam';
    const command = `reg query "${registryPath}" /v InstallPath`;
    const output = execSync(command, { encoding: 'utf8' });
    const match = output.match(/InstallPath\s+REG_SZ\s+(.+)/);

    if (match && match[1]) {
      const steamPath = match[1].trim();
      const sekiroPath = path.join(steamPath, 'steamapps', 'common', 'Sekiro');
      if (isValidGameDir(sekiroPath)) {
        console.log('Game directory detected from registry:', sekiroPath);
        return sekiroPath;
      }
    }
  } catch (error) {
    console.log('Could not read Steam path from registry:', error.message);
  }

  return null;
}

/**
 * Đọc danh sách mods từ file
 */
function readMods() {
  try {
    const data = fs.readFileSync(MODS_DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading mods:', error);
    return [];
  }
}

/**
 * Lưu danh sách mods vào file
 */
function saveMods(mods) {
  fs.writeFileSync(MODS_DATA_FILE, JSON.stringify(mods, null, 2));
}

module.exports = {
  MODS_DIR,
  MODS_DATA_FILE,
  extractArchive,
  ensureModsDir,
  isValidGameDir,
  detectGameDirectory,
  readMods,
  saveMods,
};
