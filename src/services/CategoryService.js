const Category = require('../models/Category');
const Dish = require('../models/Dish');
const logger = require('../utils/logger');

class CategoryService {

    /**
     * Create a new category
     */
    async createCategory(restaurantId, menuId, name, ordre = 0) {
        try {
            // Vérifier si la catégorie existe déjà (insensible à la casse)
            const existingCategory = await Category.findOne({
                restaurant_id: restaurantId,
                name: { $regex: new RegExp('^' + name + '$', 'i') }
            });

            if (existingCategory) {
                throw new Error("Une catégorie avec ce nom existe déjà pour votre restaurant.");
            }

            const category = new Category({
                restaurant_id: restaurantId,
                menu_id: menuId,
                name,
                display_order: ordre
            });
            await category.save();
            logger.info('Category created', { categoryId: category._id, name });
            return category;
        } catch (error) {
            logger.error('Error creating category', { error: error.message });
            throw error;
        }
    }

    /**
     * Get category by ID
     */
    async getCategoryById(restaurantId, categoryId) {
        try {
            const category = await Category.findOne({ _id: categoryId, restaurant_id: restaurantId });
            if (!category) {
                throw new Error('Category not found');
            }
            return category;
        } catch (error) {
            logger.error('Error getting category', { error: error.message });
            throw error;
        }
    }

    /**
     * Update category
     */
    async updateCategory(restaurantId, categoryId, updateData) {
        try {
            const category = await Category.findOneAndUpdate(
                { _id: categoryId, restaurant_id: restaurantId },
                updateData,
                { new: true }
            );
            if (!category) {
                throw new Error('Category not found');
            }
            logger.info('Category updated', { categoryId });
            return category;
        } catch (error) {
            logger.error('Error updating category', { error: error.message });
            throw error;
        }
    }

    /**
     * Delete category (and optionally dishes)
     */
    async deleteCategory(restaurantId, categoryId) {
        try {
            // Check if dishes exist
            const dishesCount = await Dish.countDocuments({ category_id: categoryId, restaurant_id: restaurantId });
            if (dishesCount > 0) {
                throw new Error(`Cannot delete category: contains ${dishesCount} dishes. Delete them first.`);
            }

            const category = await Category.findOneAndDelete({ _id: categoryId, restaurant_id: restaurantId });
            if (!category) {
                throw new Error('Category not found');
            }
            logger.info('Category deleted', { categoryId });
            return category;
        } catch (error) {
            logger.error('Error deleting category', { error: error.message });
            throw error;
        }
    }

    /**
     * List all categories (optionally for a specific menu or filter by name)
     */
    async listCategories(restaurantId, menuId, categoryName) {
        try {
            const query = { restaurant_id: restaurantId };
            if (menuId) {
                query.menu_id = menuId;
            }
            if (categoryName) {
                // Case-insensitive search for category name
                query.name = { $regex: new RegExp('^' + categoryName + '$', 'i') };
            }
            const categories = await Category.find(query).sort({ display_order: 1 });
            return categories;
        } catch (error) {
            logger.error('Error listing categories', { error: error.message });
            throw error;
        }
    }
}

module.exports = new CategoryService();
