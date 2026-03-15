const Restaurant = require('../models/Restaurant');
const logger = require('../utils/logger');

class RestaurantService {
    /**
     * Get the restaurant configuration options.
     * Uses singleton pattern (creates default if it doesn't exist)
     */
    async getSettings() {
        try {
            let restaurant = await Restaurant.findOne();
            if (!restaurant) {
                restaurant = new Restaurant();
                await restaurant.save();
                logger.info('Default restaurant settings initialized');
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
    async updateSettings(updateData) {
        try {
            let restaurant = await Restaurant.findOne();
            if (!restaurant) {
                restaurant = new Restaurant(updateData);
                await restaurant.save();
            } else {
                if (updateData.name !== undefined) restaurant.name = updateData.name;
                if (updateData.welcome_banner !== undefined) restaurant.welcome_banner = updateData.welcome_banner;
                await restaurant.save();
            }

            logger.info('Restaurant settings updated');
            return restaurant;
        } catch (error) {
            logger.error('Error updating restaurant settings', { error: error.message });
            throw error;
        }
    }
}

module.exports = new RestaurantService();
