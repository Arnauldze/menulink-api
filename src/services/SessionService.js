const ClientSession = require('../models/ClientSession');
const Table = require('../models/Table');
const logger = require('../utils/logger');

class SessionService {
  /**
   * Create a new session from QR code scan
   */
  async createSessionFromQRCode(qrCode) {
    try {
      // Find table by QR code
      const table = await Table.findOne({ qr_code: qrCode, active: true });
      if (!table) {
        throw new Error('Invalid QR code or table is inactive');
      }

      // Create client session
      const session = new ClientSession({
        table_id: table._id,
        restaurant_id: table.restaurant_id,
      });

      await session.save();
      logger.info('Client session created from QR code', {
        sessionId: session.session_id,
        tableId: table._id,
        tableNumber: table.table_number,
      });

      return session;
    } catch (error) {
      logger.error('Error creating session from QR code', { error: error.message });
      throw error;
    }
  }

  /**
   * Validate session token
   */
  async validateSession(sessionId) {
    try {
      const session = await ClientSession.findOne({
        session_id: sessionId,
      }).populate('table_id');

      if (!session) {
        throw new Error('Invalid or expired session');
      }

      // Check if session is not too old (24 hours)
      const sessionAge = Date.now() - session.started_at.getTime();
      if (sessionAge > 24 * 60 * 60 * 1000) {
        throw new Error('Session expired');
      }

      return session;
    } catch (error) {
      logger.error('Error validating session', { error: error.message });
      throw error;
    }
  }

  /**
   * Get session by ID
   */
  async getSession(sessionId) {
    try {
      const session = await ClientSession.findOne({ session_id: sessionId }).populate('table_id');
      if (!session) {
        throw new Error('Session not found');
      }
      return session;
    } catch (error) {
      logger.error('Error getting session', { error: error.message });
      throw error;
    }
  }

  /**
   * End session
   */
  async endSession(sessionId) {
    try {
      const session = await ClientSession.findOneAndDelete({ session_id: sessionId });

      if (!session) {
        throw new Error('Session not found');
      }

      logger.info('Session ended', { sessionId });
      return session;
    } catch (error) {
      logger.error('Error ending session', { error: error.message });
      throw error;
    }
  }

  /**
   * Get all active sessions
   */
  async getActiveSessions() {
    try {
      const sessions = await ClientSession.find().populate('table_id');
      return sessions;
    } catch (error) {
      logger.error('Error getting active sessions', { error: error.message });
      throw error;
    }
  }
}

module.exports = new SessionService();
