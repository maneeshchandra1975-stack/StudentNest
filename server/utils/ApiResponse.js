'use strict';

/**
 * Standard API Response Formatter
 * Ensures all responses follow the same structure
 */
class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success    = statusCode < 400;
    this.statusCode = statusCode;
    this.message    = message;
    if (data !== null) this.data = data;
  }
}

module.exports = ApiResponse;
