const mongoose = require('mongoose');
require('./User');

const menuSchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    manager_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
menuSchema.index({ restaurant_id: 1 });
menuSchema.index({ manager_id: 1 });
menuSchema.index({ is_active: 1 });

module.exports = mongoose.model('Menu', menuSchema);
