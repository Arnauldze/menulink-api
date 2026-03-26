const Dish = require('../models/Dish');
const Category = require('../models/Category');
const logger = require('../utils/logger');

class DishService {
  /**
   * Create new dish
   */
  async createDish(restaurantId, dishData) {
    try {
      // Verify category exists
      const category = await Category.findById(dishData.category_id);
      if (!category) {
        throw new Error('Category not found');
      }

      const dish = new Dish({
        restaurant_id: restaurantId,
        name: dishData.name,
        description: dishData.description,
        price: dishData.price,
        category_id: dishData.category_id,
        is_available: dishData.is_available !== false,
        image_url: dishData.image_url,
        prep_time: dishData.prep_time,
        is_daily_special: dishData.is_daily_special || false,
        extras: dishData.extras || [],
      });

      await dish.save();
      logger.info('Dish created', { dishId: dish._id, name: dish.name });
      return dish;
    } catch (error) {
      logger.error('Error creating dish', { error: error.message });
      throw error;
    }
  }

  /**
   * Get dish by ID
   */
  async getDishById(restaurantId, dishId) {
    try {
      const dish = await Dish.findOne({ _id: dishId, restaurant_id: restaurantId }).populate('category_id');
      if (!dish) {
        throw new Error('Dish not found');
      }
      return dish;
    } catch (error) {
      logger.error('Error getting dish by ID', { error: error.message });
      throw error;
    }
  }

  /**
   * Get dishes with filtering and pagination
   */
  async getDishes(restaurantId, category_id, page = 1, limit = 10) {
    try {
      const query = { restaurant_id: restaurantId };
      if (category_id) {
        query.category_id = category_id;
        query.is_available = true; // usually when filtering by category (client side), we only want available dishes
      }

      const skip = (page - 1) * limit;

      const [dishes, total] = await Promise.all([
        Dish.find(query)
          .populate('category_id')
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        Dish.countDocuments(query)
      ]);

      return {
        dishes,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('Error getting dishes', { error: error.message });
      throw error;
    }
  }

  /**
   * Get all dishes without pagination
   */
  async getAllDishes(restaurantId, category_id, grouped = false) {
    try {
      const query = { restaurant_id: restaurantId };
      if (category_id) {
        query.category_id = category_id;
        query.is_available = true;
      }

      const dishes = await Dish.find(query)
        .populate('category_id')
        .sort({ createdAt: -1 });

      if (grouped) {
        const groupedByCategory = dishes.reduce((acc, dish) => {
          const catId = dish.category_id ? dish.category_id._id.toString() : 'unassigned';
          const catName = dish.category_id ? dish.category_id.name : 'Unassigned';
          const displayOrder = dish.category_id ? dish.category_id.display_order : 999;

          if (!acc[catId]) {
            acc[catId] = {
              category_id: catId,
              category_name: catName,
              display_order: displayOrder,
              dishes: []
            };
          }
          acc[catId].dishes.push(dish);
          return acc;
        }, {});

        // Return sorted categories
        return Object.values(groupedByCategory).sort((a, b) => a.display_order - b.display_order);
      }

      return dishes;
    } catch (error) {
      logger.error('Error getting all dishes', { error: error.message });
      throw error;
    }
  }

  /**
   * Update dish
   */
  async updateDish(restaurantId, dishId, updateData) {
    try {
      const dish = await Dish.findOneAndUpdate(
        { _id: dishId, restaurant_id: restaurantId },
        updateData,
        { new: true }
      );
      if (!dish) {
        throw new Error('Dish not found');
      }
      logger.info('Dish updated', { dishId });
      return dish;
    } catch (error) {
      logger.error('Error updating dish', { error: error.message });
      throw error;
    }
  }

  /**
   * Toggle dish availability
   */
  async toggleAvailability(restaurantId, dishId) {
    try {
      const dish = await Dish.findOne({ _id: dishId, restaurant_id: restaurantId });
      if (!dish) {
        throw new Error('Dish not found');
      }

      dish.is_available = !dish.is_available;
      await dish.save();

      logger.info('Dish availability toggled', { dishId, is_available: dish.is_available });
      return dish;
    } catch (error) {
      logger.error('Error toggling dish availability', { error: error.message });
      throw error;
    }
  }

  /**
   * Delete dish
   */
  async deleteDish(restaurantId, dishId) {
    try {
      const dish = await Dish.findOneAndDelete({ _id: dishId, restaurant_id: restaurantId });
      if (!dish) {
        throw new Error('Dish not found');
      }
      logger.info('Dish deleted', { dishId });
      return dish;
    } catch (error) {
      logger.error('Error deleting dish', { error: error.message });
      throw error;
    }
  }
}

module.exports = new DishService();
