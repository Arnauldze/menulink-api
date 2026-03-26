const DishService = require('../services/DishService');
const ImageUploadService = require('../services/ImageUploadService');
const logger = require('../utils/logger');

class DishController {

    /**
     * Create a new dish
     * POST /api/dishes
     */
    async createDish(req, res, next) {
        try {
            // 1. Basic validation
            let parsedData = {};
            try {
                // If it's a multipart/form-data request, req.body fields might be strings that need parsing
                if (req.body.extras && typeof req.body.extras === 'string') {
                    req.body.extras = JSON.parse(req.body.extras);
                }
                parsedData = req.body;
            } catch (e) {
                logger.warn('Could not parse extras as JSON string', { error: e.message });
                parsedData = req.body;
            }

            if (!parsedData.name || !parsedData.price || !parsedData.category_id) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'Missing required fields (name, price, category_id)' }
                });
            }

            // 2. Handle Image Upload if present
            if (req.file) {
                try {
                    const imageUrl = await ImageUploadService.uploadImage(req.file.buffer);
                    parsedData.image_url = imageUrl;
                } catch (imgError) {
                    logger.error('Failed to upload image during dish creation', { error: imgError.message });
                    // We can choose to fail the request or proceed without the image
                }
            }

            // 3. Create the dish
            const dish = await DishService.createDish(req.user.restaurant_id, parsedData);

            res.status(201).json({
                success: true,
                message: 'Dish created successfully',
                data: dish
            });
        } catch (error) {
            logger.error('Error creating dish', { error: { message: 'An error occurred' } });
            next(error);
        }
    }

    async getDishes(req, res, next) {
        try {
            const { category_id, restaurant_id: queryRestaurantId, page = 1, limit = 10 } = req.query;
            const restaurantId = req.user?.restaurant_id || queryRestaurantId;

            if (!restaurantId) {
                return res.status(400).json({ success: false, error: { message: 'restaurant_id missing' } });
            }

            const result = await DishService.getDishes(restaurantId, category_id, page, limit);

            res.status(200).json({
                success: true,
                count: result.dishes.length,
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
                data: result.dishes
            });
        } catch (error) {
            logger.error('Error getting dishes', { error: { message: 'An error occurred' } });
            next(error);
        }
    }

    /**
     * Get all dishes (Unpaginated)
     * GET /api/dishes/all
     */
    async getAllDishes(req, res, next) {
        try {
            const { category_id, restaurant_id: queryRestaurantId, grouped } = req.query;
            const restaurantId = req.user?.restaurant_id || queryRestaurantId;

            if (!restaurantId) {
                return res.status(400).json({ success: false, error: { message: 'restaurant_id missing' } });
            }

            const isGrouped = grouped === 'true';
            const dishes = await DishService.getAllDishes(restaurantId, category_id, isGrouped);

            res.status(200).json({
                success: true,
                count: dishes.length,
                data: dishes
            });
        } catch (error) {
            logger.error('Error getting all dishes', { error: { message: 'An error occurred' } });
            next(error);
        }
    }

    /**
     * Get single dish
     * GET /api/dishes/:id
     */
    async getDish(req, res, next) {
        try {
            const { id } = req.params;
            const restaurantId = req.user?.restaurant_id || req.query.restaurant_id;

            if (!restaurantId) {
                return res.status(400).json({ success: false, error: { message: 'restaurant_id missing' } });
            }

            const dish = await DishService.getDishById(restaurantId, id);

            res.status(200).json({
                success: true,
                data: dish
            });
        } catch (error) {
            logger.error('Error getting dish', { error: { message: 'An error occurred' } });
            if (error.message.includes('not found')) {
                return res.status(404).json({ success: false, error: { message: 'An error occurred' } });
            }
            next(error);
        }
    }

    /**
     * Update dish
     * PUT /api/dishes/:id
     */
    async updateDish(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const dish = await DishService.updateDish(req.user.restaurant_id, id, updateData);

            res.status(200).json({
                success: true,
                message: 'Dish updated successfully',
                data: dish
            });
        } catch (error) {
            logger.error('Error updating dish', { error: { message: 'An error occurred' } });
            if (error.message.includes('not found')) {
                return res.status(404).json({ success: false, error: { message: 'An error occurred' } });
            }
            next(error);
        }
    }

    /**
     * Toggle availability
     * PATCH /api/dishes/:id/availability
     */
    async toggleAvailability(req, res, next) {
        try {
            const { id } = req.params;
            const dish = await DishService.toggleAvailability(req.user.restaurant_id, id);

            res.status(200).json({
                success: true,
                message: `Dish is now ${dish.is_available ? 'available' : 'unavailable'}`,
                data: {
                    _id: dish._id,
                    name: dish.name,
                    is_available: dish.is_available
                }
            });
        } catch (error) {
            logger.error('Error toggling availability', { error: { message: 'An error occurred' } });
            next(error);
        }
    }

    /**
     * Delete dish
     * DELETE /api/dishes/:id
     */
    async deleteDish(req, res, next) {
        try {
            const { id } = req.params;
            await DishService.deleteDish(req.user.restaurant_id, id);

            res.status(200).json({
                success: true,
                message: 'Dish deleted successfully'
            });
        } catch (error) {
            logger.error('Error deleting dish', { error: { message: 'An error occurred' } });
            next(error);
        }
    }

    /**
     * Upload dish image
     * POST /api/dishes/:id/image
     */
    async uploadImage(req, res, next) {
        try {
            const { id } = req.params;

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'An error occurred' }
                });
            }

            // Upload to Cloudinary
            const imageUrl = await ImageUploadService.uploadImage(req.file.buffer);

            // Update dish with image URL
            const dish = await DishService.updateDish(req.user.restaurant_id, id, { image_url: imageUrl });

            res.status(200).json({
                success: true,
                message: 'Image uploaded successfully',
                data: {
                    _id: dish._id,
                    name: dish.name,
                    image_url: dish.image_url
                }
            });
        } catch (error) {
            logger.error('Error uploading image', { error: { message: 'An error occurred' } });
            if (error.message.includes('not found')) {
                return res.status(404).json({ success: false, error: { message: 'An error occurred' } });
            }
            next(error);
        }
    }
}

module.exports = new DishController();
