const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const COLORS = {
  error: '\x1b[31m', // red
  warn: '\x1b[33m',  // yellow
  info: '\x1b[36m',  // cyan
  debug: '\x1b[90m', // gray
  reset: '\x1b[0m',
};

const getCurrentLogLevel = () => LOG_LEVELS[LOG_LEVEL] || LOG_LEVELS.info;

const formatLog = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();

  // Always use colored, human-readable format (easier to read in pm2 logs)
  const color = COLORS[level] || COLORS.reset;
  const dataStr = Object.keys(data).length > 0 ? ` ${JSON.stringify(data)}` : '';
  return `${COLORS.reset}${timestamp} ${color}[${level.toUpperCase()}]${COLORS.reset} ${message}${dataStr}`;
};

const writeLog = (level, message, data = {}) => {
  if (LOG_LEVELS[level] > getCurrentLogLevel()) {
    return;
  }

  const logMessage = formatLog(level, message, data);

  // Always write to stdout/stderr — let pm2 handle log files & rotation
  if (level === 'error') {
    console.error(logMessage);
  } else if (level === 'warn') {
    console.warn(logMessage);
  } else {
    console.log(logMessage);
  }
};

const logger = {
  error: (message, data) => writeLog('error', message, data),
  warn: (message, data) => writeLog('warn', message, data),
  info: (message, data) => writeLog('info', message, data),
  debug: (message, data) => writeLog('debug', message, data),
};

module.exports = logger;
