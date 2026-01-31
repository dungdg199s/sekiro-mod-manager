const { contextBridge, ipcRenderer } = require('electron');

// Check if running in dev mode
const isDevMode = process.argv.includes('--dev');

// Expose dev mode flag to renderer
window.__DEV_MODE__ = isDevMode;

contextBridge.exposeInMainWorld('electronAPI', {
  getMods: () => ipcRenderer.invoke('get-mods'),
  selectModFile: () => ipcRenderer.invoke('select-mod-file'),
  saveMod: modData => ipcRenderer.invoke('save-mod', modData),
  updateMod: (modId, modData) => ipcRenderer.invoke('update-mod', modId, modData),
  reorderMods: (draggedId, targetId) => ipcRenderer.invoke('reorder-mods', draggedId, targetId),
  selectGameDir: () => ipcRenderer.invoke('select-game-dir'),
  detectGameDir: () => ipcRenderer.invoke('detect-game-dir'),
  toggleMod: data => ipcRenderer.invoke('toggle-mod', data),
  deleteMod: modId => ipcRenderer.invoke('delete-mod', modId),
  addCategory: (modId, category) => ipcRenderer.invoke('add-category', modId, category),
  removeCategory: (modId, category) => ipcRenderer.invoke('remove-category', modId, category),
  getAllCategories: () => ipcRenderer.invoke('get-all-categories'),
});

contextBridge.exposeInMainWorld('api', {
  invoke: (action, payload) => ipcRenderer.invoke('rpc:invoke', { action, payload }),
});

contextBridge.exposeInMainWorld('bus', {
  on: (event, cb) => {
    const listener = (_e, data) => cb(data);
    ipcRenderer.on(event, listener);
    return () => ipcRenderer.removeListener(event, listener); // cleanup
  },
  send: (event, data) => ipcRenderer.send(event, data),
});
