const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    dish_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    comment: {
        type: String,
        trim: true
    },
    selected_extras: [{
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 }
    }]
}, { _id: false });

const orderSchema = new mongoose.Schema(
    {
        restaurant_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
        },
        table_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Table',
            required: true,
        },
        session_id: {
            type: String, // We store the session UUID string
            required: true,
        },
        items: [orderItemSchema],
        total_price: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['PENDING', 'PREPARING', 'READY', 'SERVED', 'PAID', 'CANCELLED'],
            default: 'PENDING',
        },
        payment_method: {
            type: String,
            enum: ['CASH', 'CARD', 'MOBILE_MONEY', 'NONE'],
            default: 'NONE',
        },
        note: {
            type: String,
            trim: true,
        }
    },
    {
        timestamps: true,
    }
);

// Indexes
orderSchema.index({ restaurant_id: 1 });
orderSchema.index({ table_id: 1 });
orderSchema.index({ session_id: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
