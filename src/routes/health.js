const express = require('express');
const router = express.Router();
const { formatDate } = require('../utils/dateFormatter');

/**
 * Health check endpoint
 * GET /api/health
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: formatDate(new Date()),
  });
});

module.exports = router;
