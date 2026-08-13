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

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update an employee's info (MANAGER only)
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
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
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [WAITER, KITCHEN, CASHIER, ASSISTANT_MANAGER]
 *     responses:
 *       200:
 *         description: Employee updated successfully
 */
router.put('/:id', authMiddleware, UserController.updateEmployee.bind(UserController));

/**
 * @swagger
 * /users/{id}/reset-password:
 *   put:
 *     summary: Reset an employee's password (MANAGER only, auto-generated)
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
 *         description: Password reset successfully, new password returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     new_password:
 *                       type: string
 *                       description: The auto-generated password to show to the manager
 */
router.put('/:id/reset-password', authMiddleware, UserController.resetPassword.bind(UserController));

module.exports = router;
