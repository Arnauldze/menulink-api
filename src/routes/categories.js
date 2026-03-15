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

// ...

router.get('/', CategoryController.listCategories.bind(CategoryController)); // Public
router.post('/', authMiddleware, CategoryController.createCategory.bind(CategoryController));

// ...

router.get('/:id', CategoryController.getCategory.bind(CategoryController)); // Public
router.put('/:id', authMiddleware, CategoryController.updateCategory.bind(CategoryController));
router.delete('/:id', authMiddleware, CategoryController.deleteCategory.bind(CategoryController));

module.exports = router;
