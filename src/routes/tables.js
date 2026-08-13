const express = require('express');
const router = express.Router();
const TableController = require('../controllers/TableController');

/**
 * @swagger
 * tags:
 *   name: Tables
 *   description: Table management and QR Codes (Admin)
 */

/**
 * @swagger
 * /tables:
 *   get:
 *     summary: List all tables
 *     tags: [Tables]
 *     responses:
 *       200:
 *         description: List of tables
 *   post:
 *     summary: Create a new table
 *     tags: [Tables]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tableNumber
 *             properties:
 *               tableNumber:
 *                 type: integer
 *                 description: The table number (must be unique)
 *     responses:
 *       201:
 *         description: Table created
 */
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, TableController.listTables.bind(TableController));
router.post('/', authMiddleware, TableController.createTable.bind(TableController));

/**
 * @swagger
 * /tables/{id}/qr:
 *   get:
 *     summary: Get QR Code for a table (Text and Base64 Image)
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: QR Code data
 */
router.get('/:id/qr', authMiddleware, TableController.getTableQRCode.bind(TableController));

/**
 * @swagger
 * /tables/{id}:
 *   delete:
 *     summary: Delete a table
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Table deleted
 */
router.delete('/:id', authMiddleware, TableController.deleteTable.bind(TableController));

module.exports = router;
