const SessionService = require('../services/SessionService');
const logger = require('../utils/logger');

const MenuService = require('../services/MenuService');
const { formatDate } = require('../utils/dateFormatter');
const Restaurant = require('../models/Restaurant');

class SessionController {
  /**
   * Create session from QR code scan
   * POST /api/sessions
   */
  async createSessionFromQRCode(req, res, next) {
    try {
      const { qr_code } = req.body;

      if (!qr_code) {
        return res.status(400).json({
          success: false,
          error: { message: error.message || 'An error occurred' },
        });
      }

      // 1. Create the session
      const session = await SessionService.createSessionFromQRCode(qr_code);

      // 2. Fetch the full menu for this specific restaurant
      const menu = await MenuService.getCompleteMenu(session.restaurant_id);

      // 3. Fetch public restaurant info for the banner/message
      const restaurant = await Restaurant.findById(session.restaurant_id)
        .select('name address concept_type welcome_banner opening_time closing_time is_24h phone email');

      res.status(201).json({
        success: true,
        data: {
          session: {
            session_id: session.session_id,
            table_id: session.table_id,
            restaurant_id: session.restaurant_id,
            started_at: formatDate(session.started_at),
          },
          restaurant: restaurant,
          menu: menu, // Include the full menu directly
        },
        message: 'Session created and menu retrieved successfully',
      });
    } catch (error) {
      logger.error('Error in createSessionFromQRCode', { error: { message: 'An error occurred' } });
      next(error);
    }
  }

  /**
   * Validate session
   * GET /api/sessions/:session_id
   */
  async validateSession(req, res, next) {
    try {
      const { session_id } = req.params;

      const session = await SessionService.validateSession(session_id);

      res.status(200).json({
        success: true,
        data: {
          session_id: session.session_id,
          table_id: session.table_id,
          table_number: session.table_id.table_number,
          started_at: formatDate(session.started_at),
        },
        message: 'Session is valid',
      });
    } catch (error) {
      logger.error('Error in validateSession', { error: { message: 'An error occurred' } });
      if (error.message.includes('Invalid') || error.message.includes('expired')) {
        return res.status(401).json({
          success: false,
          error: { message: error.message || 'An error occurred' },
        });
      }
      next(error);
    }
  }

  /**
   * End session
   * DELETE /api/sessions/:session_id
   */
  async endSession(req, res, next) {
    try {
      const { session_id } = req.params;

      await SessionService.endSession(session_id);

      res.status(200).json({
        success: true,
        message: 'Session ended successfully',
      });
    } catch (error) {
      logger.error('Error in endSession', { error: { message: 'An error occurred' } });
      next(error);
    }
  }
}

module.exports = new SessionController();
