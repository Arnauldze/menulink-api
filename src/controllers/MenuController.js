const MenuService = require('../services/MenuService');
const logger = require('../utils/logger');

class MenuController {
  /**
   * Get complete menu with all categories and dishes
   * GET /api/menu
   */
  async getCompleteMenu(req, res, next) {
    try {
      const restaurantId = req.user?.restaurant_id || req.query.restaurant_id;
      if (!restaurantId) {
        return res.status(400).json({ success: false, error: { message: 'restaurant_id missing' } });
      }
      const menu = await MenuService.getCompleteMenu(restaurantId);

      res.status(200).json({
        success: true,
        restaurant_id: restaurantId,
        data: menu,
        message: 'Menu retrieved successfully',
      });
    } catch (error) {
      logger.error('Error in getCompleteMenu', { error: { message: 'An error occurred' } });
      next(error);
    }
  }

  /**
   * Get menu by ID
   * GET /api/menus/:id
   */
  async getMenuById(req, res, next) {
    try {
      const { id } = req.params;
      const restaurantId = req.user?.restaurant_id || req.query.restaurant_id;
      if (!restaurantId) {
        return res.status(400).json({ success: false, error: { message: 'restaurant_id missing' } });
      }
      const menu = await MenuService.getMenuById(restaurantId, id);

      res.status(200).json({
        success: true,
        restaurant_id: restaurantId,
        data: menu,
      });
    } catch (error) {
      logger.error('Error in getMenuById', { error: { message: 'An error occurred' } });
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: { message: error.message || 'An error occurred' },
        });
      }
      next(error);
    }
  }

  /**
   * Create new menu
   * POST /api/menus
   */
  async createMenu(req, res, next) {
    try {
      const { name, manager_id } = req.body;

      if (!name || !manager_id) {
        return res.status(400).json({
          success: false,
          error: { message: error.message || 'An error occurred' },
        });
      }

      const menu = await MenuService.createMenu(req.user.restaurant_id, name, manager_id);

      res.status(201).json({
        success: true,
        restaurant_id: req.user.restaurant_id,
        data: menu,
        message: 'Menu created successfully',
      });
    } catch (error) {
      logger.error('Error in createMenu', { error: { message: 'An error occurred' } });
      next(error);
    }
  }

  /**
   * Update menu
   * PUT /api/menus/:id
   */
  async updateMenu(req, res, next) {
    try {
      const { id } = req.params;
      const menu = await MenuService.updateMenu(req.user.restaurant_id, id, req.body);

      res.status(200).json({
        success: true,
        restaurant_id: req.user.restaurant_id,
        data: menu,
        message: 'Menu updated successfully',
      });
    } catch (error) {
      logger.error('Error in updateMenu', { error: { message: 'An error occurred' } });
      next(error);
    }
  }

  /**
   * Delete menu
   * DELETE /api/menus/:id
   */
  async deleteMenu(req, res, next) {
    try {
      const { id } = req.params;
      await MenuService.deleteMenu(req.user.restaurant_id, id);

      res.status(200).json({
        success: true,
        message: 'Menu deleted successfully',
      });
    } catch (error) {
      logger.error('Error in deleteMenu', { error: { message: 'An error occurred' } });
      next(error);
    }
  }
}

module.exports = new MenuController();
