const path = require('path');
const { app, BrowserWindow } = require('electron');
const { ensureModsDir } = require('./helpers');
const { setMainWindow } = require('./handlers');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    icon: path.join(__dirname, '..', 'assets', 'icon.png'),
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));

  // Mở DevTools trong chế độ development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  // Set main window cho handlers
  setMainWindow(mainWindow);
}

app.whenReady().then(() => {
  ensureModsDir();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
