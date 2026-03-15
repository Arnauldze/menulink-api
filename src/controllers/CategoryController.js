const CategoryService = require('../services/CategoryService');
const logger = require('../utils/logger');

class CategoryController {

    /**
     * Create new category
     * POST /api/categories
     */
    async createCategory(req, res, next) {
        try {
            const { menu_id, name, display_order } = req.body;

            if (!menu_id || !name) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'An error occurred' }
                });
            }

            const category = await CategoryService.createCategory(req.user.restaurant_id, menu_id, name, display_order);

            res.status(201).json({
                success: true,
                data: category,
                message: 'Category created'
            });
        } catch (error) {
            logger.error('Error creating category', { error: { message: 'An error occurred' } });
            next(error);
        }
    }

    /**
     * List categories
     * GET /api/categories?menu_id=...
     */
    async listCategories(req, res, next) {
        try {
            const { menu_id } = req.query;
            const restaurantId = req.user?.restaurant_id || req.query.restaurant_id;

            if (!restaurantId) {
                return res.status(400).json({ success: false, error: { message: 'restaurant_id missing' } });
            }

            const categories = await CategoryService.listCategories(restaurantId, menu_id);

            res.status(200).json({
                success: true,
                count: categories.length,
                data: categories
            });
        } catch (error) {
            logger.error('Error listing categories', { error: { message: 'An error occurred' } });
            next(error);
        }
    }

    /**
     * Get category
     * GET /api/categories/:id
     */
    async getCategory(req, res, next) {
        try {
            const { id } = req.params;
            const restaurantId = req.user?.restaurant_id || req.query.restaurant_id;

            if (!restaurantId) {
                return res.status(400).json({ success: false, error: { message: 'restaurant_id missing' } });
            }

            const category = await CategoryService.getCategoryById(restaurantId, id);

            res.status(200).json({
                success: true,
                data: category
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({ success: false, error: { message: 'An error occurred' } });
            }
            next(error);
        }
    }

    /**
     * Update category
     * PUT /api/categories/:id
     */
    async updateCategory(req, res, next) {
        try {
            const { id } = req.params;
            const category = await CategoryService.updateCategory(req.user.restaurant_id, id, req.body);

            res.status(200).json({
                success: true,
                data: category,
                message: 'Category updated'
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({ success: false, error: { message: 'An error occurred' } });
            }
            next(error);
        }
    }

    /**
     * Delete category
     * DELETE /api/categories/:id
     */
    async deleteCategory(req, res, next) {
        try {
            const { id } = req.params;
            await CategoryService.deleteCategory(req.user.restaurant_id, id);

            res.status(200).json({
                success: true,
                message: 'Category deleted'
            });
        } catch (error) {
            logger.error('Error deleting category', { error: { message: 'An error occurred' } });
            if (error.message.includes('Cannot delete')) {
                return res.status(400).json({ success: false, error: { message: 'An error occurred' } });
            }
            next(error);
        }
    }
}

module.exports = new CategoryController();
