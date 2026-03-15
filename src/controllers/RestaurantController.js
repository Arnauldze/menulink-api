const RestaurantService = require('../services/RestaurantService');
const logger = require('../utils/logger');

class RestaurantController {
    /**
     * Get restaurant settings
     * GET /api/restaurant
     */
    async getSettings(req, res, next) {
        try {
            const restaurantId = req.user.restaurant_id;
            const settings = await RestaurantService.getSettings(restaurantId);
            res.status(200).json({
                success: true,
                data: settings
            });
        } catch (error) {
            logger.error('Error in getSettings', { error: { message: error.message || 'An error occurred' } });
            next(error);
        }
    }

    /**
     * Update restaurant settings
     * PUT /api/restaurant
     */
    async updateSettings(req, res, next) {
        try {
            const restaurantId = req.user.restaurant_id;
            const updateData = req.body;
            const settings = await RestaurantService.updateSettings(restaurantId, updateData);
            res.status(200).json({
                success: true,
                message: 'Settings updated successfully',
                data: settings
            });
        } catch (error) {
            logger.error('Error in updateSettings', { error: { message: error.message || 'An error occurred' } });
            next(error);
        }
    }
}

module.exports = new RestaurantController();
