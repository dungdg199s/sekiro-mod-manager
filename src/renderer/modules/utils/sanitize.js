/**
 * HTML sanitization and escaping utilities
 * @module sanitize
 */

const escapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;'
};

/**
 * Escape HTML special characters to prevent XSS attacks
 * @param {string|number} text - Text to escape
 * @returns {string} Escaped text
 * @example
 * escapeHtml('<script>alert("XSS")</script>')
 * // Returns: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
 */
export function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  if (typeof text !== 'string') {
    text = String(text);
  }
  return text.replace(/[&<>"']/g, m => escapeMap[m]);
}

/**
 * Create safe HTML template with automatic escaping
 * @param {string[]} strings - Template literal strings
 * @param {...any} values - Values to insert
 * @returns {string} Safe HTML string
 * @example
 * const name = '<script>alert("xss")</script>';
 * html`<div>Hello ${name}</div>`
 * // Returns: '<div>Hello &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</div>'
 */
export function html(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i] !== undefined ? escapeHtml(values[i]) : '';
    return result + str + value;
  }, '');
}

/**
 * Sanitize and validate file name
 * @param {string} fileName - File name to sanitize
 * @returns {string} Sanitized file name
 */
export function sanitizeFileName(fileName) {
  if (!fileName) return '';
  // Remove path traversal attempts and dangerous characters
  return fileName
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\.\./g, '')
    .trim();
}

/**
 * Strip HTML tags from text
 * @param {string} html - HTML string
 * @returns {string} Plain text
 */
export function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}
