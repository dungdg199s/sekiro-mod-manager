/**
 * Input validation service
 * @module validationService
 */

/**
 * Validate mod name
 * @param {string} name - Mod name
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validateModName(name) {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Mod name is required' };
  }
  
  if (name.length > 100) {
    return { valid: false, error: 'Mod name is too long (max 100 characters)' };
  }
  
  return { valid: true };
}

/**
 * Validate mod description
 * @param {string} description - Mod description
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validateModDescription(description) {
  if (description && description.length > 500) {
    return { valid: false, error: 'Description is too long (max 500 characters)' };
  }
  
  return { valid: true };
}

/**
 * Validate file path
 * @param {string} filePath - File path
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validateFilePath(filePath) {
  if (!filePath || filePath.trim().length === 0) {
    return { valid: false, error: 'File path is required' };
  }
  
  const validExtensions = ['.zip', '.rar'];
  const hasValidExtension = validExtensions.some(ext => 
    filePath.toLowerCase().endsWith(ext)
  );
  
  if (!hasValidExtension) {
    return { valid: false, error: 'File must be ZIP or RAR' };
  }
  
  return { valid: true };
}

/**
 * Validate game directory
 * @param {string} dirPath - Directory path
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validateGameDir(dirPath) {
  if (!dirPath || dirPath.trim().length === 0) {
    return { valid: false, error: 'Game directory is required' };
  }
  
  // Basic path validation
  if (dirPath.length < 3) {
    return { valid: false, error: 'Invalid directory path' };
  }
  
  return { valid: true };
}

/**
 * Validate categories
 * @param {Array} categories - Array of category names
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validateCategories(categories) {
  if (!Array.isArray(categories)) {
    return { valid: false, error: 'Categories must be an array' };
  }
  
  // Categories are optional, so empty array is valid
  return { valid: true };
}

/**
 * Validate mod data for creation
 * @param {Object} modData - Mod data object
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateModData(modData) {
  const errors = [];
  
  const nameCheck = validateModName(modData.name);
  if (!nameCheck.valid) errors.push(nameCheck.error);
  
  const descCheck = validateModDescription(modData.description);
  if (!descCheck.valid) errors.push(descCheck.error);
  
  if (modData.filePath) {
    const fileCheck = validateFilePath(modData.filePath);
    if (!fileCheck.valid) errors.push(fileCheck.error);
  }
  
  const catCheck = validateCategories(modData.categories);
  if (!catCheck.valid) errors.push(catCheck.error);
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize mod name (remove dangerous characters)
 * @param {string} name - Mod name
 * @returns {string} Sanitized name
 */
export function sanitizeModName(name) {
  if (!name) return '';
  return name
    .replace(/[<>:"/\\|?*]/g, '') // Remove dangerous characters
    .trim();
}

/**
 * Validate and sanitize input
 * @param {string} input - Input string
 * @param {Object} options - Validation options
 * @returns {Object} { valid: boolean, sanitized: string, error?: string }
 */
export function validateAndSanitize(input, options = {}) {
  const {
    required = false,
    minLength = 0,
    maxLength = Infinity,
    pattern = null
  } = options;
  
  // Check required
  if (required && (!input || input.trim().length === 0)) {
    return { valid: false, sanitized: '', error: 'This field is required' };
  }
  
  const sanitized = input ? input.trim() : '';
  
  // Check length
  if (sanitized.length < minLength) {
    return { 
      valid: false, 
      sanitized, 
      error: `Minimum length is ${minLength} characters` 
    };
  }
  
  if (sanitized.length > maxLength) {
    return { 
      valid: false, 
      sanitized, 
      error: `Maximum length is ${maxLength} characters` 
    };
  }
  
  // Check pattern
  if (pattern && sanitized && !pattern.test(sanitized)) {
    return { 
      valid: false, 
      sanitized, 
      error: 'Invalid format' 
    };
  }
  
  return { valid: true, sanitized };
}
