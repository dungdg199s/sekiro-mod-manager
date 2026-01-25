/**
 * Drag and drop file upload
 * @module dropZone
 */

import { addClass, removeClass } from '../utils/domHelpers.js';

/**
 * Setup file drop zone
 * @param {HTMLElement} dropZone - Drop zone element
 * @param {Function} onFileDrop - Callback when file is dropped (file) => void
 */
export function setupFileDropZone(dropZone, onFileDrop) {
  if (!dropZone) return;
  
  // Prevent default drag behaviors
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
  });
  
  // Highlight drop zone when item is dragged over it
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => highlight(dropZone), false);
  });
  
  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => unhighlight(dropZone), false);
  });
  
  // Handle dropped files
  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
      handleFiles(files, onFileDrop);
    }
  }, false);
}

/**
 * Prevent default drag behaviors
 * @param {Event} e - Event object
 */
function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

/**
 * Highlight drop zone
 * @param {HTMLElement} element - Drop zone element
 */
function highlight(element) {
  addClass(element, 'drag-over');
}

/**
 * Remove highlight from drop zone
 * @param {HTMLElement} element - Drop zone element
 */
function unhighlight(element) {
  removeClass(element, 'drag-over');
}

/**
 * Handle dropped files
 * @param {FileList} files - Dropped files
 * @param {Function} callback - Callback function
 */
function handleFiles(files, callback) {
  const file = files[0]; // Only handle first file
  
  // Check if file is archive
  const validExtensions = ['.zip', '.rar'];
  const isValid = validExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );
  
  if (isValid && callback) {
    callback(file);
  } else {
    console.warn('Invalid file type. Only ZIP and RAR files are supported.');
  }
}
