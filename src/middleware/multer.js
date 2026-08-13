const multer = require('multer');
const logger = require('../utils/logger');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter - accept only images
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    logger.warn('File upload rejected - not an image', { mimetype: file.mimetype });
    return cb(new Error('Only image files are allowed'), false);
  }
  cb(null, true);
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: fileFilter,
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'File size exceeds 5MB limit',
        },
      });
    }
    return res.status(400).json({
      success: false,
      error: {
        message: err.message,
      },
    });
  }

  // If it's another type of error, pass it to the global error handler
  if (err) {
    return next(err);
  }

  next();
};

module.exports = {
  upload,
  handleMulterError,
};
