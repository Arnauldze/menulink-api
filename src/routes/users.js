const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: Staff management (Waiters, Kitchen, Cashiers)
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new staff member (MANAGER only)
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [WAITER, KITCHEN, CASHIER]
 *     responses:
 *       201:
 *         description: Staff created successfully
 *   get:
 *     summary: List all staff members for the restaurant
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of staff
 */
router.post('/', authMiddleware, UserController.createEmployee.bind(UserController));
router.get('/', authMiddleware, UserController.getEmployees.bind(UserController));

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a staff member (MANAGER only)
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Staff deleted successfully
 */
router.delete('/:id', authMiddleware, UserController.deleteEmployee.bind(UserController));

module.exports = router;
