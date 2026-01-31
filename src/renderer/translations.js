const translations = {
  vi: {
    // Header
    appTitle: '🎮 Sekiro Mod Manager',
    settingsBtn: '⚙️ Cài đặt',
    uploadBtn: '➕ Upload Mod',

    // Settings
    settingsTitle: 'Cài đặt',
    gameDirLabel: 'Thư mục game Sekiro:',
    gameDirPlaceholder: 'Chưa chọn thư mục',
    selectDirBtn: 'Chọn thư mục',
    closeBtn: 'Đóng',
    languageLabel: 'Ngôn ngữ:',

    // Upload Modal
    uploadModalTitle: 'Upload Mod Mới',
    editModalTitle: 'Chỉnh sửa Mod',
    modFileLabel: 'File Mod (ZIP/RAR):',
    modFilePlaceholder: 'Chọn file zip hoặc rar',
    selectFileBtn: 'Chọn file',
    modNameLabel: 'Tên Mod:',
    modNamePlaceholder: 'Nhập tên mod',
    modDescLabel: 'Mô tả:',
    modDescPlaceholder: 'Nhập mô tả cho mod (không bắt buộc)',
    modCategoriesLabel: 'Danh mục:',
    cancelBtn: 'Hủy',
    saveBtn: 'Lưu Mod',
    updateBtn: 'Cập nhật',

    // Mod List
    emptyState: 'Chưa có mod nào. Hãy upload mod đầu tiên!\n\nBạn có thể kéo thả file ZIP vào đây',
    noModsWithCategory: 'Không có mod nào trong danh mục này',
    editBtn: '✏️ Sửa',
    deleteBtn: '🗑️ Xóa',
    dropZoneText: 'Kéo thả file mod vào đây',
    dropZoneHint: 'Hỗ trợ ZIP và RAR',
    filterAll: 'Tất cả Mod',

    // Messages
    selectModFileMsg: 'Vui lòng chọn file mod!',
    modSavedMsg: 'Mod đã được lưu thành công!',
    modUpdatedMsg: 'Mod đã được cập nhật!',
    selectGameDirMsg: 'Vui lòng cài đặt thư mục game trước!',
    modActivatedMsg: 'Mod đã được kích hoạt và extract vào game/mods!',
    modActivatedWithConflictsMsg: 'Mod đã được kích hoạt!\n(Đã xử lý {count} file trùng lặp)',
    modDeactivatedMsg: 'Mod đã được vô hiệu hóa và thư mục mods đã được cập nhật!',
    confirmDeleteMsg: 'Bạn có chắc chắn muốn xóa mod này?',
    modDeletedMsg: 'Mod đã được xóa!',
    errorMsg: 'Lỗi: {error}',
    invalidGameDirMsg: 'Thư mục không hợp lệ! Không tìm thấy file sekiro.exe trong thư mục này.',
    cannotDeleteActiveMod: 'Không thể xóa mod đang kích hoạt! Vui lòng tắt mod trước khi xóa.',
    dragDropZipOnlyMsg: 'Vui lòng kéo thả file ZIP hoặc RAR!',
    selectGameDirTitle: 'Chọn thư mục game Sekiro',

    // Conflict Warning
    conflictWarningTitle: '⚠️ CẢNH BÁO: Phát hiện {count} file trùng lặp!',
    conflictWarningMore: '\n\n... và {count} file khác',
    conflictWarningMessage:
      '\n\nFile của mod được kích hoạt sau sẽ ghi đè lên mod trước.\nBạn có muốn tiếp tục?',
    noDescription: 'Không có mô tả',

    // Status messages
    activatingMod: 'Đang kích hoạt mod...',
    deactivatingMod: 'Đang vô hiệu hóa mod...',
  },

  en: {
    // Header
    appTitle: '🎮 Sekiro Mod Manager',
    settingsBtn: '⚙️ Settings',
    uploadBtn: '➕ Upload Mod',

    // Settings
    settingsTitle: 'Settings',
    gameDirLabel: 'Sekiro game directory:',
    gameDirPlaceholder: 'Not selected',
    selectDirBtn: 'Select folder',
    closeBtn: 'Close',
    languageLabel: 'Language:',

    // Upload Modal
    uploadModalTitle: 'Upload New Mod',
    editModalTitle: 'Edit Mod',
    modFileLabel: 'Mod File (ZIP/RAR):',
    modFilePlaceholder: 'Select zip or rar file',
    selectFileBtn: 'Select file',
    modNameLabel: 'Mod Name:',
    modNamePlaceholder: 'Enter mod name',
    modDescLabel: 'Description:',
    modDescPlaceholder: 'Enter mod description (optional)',
    modCategoriesLabel: 'Categories:',
    cancelBtn: 'Cancel',
    saveBtn: 'Save Mod',
    updateBtn: 'Update',

    // Mod List
    emptyState: 'No mods yet. Upload your first mod!\n\nYou can drag and drop ZIP files here',
    noModsWithCategory: 'No mods in this category',
    editBtn: '✏️ Edit',
    deleteBtn: '🗑️ Delete',
    dropZoneText: 'Drag and drop mod files here',
    dropZoneHint: 'Supports ZIP and RAR',
    filterAll: 'All Mods',

    // Messages
    selectModFileMsg: 'Please select a mod file!',
    modSavedMsg: 'Mod saved successfully!',
    modUpdatedMsg: 'Mod updated successfully!',
    selectGameDirMsg: 'Please set game directory first!',
    modActivatedMsg: 'Mod activated and extracted to game/mods!',
    modActivatedWithConflictsMsg: 'Mod activated!\n(Resolved {count} file conflicts)',
    modDeactivatedMsg: 'Mod deactivated and mods folder updated!',
    confirmDeleteMsg: 'Are you sure you want to delete this mod?',
    modDeletedMsg: 'Mod deleted!',
    errorMsg: 'Error: {error}',
    invalidGameDirMsg: 'Invalid directory! sekiro.exe not found in this folder.',
    cannotDeleteActiveMod: 'Cannot delete active mod! Please deactivate the mod before deleting.',
    dragDropZipOnlyMsg: 'Please drag and drop ZIP or RAR files!',
    selectGameDirTitle: 'Select Sekiro game directory',

    // Conflict Warning
    conflictWarningTitle: '⚠️ WARNING: {count} file conflicts detected!',
    conflictWarningMore: '\n\n... and {count} more files',
    conflictWarningMessage:
      '\n\nFiles from later activated mods will overwrite earlier ones.\nDo you want to continue?',
    noDescription: 'No description',

    // Status messages
    activatingMod: 'Activating mod...',
    deactivatingMod: 'Deactivating mod...',
  },
};

// Export for use in renderer
if (typeof module !== 'undefined' && module.exports) {
  module.exports = translations;
}

if (typeof window !== 'undefined') {
  window.translations = translations;
}
