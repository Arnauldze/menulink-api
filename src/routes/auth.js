const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: SaaS Registration and Login
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new Restaurant (SaaS Tenant) and Manager
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurant_name
 *               - manager_name
 *               - manager_email
 *               - password
 *             properties:
 *               restaurant_name:
 *                 type: string
 *               restaurant_email:
 *                 type: string
 *               restaurant_phone:
 *                 type: string
 *               restaurant_address:
 *                 type: string
 *               concept_type:
 *                 type: string
 *                 example: "restau"
 *               opening_time:
 *                 type: string
 *                 example: "08:00"
 *               closing_time:
 *                 type: string
 *                 example: "22:00"
 *               is_24h:
 *                 type: boolean
 *                 example: false
 *               enabled_roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["WAITER", "KITCHEN", "CASHIER", "MANAGER"]
 *               manager_name:
 *                 type: string
 *               manager_email:
 *                 type: string
 *               manager_phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully registered restaurant and manager
 */
router.post('/register', AuthController.register.bind(AuthController));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user and get JWT
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful with token returned
 */
router.post('/login', AuthController.login.bind(AuthController));

module.exports = router;
