const Menu = require('../models/Menu');
const Category = require('../models/Category');
const Dish = require('../models/Dish');
const logger = require('../utils/logger');

class MenuService {
  /**
   * Get complete menu with all categories and dishes
   * Returns empty arrays if no data exists
   */
  async getCompleteMenu(restaurantId) {
    try {
      // Get all active menus for this restaurant
      const menus = await Menu.find({ is_active: true, restaurant_id: restaurantId });

      if (menus.length === 0) {
        logger.info('No active menus found, returning empty menu');
        return {
          categories: [],
          totalDishes: 0,
        };
      }

      // Get all categories for active menus
      const menuIds = menus.map(m => m._id);
      const categories = await Category.find({ menu_id: { $in: menuIds }, restaurant_id: restaurantId })
        .sort({ display_order: 1 })
        .populate('menu_id');

      if (categories.length === 0) {
        logger.info('No categories found, returning empty menu');
        return {
          categories: [],
          totalDishes: 0,
        };
      }

      // Get all dishes for these categories
      const categoryIds = categories.map(c => c._id);
      const dishes = await Dish.find({ category_id: { $in: categoryIds }, restaurant_id: restaurantId, is_available: true })
        .populate('category_id');

      if (dishes.length === 0) {
        logger.info('No dishes found, returning menu with empty categories');
        return {
          categories: categories.map(cat => ({
            _id: cat._id,
            name: cat.name,
            display_order: cat.display_order,
            dishes: [],
          })),
          totalDishes: 0,
        };
      }

      // Group dishes by category
      const menuData = categories.map(category => ({
        _id: category._id,
        name: category.name,
        display_order: category.display_order,
        dishes: dishes
          .filter(dish => dish.category_id._id.toString() === category._id.toString())
          .map(dish => ({
            _id: dish._id,
            name: dish.name,
            description: dish.description,
            price: dish.price,
            is_available: dish.is_available,
            image_url: dish.image_url,
          })),
      }));

      logger.info('Complete menu retrieved', {
        categoriesCount: categories.length,
        dishesCount: dishes.length,
      });

      return {
        _id: menus[0]._id,
        name: menus[0].name,
        categories: menuData,
        totalDishes: dishes.length,
      };
    } catch (error) {
      logger.error('Error getting complete menu', { error: error.message });
      throw error;
    }
  }

  /**
   * Get menu by ID
   */
  async getMenuById(restaurantId, menuId) {
    try {
      const menu = await Menu.findOne({ _id: menuId, restaurant_id: restaurantId }).populate('manager_id');
      if (!menu) {
        throw new Error('Menu not found');
      }
      return menu;
    } catch (error) {
      logger.error('Error getting menu by ID', { error: error.message });
      throw error;
    }
  }

  /**
   * Create new menu
   */
  async createMenu(restaurantId, name, gestionnaireId) {
    try {
      const menu = new Menu({
        restaurant_id: restaurantId,
        name,
        manager_id: gestionnaireId,
        is_active: true,
      });

      await menu.save();
      logger.info('Menu created', { menuId: menu._id, name });
      return menu;
    } catch (error) {
      logger.error('Error creating menu', { error: error.message });
      throw error;
    }
  }

  /**
   * Update menu
   */
  async updateMenu(restaurantId, menuId, updateData) {
    try {
      const menu = await Menu.findOneAndUpdate({ _id: menuId, restaurant_id: restaurantId }, updateData, { new: true });
      if (!menu) {
        throw new Error('Menu not found');
      }
      logger.info('Menu updated', { menuId });
      return menu;
    } catch (error) {
      logger.error('Error updating menu', { error: error.message });
      throw error;
    }
  }

  /**
   * Delete menu
   */
  async deleteMenu(restaurantId, menuId) {
    try {
      const menu = await Menu.findOneAndDelete({ _id: menuId, restaurant_id: restaurantId });
      if (!menu) {
        throw new Error('Menu not found');
      }
      logger.info('Menu deleted', { menuId });
      return menu;
    } catch (error) {
      logger.error('Error deleting menu', { error: error.message });
      throw error;
    }
  }
}

module.exports = new MenuService();
