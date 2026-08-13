const Table = require('../models/Table');
const QRCode = require('qrcode');
const logger = require('../utils/logger');

class TableService {
  /**
   * Create a new table with QR code
   */
  async createTable(restaurantId, table_number) {
    try {
      // Check if table already exists in THIS restaurant
      const existingTable = await Table.findOne({ restaurant_id: restaurantId, table_number });
      if (existingTable) {
        throw new Error(`Table ${table_number} already exists`);
      }

      // Generate QR code data (contains restaurant ID and table ID for scanning)
      const qrCodeData = `resto_${restaurantId}_table_${table_number}_${Date.now()}`;

      // Create table
      const table = new Table({
        restaurant_id: restaurantId,
        table_number,
        qr_code: qrCodeData,
        active: true,
      });

      await table.save();
      logger.info('Table created', { table_number, tableId: table._id });

      return table;
    } catch (error) {
      logger.error('Error creating table', { error: error.message, table_number });
      throw error;
    }
  }

  /**
   * Get table by QR code
   */
  async getTableByQRCode(qr_code) {
    try {
      const table = await Table.findOne({ qr_code, active: true });
      if (!table) {
        throw new Error('Invalid QR code or table is inactive');
      }
      return table;
    } catch (error) {
      logger.error('Error getting table by QR code', { error: error.message });
      throw error;
    }
  }

  /**
   * Get table by ID
   */
  async getTableById(restaurantId, tableId) {
    try {
      const table = await Table.findOne({ _id: tableId, restaurant_id: restaurantId });
      if (!table) {
        throw new Error('Table not found');
      }
      return table;
    } catch (error) {
      logger.error('Error getting table by ID', { error: error.message, tableId });
      throw error;
    }
  }

  /**
   * Get all tables
   */
  async getAllTables(restaurantId) {
    try {
      const tables = await Table.find({ restaurant_id: restaurantId }).sort({ table_number: 1 });
      return tables;
    } catch (error) {
      logger.error('Error getting all tables', { error: error.message });
      throw error;
    }
  }

  /**
   * Update table
   */
  async updateTable(restaurantId, tableId, updateData) {
    try {
      const table = await Table.findOneAndUpdate({ _id: tableId, restaurant_id: restaurantId }, updateData, { new: true });
      if (!table) {
        throw new Error('Table not found');
      }
      logger.info('Table updated', { tableId });
      return table;
    } catch (error) {
      logger.error('Error updating table', { error: error.message, tableId });
      throw error;
    }
  }

  /**
   * Delete table
   */
  async deleteTable(restaurantId, tableId) {
    try {
      const table = await Table.findOneAndDelete({ _id: tableId, restaurant_id: restaurantId });
      if (!table) {
        throw new Error('Table not found');
      }
      logger.info('Table deleted', { tableId });
      return table;
    } catch (error) {
      logger.error('Error deleting table', { error: error.message, tableId });
      throw error;
    }
  }

  /**
   * Generate QR code image
   */
  async generateQRCodeImage(qrCodeData) {
    try {
      const qrImage = await QRCode.toDataURL(qrCodeData);
      return qrImage;
    } catch (error) {
      logger.error('Error generating QR code image', { error: error.message });
      throw error;
    }
  }
}

module.exports = new TableService();
