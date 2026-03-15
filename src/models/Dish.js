const mongoose = require('mongoose');
require('./Category');

const dishSchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    is_available: {
      type: Boolean,
      default: true,
    },
    image_url: {
      type: String,
    },
    prep_time: {
      type: Number, // Temps de préparation estimé en minutes
      min: 0,
    },
    is_daily_special: {
      type: Boolean, // Plat du jour ou mis en avant
      default: false,
    },
    extras: [{
      name: { type: String, required: true },
      price: { type: Number, required: true, min: 0 }
    }],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
dishSchema.index({ restaurant_id: 1 });
dishSchema.index({ category_id: 1 });
dishSchema.index({ is_available: 1 });
dishSchema.index({ name: 1 });

module.exports = mongoose.model('Dish', dishSchema);
