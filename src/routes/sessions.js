const express = require('express');
const router = express.Router();
const SessionController = require('../controllers/SessionController');

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Session management (QR Code scan)
 */

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Create a new session from QR code scan
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - qr_code
 *             properties:
 *               qr_code:
 *                 type: string
 *                 description: The QR code string scanned from the table
 *                 example: table_1_1771346045036
 *     responses:
 *       201:
 *         description: Session created successfully, returns session info AND complete menu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     session:
 *                       $ref: '#/components/schemas/Session'
 *                     menu:
 *                       $ref: '#/components/schemas/Menu'
 *       400:
 *         description: Missing QR code
 *       500:
 *         description: Invalid QR code or server error
 */
router.post('/', SessionController.createSessionFromQRCode.bind(SessionController));

/**
 * @swagger
 * /sessions/{session_id}:
 *   get:
 *     summary: Validate a session
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: session_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The session ID
 *     responses:
 *       200:
 *         description: Session is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Session'
 *       401:
 *         description: Invalid or expired session
 *   delete:
 *     summary: End a session
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: session_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The session ID
 *     responses:
 *       200:
 *         description: Session ended successfully
 */
router.get('/:session_id', SessionController.validateSession.bind(SessionController));
router.delete('/:session_id', SessionController.endSession.bind(SessionController));

module.exports = router;
