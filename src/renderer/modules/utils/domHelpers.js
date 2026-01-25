/**
 * DOM manipulation utilities
 * @module domHelpers
 */

/**
 * Query selector wrapper with error handling
 * @param {string} selector - CSS selector
 * @param {Element} [context=document] - Context element
 * @returns {Element|null} Found element or null
 */
export function $(selector, context = document) {
  try {
    const element = context.querySelector(selector);
    if (!element) {
      console.warn(`Element not found: ${selector}`);
    }
    return element;
  } catch (error) {
    console.error(`Invalid selector: ${selector}`, error);
    return null;
  }
}

/**
 * Query all elements wrapper
 * @param {string} selector - CSS selector
 * @param {Element} [context=document] - Context element
 * @returns {Element[]} Array of elements
 */
export function $$(selector, context = document) {
  try {
    return Array.from(context.querySelectorAll(selector));
  } catch (error) {
    console.error(`Invalid selector: ${selector}`, error);
    return [];
  }
}

/**
 * Create element with attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} [attrs={}] - Element attributes and properties
 * @param {(string|Element)[]} [children=[]] - Child elements or text
 * @returns {HTMLElement} Created element
 * @example
 * createElement('div', { className: 'card', 'data-id': '123' }, [
 *   createElement('h3', {}, ['Title']),
 *   'Some text'
 * ])
 */
export function createElement(tag, attrs = {}, children = []) {
  const element = document.createElement(tag);
  
  Object.entries(attrs).forEach(([key, value]) => {
    if (key.startsWith('on') && typeof value === 'function') {
      // Event listener
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else if (key === 'className') {
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key in element) {
      // Property
      element[key] = value;
    } else {
      // Attribute
      element.setAttribute(key, value);
    }
  });
  
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof HTMLElement) {
      element.appendChild(child);
    }
  });
  
  return element;
}

/**
 * Add class to element
 * @param {Element} element - Target element
 * @param {...string} classes - Classes to add
 */
export function addClass(element, ...classes) {
  if (element) {
    element.classList.add(...classes);
  }
}

/**
 * Remove class from element
 * @param {Element} element - Target element
 * @param {...string} classes - Classes to remove
 */
export function removeClass(element, ...classes) {
  if (element) {
    element.classList.remove(...classes);
  }
}

/**
 * Toggle class on element
 * @param {Element} element - Target element
 * @param {string} className - Class to toggle
 * @param {boolean} [force] - Force add or remove
 */
export function toggleClass(element, className, force) {
  if (element) {
    return element.classList.toggle(className, force);
  }
  return false;
}

/**
 * Check if element has class
 * @param {Element} element - Target element
 * @param {string} className - Class to check
 * @returns {boolean}
 */
export function hasClass(element, className) {
  return element ? element.classList.contains(className) : false;
}

/**
 * Set multiple attributes on element
 * @param {Element} element - Target element
 * @param {Object} attrs - Attributes to set
 */
export function setAttributes(element, attrs) {
  if (element) {
    Object.entries(attrs).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
}

/**
 * Empty element (remove all children)
 * @param {Element} element - Target element
 */
export function empty(element) {
  if (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}

/**
 * Show element
 * @param {Element} element - Target element
 * @param {string} [display='block'] - Display value
 */
export function show(element, display = 'block') {
  if (element) {
    element.style.display = display;
  }
}

/**
 * Hide element
 * @param {Element} element - Target element
 */
export function hide(element) {
  if (element) {
    element.style.display = 'none';
  }
}

/**
 * Toggle element visibility
 * @param {Element} element - Target element
 */
export function toggle(element) {
  if (element) {
    element.style.display = element.style.display === 'none' ? '' : 'none';
  }
}

/**
 * Insert HTML at position
 * @param {Element} element - Target element
 * @param {string} position - Position: 'beforebegin', 'afterbegin', 'beforeend', 'afterend'
 * @param {string} html - HTML to insert
 */
export function insertHTML(element, position, html) {
  if (element) {
    element.insertAdjacentHTML(position, html);
  }
}

/**
 * Get element's data attributes as object
 * @param {Element} element - Target element
 * @returns {Object} Data attributes
 */
export function getDataset(element) {
  return element ? { ...element.dataset } : {};
}
