const mongoose = require('mongoose');
require('./Menu');

const categorySchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    menu_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    display_order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
categorySchema.index({ restaurant_id: 1 });
categorySchema.index({ menu_id: 1 });
categorySchema.index({ display_order: 1 });

module.exports = mongoose.model('Category', categorySchema);
