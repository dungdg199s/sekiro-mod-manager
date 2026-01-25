const { contextBridge, ipcRenderer } = require('electron');

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
