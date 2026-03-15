const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management (Client and Kitchen)
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session_id
 *               - items
 *             properties:
 *               session_id:
 *                 type: string
 *               note:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - dish_id
 *                     - quantity
 *                   properties:
 *                     dish_id:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     comment:
 *                       type: string
 *     responses:
 *       201:
 *         description: Order placed successfully
 *   get:
 *     summary: List orders for a specific session
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: session_id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: List of orders
 */
const authMiddleware = require('../middleware/auth');

// Public route: placed by anonymous client via QRCode Session
router.post('/', OrderController.createOrder.bind(OrderController));
// Public route: client view
router.get('/', OrderController.listOrders.bind(OrderController));

// Protected route: Kitchen getting all active orders
router.get('/kitchen', authMiddleware, OrderController.getRestaurantOrders.bind(OrderController));

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get('/:id', OrderController.getOrder.bind(OrderController));

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update order status (Kitchen/Admin)
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, PREPARING, READY, SERVED, PAID, CANCELLED]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', authMiddleware, OrderController.updateStatus.bind(OrderController));

module.exports = router;
