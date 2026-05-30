const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const sessionSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: true,
    },
    role: {
      type: String,
      enum: ['client', 'personnel', 'gestionnaire'],
      default: 'client',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      index: { expireAfterSeconds: 0 }, // Auto-delete expired sessions
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
sessionSchema.index({ token: 1 });
sessionSchema.index({ tableId: 1 });
sessionSchema.index({ restaurant_id: 1 });
sessionSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('Session', sessionSchema);
