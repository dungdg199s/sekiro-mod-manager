/**
 * Drag and drop mod reordering
 * @module dragAndDrop
 */

import { addClass, removeClass } from '../utils/domHelpers.js';

let draggedElement = null;
let draggedOverElement = null;

/**
 * Setup drag and drop for mod reordering
 * @param {HTMLElement} container - Mods container
 * @param {Function} onReorder - Callback when reorder happens (draggedId, targetId) => void
 */
export function setupModReordering(container, onReorder) {
  if (!container) return;
  
  // Use event delegation
  container.addEventListener('dragstart', handleDragStart);
  container.addEventListener('dragover', handleDragOver);
  container.addEventListener('drop', (e) => handleDrop(e, onReorder));
  container.addEventListener('dragenter', handleDragEnter);
  container.addEventListener('dragleave', handleDragLeave);
  container.addEventListener('dragend', handleDragEnd);
}

/**
 * Handle drag start
 * @param {DragEvent} e - Drag event
 */
function handleDragStart(e) {
  const modCard = e.target.closest('.mod-card');
  if (!modCard) return;
  
  draggedElement = modCard;
  addClass(modCard, 'dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', modCard.innerHTML);
}

/**
 * Handle drag over
 * @param {DragEvent} e - Drag event
 */
function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}

/**
 * Handle drag enter
 * @param {DragEvent} e - Drag event
 */
function handleDragEnter(e) {
  const modCard = e.target.closest('.mod-card');
  if (modCard && modCard !== draggedElement) {
    addClass(modCard, 'drag-over');
    draggedOverElement = modCard;
  }
}

/**
 * Handle drag leave
 * @param {DragEvent} e - Drag event
 */
function handleDragLeave(e) {
  const modCard = e.target.closest('.mod-card');
  if (modCard) {
    removeClass(modCard, 'drag-over');
  }
}

/**
 * Handle drop
 * @param {DragEvent} e - Drag event
 * @param {Function} onReorder - Reorder callback
 */
function handleDrop(e, onReorder) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  
  const targetCard = e.target.closest('.mod-card');
  
  if (draggedElement && targetCard && draggedElement !== targetCard) {
    const draggedId = draggedElement.dataset.modId;
    const targetId = targetCard.dataset.modId;
    
    if (draggedId && targetId && onReorder) {
      onReorder(draggedId, targetId);
    }
  }
  
  return false;
}

/**
 * Handle drag end
 * @param {DragEvent} e - Drag event
 */
function handleDragEnd(e) {
  const modCard = e.target.closest('.mod-card');
  if (modCard) {
    removeClass(modCard, 'dragging');
  }
  
  // Remove all drag-over classes
  document.querySelectorAll('.mod-card').forEach(card => {
    removeClass(card, 'drag-over');
  });
  
  draggedElement = null;
  draggedOverElement = null;
}

/**
 * Cleanup drag and drop listeners
 * @param {HTMLElement} container - Mods container
 */
export function cleanupModReordering(container) {
  if (!container) return;
  
  container.removeEventListener('dragstart', handleDragStart);
  container.removeEventListener('dragover', handleDragOver);
  container.removeEventListener('drop', handleDrop);
  container.removeEventListener('dragenter', handleDragEnter);
  container.removeEventListener('dragleave', handleDragLeave);
  container.removeEventListener('dragend', handleDragEnd);
}
