const cors = require('cors');

// Support multiple origins via comma-separated list in .env
// Examples:
//   CORS_ORIGIN=*                          → allow all origins
//   CORS_ORIGIN=https://monresto.com       → single origin
//   CORS_ORIGIN=https://monresto.com,https://admin.monresto.com → multiple origins
const getAllowedOrigins = () => {
  const envOrigin = process.env.CORS_ORIGIN;

  // No value or wildcard → allow all
  if (!envOrigin || envOrigin === '*') {
    return true;
  }

  // Multiple origins (comma-separated)
  const origins = envOrigin.split(',').map((o) => o.trim());
  return origins.length === 1 ? origins[0] : origins;
};

const corsOptions = {
  origin: getAllowedOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);
