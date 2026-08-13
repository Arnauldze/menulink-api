const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management (Admin)
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: List all categories (optionally filter by menu_id)
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: menu_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of categories
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menu_id
 *               - name
 *             properties:
 *               menu_id:
 *                 type: string
 *               name:
 *                 type: string
 *               display_order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Category created
 */
const authMiddleware = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: List all categories (optionally filter by menu_id or name)
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: menu_id
 *         schema:
 *           type: string
 *         description: Filter by menu ID (Optional)
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by category name (e.g., "Boissons" for mobile) - Case insensitive (Optional)
 *       - in: query
 *         name: restaurant_id
 *         schema:
 *           type: string
 *         description: Mandatory if no Auth token provided (Optional if token present)
 *     responses:
 *       200:
 *         description: List of categories with restaurant_id
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menu_id
 *               - name
 *             properties:
 *               menu_id:
 *                 type: string
 *               name:
 *                 type: string
 *               display_order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Category created with restaurant_id
 */
router.get('/', optionalAuth, CategoryController.listCategories.bind(CategoryController));
router.post('/', authMiddleware, CategoryController.createCategory.bind(CategoryController));

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a specific category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: restaurant_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 */
router.get('/:id', optionalAuth, CategoryController.getCategory.bind(CategoryController));
router.put('/:id', authMiddleware, CategoryController.updateCategory.bind(CategoryController));
router.delete('/:id', authMiddleware, CategoryController.deleteCategory.bind(CategoryController));

module.exports = router;
