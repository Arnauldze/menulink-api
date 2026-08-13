const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const clientSessionSchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    session_id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    table_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: true,
    },
    started_at: {
      type: Date,
      default: Date.now,
      index: { expireAfterSeconds: 86400 }, // Auto-delete after 24 hours
    },
  },
  {
    timestamps: false,
  }
);

// Index for faster queries
clientSessionSchema.index({ restaurant_id: 1 });
clientSessionSchema.index({ session_id: 1 });
clientSessionSchema.index({ table_id: 1 });

module.exports = mongoose.model('ClientSession', clientSessionSchema);
