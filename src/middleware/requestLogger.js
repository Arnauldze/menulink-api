const logger = require('../utils/logger');

/**
 * Request logging middleware
 * Logs all incoming requests with method, path, and response time
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log request
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Capture response
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;
    
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });

    return originalSend.call(this, data);
  };

  next();
};

module.exports = requestLogger;
