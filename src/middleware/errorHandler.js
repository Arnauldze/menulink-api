const logger = require('../utils/logger');

/**
 * Global error handling middleware
 * Formats all errors as JSON with error code, message, and details
 */
const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error('Request error', {
    message: err.message,
    path: req.path,
    method: req.method,
    statusCode: err.statusCode || 500,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Default error response
  let statusCode = err.statusCode || 500;
  let errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'An unexpected error occurred';
  let details = err.details || {};

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});
  } else if (err.name === 'CastError') {
    statusCode = 400;
    errorCode = 'INVALID_ID';
    message = 'Invalid ID format';
  } else if (err.code === 11000) {
    statusCode = 409;
    errorCode = 'DUPLICATE_ENTRY';
    message = 'Duplicate entry';
    const field = Object.keys(err.keyPattern)[0];
    details = { field, value: err.keyValue[field] };
  }

  // Send error response (strictly format to frontend spec)
  res.status(statusCode).json({
    success: false,
    error: {
      message: message
    }
  });
};

module.exports = errorHandler;
