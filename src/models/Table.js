const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    table_number: {
      type: Number,
      required: true,
    },
    qr_code: {
      type: String,
      required: true,
      unique: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: false,
  }
);

// Index for faster queries
tableSchema.index({ restaurant_id: 1, table_number: 1 }, { unique: true });
tableSchema.index({ qr_code: 1 });

module.exports = mongoose.model('Table', tableSchema);
