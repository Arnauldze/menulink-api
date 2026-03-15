const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { formatDate } = require('../utils/dateFormatter');

// Global plugin to format dates consistently across the app (dd/mm/yyyy HH:mm)
mongoose.plugin((schema) => {
  schema.set('toJSON', {
    transform: (doc, ret) => {

      for (const key in ret) {
        if (ret[key] instanceof Date) {
          ret[key] = formatDate(ret[key]);
        }
      }

      // Also ensure that the _id is properly preserved (if default toJSON is overshadowed)
      if (ret._id && !ret.id) {
        // usually Mongoose exposes id instead of _id if virtuals: true
      }
      return ret;
    }
  });
});

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-management';

    await mongoose.connect(mongoUri);

    logger.info('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    logger.error('MongoDB connection error', { error: error.message });
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error('MongoDB disconnection error', { error: error.message });
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
