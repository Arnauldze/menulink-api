const Restaurant = require('../models/Restaurant');
const logger = require('../utils/logger');

class RestaurantService {
    /**
     * Get the restaurant configuration options.
     * Uses singleton pattern (creates default if it doesn't exist)
     */
    async getSettings(restaurantId) {
        try {
            const restaurant = await Restaurant.findById(restaurantId);
            if (!restaurant) {
                throw new Error('Restaurant not found');
            }
            return restaurant;
        } catch (error) {
            logger.error('Error getting restaurant settings', { error: error.message });
            throw error;
        }
    }

    /**
     * Update restaurant settings
     */
    async updateSettings(restaurantId, updateData) {
        try {
            const restaurant = await Restaurant.findByIdAndUpdate(
                restaurantId,
                { $set: updateData },
                { new: true, runValidators: true }
            );

            if (!restaurant) {
                throw new Error('Restaurant not found');
            }

            logger.info('Restaurant settings updated', { restaurantId });
            return restaurant;
        } catch (error) {
            logger.error('Error updating restaurant settings', { error: error.message });
            throw error;
        }
    }
}

module.exports = new RestaurantService();
