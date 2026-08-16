const logger = require('../utils/logger');

/**
 * Request logging middleware
 * Logs all incoming requests with method, path, body, and response time
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log request with body for POST/PUT/PATCH
  const logData = {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  };

  // Log request body for mutations (exclude password fields)
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
    const sanitizedBody = { ...req.body };
    // Remove sensitive fields from logs
    if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
    if (sanitizedBody.password_hash) sanitizedBody.password_hash = '[REDACTED]';
    logData.body = sanitizedBody;
  }

  logger.info('Incoming request', logData);

  // Capture response
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;
    
    const responseLog = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    };

    // Log response body for errors (4xx, 5xx)
    if (res.statusCode >= 400) {
      try {
        const responseBody = typeof data === 'string' ? JSON.parse(data) : data;
        responseLog.error = responseBody?.error?.message || responseBody?.message || 'Unknown error';
      } catch (e) {
        // Ignore JSON parse errors
      }
    }

    logger.info('Request completed', responseLog);

    return originalSend.call(this, data);
  };

  next();
};

module.exports = requestLogger;
