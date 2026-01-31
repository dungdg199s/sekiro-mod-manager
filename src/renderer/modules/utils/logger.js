/**
 * Logger utility for development debugging
 * @module utils/logger
 * 
 * Only logs when running in dev mode (yarn run dev)
 */

/**
 * Check if app is running in dev mode
 * @returns {boolean}
 */
function isDevMode() {
  return window.__DEV_MODE__ === true;
}

/**
 * Logger class with color-coded console output
 */
class Logger {
  constructor(moduleName) {
    this.moduleName = moduleName;
    this.colors = {
      info: '#3498db',    // Blue
      success: '#2ecc71', // Green
      warn: '#f39c12',    // Orange
      error: '#e74c3c',   // Red
      debug: '#9b59b6'    // Purple
    };
  }

  /**
   * Format log message with module name
   * @private
   */
  _format(level, message, data) {
    const timestamp = new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    });
    
    return {
      timestamp,
      module: this.moduleName,
      level,
      message,
      data
    };
  }

  /**
   * Log with color styling
   * @private
   */
  _log(level, color, message, data) {
    if (!isDevMode()) return;

    const formatted = this._format(level, message, data);
    
    console.log(
      `%c[${formatted.timestamp}]%c [${formatted.module}]%c ${formatted.level.toUpperCase()}:%c ${formatted.message}`,
      'color: #95a5a6; font-weight: normal',
      `color: ${color}; font-weight: bold`,
      `color: ${color}; font-weight: bold`,
      'color: inherit; font-weight: normal'
    );

    if (data !== undefined) {
      console.log('%cData:', 'color: #95a5a6; font-style: italic', data);
    }
  }

  /**
   * Info level log
   * @param {string} message - Log message
   * @param {*} [data] - Optional data to log
   */
  info(message, data) {
    this._log('info', this.colors.info, message, data);
  }

  /**
   * Success level log
   * @param {string} message - Log message
   * @param {*} [data] - Optional data to log
   */
  success(message, data) {
    this._log('success', this.colors.success, message, data);
  }

  /**
   * Warning level log
   * @param {string} message - Log message
   * @param {*} [data] - Optional data to log
   */
  warn(message, data) {
    this._log('warn', this.colors.warn, message, data);
  }

  /**
   * Error level log
   * @param {string} message - Log message
   * @param {*} [data] - Optional data to log
   */
  error(message, data) {
    this._log('error', this.colors.error, message, data);
  }

  /**
   * Debug level log
   * @param {string} message - Log message
   * @param {*} [data] - Optional data to log
   */
  debug(message, data) {
    this._log('debug', this.colors.debug, message, data);
  }

  /**
   * Log function entry
   * @param {string} fnName - Function name
   * @param {*} [params] - Function parameters
   */
  fnStart(fnName, params) {
    if (!isDevMode()) return;
    
    console.group(`%c→ ${this.moduleName}.${fnName}()`, 'color: #3498db; font-weight: bold');
    if (params !== undefined) {
      console.log('%cParams:', 'color: #95a5a6; font-style: italic', params);
    }
  }

  /**
   * Log function exit
   * @param {string} fnName - Function name
   * @param {*} [result] - Function result
   */
  fnEnd(fnName, result) {
    if (!isDevMode()) return;
    
    if (result !== undefined) {
      console.log('%cResult:', 'color: #95a5a6; font-style: italic', result);
    }
    console.groupEnd();
  }

  /**
   * Log async function timing
   * @param {string} fnName - Function name
   * @param {Function} fn - Async function to execute
   * @param {*} [params] - Function parameters
   * @returns {Promise<*>} Function result
   */
  async timeAsync(fnName, fn, params) {
    if (!isDevMode()) {
      return await fn();
    }

    this.fnStart(fnName, params);
    const startTime = performance.now();
    
    try {
      const result = await fn();
      const duration = (performance.now() - startTime).toFixed(2);
      this.success(`Completed in ${duration}ms`);
      this.fnEnd(fnName, result);
      return result;
    } catch (error) {
      const duration = (performance.now() - startTime).toFixed(2);
      this.error(`Failed after ${duration}ms`, error);
      console.groupEnd();
      throw error;
    }
  }

  /**
   * Create a table log
   * @param {string} label - Table label
   * @param {Array|Object} data - Data to display
   */
  table(label, data) {
    if (!isDevMode()) return;
    
    console.log(`%c${this.moduleName}: ${label}`, 'color: #9b59b6; font-weight: bold');
    console.table(data);
  }
}

/**
 * Create a logger instance for a module
 * @param {string} moduleName - Name of the module
 * @returns {Logger}
 */
export function createLogger(moduleName) {
  return new Logger(moduleName);
}

/**
 * Global logger (for general use)
 */
export const logger = new Logger('App');

// Log dev mode status on load
if (isDevMode()) {
  console.log(
    '%c🔧 Development Mode Enabled',
    'background: #2ecc71; color: white; font-weight: bold; padding: 4px 8px; border-radius: 3px'
  );
}
