const express = require('express');
const router = express.Router();
const RestaurantController = require('../controllers/RestaurantController');

/**
 * @swagger
 * tags:
 *   name: Restaurant
 *   description: Global Restaurant Settings
 */

/**
 * @swagger
 * /restaurant:
 *   get:
 *     summary: Get global restaurant settings (name, banner)
 *     tags: [Restaurant]
 *     responses:
 *       200:
 *         description: Restaurant settings retrieved successfully
 *   put:
 *     summary: Update global restaurant settings
 *     tags: [Restaurant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               welcome_banner:
 *                 type: string
 *     responses:
 *       200:
 *         description: Settings updated successfully
 */
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, RestaurantController.getSettings.bind(RestaurantController));
router.put('/', authMiddleware, RestaurantController.updateSettings.bind(RestaurantController));

module.exports = router;
