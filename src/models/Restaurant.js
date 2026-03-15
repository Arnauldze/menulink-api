const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String, // Addresse ou localisation
            trim: true,
        },
        concept_type: {
            type: String, // café, restau, fastfood, etc.
            trim: true,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        opening_time: {
            type: String, // Par exemple "08:00"
            trim: true,
            default: "08:00"
        },
        closing_time: {
            type: String, // Par exemple "22:00"
            trim: true,
            default: "22:00"
        },
        is_24h: {
            type: Boolean,
            default: false
        },
        enabled_roles: {
            type: [String],
            default: ['WAITER', 'KITCHEN', 'CASHIER', 'MANAGER', 'ASSISTANT_MANAGER']
        },
        welcome_banner: {
            type: String,
            trim: true,
            default: 'Welcome to our restaurant! Enjoy your meal.'
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
