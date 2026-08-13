const cloudinary = require('../config/cloudinary');
const logger = require('../utils/logger');

class ImageUploadService {
  /**
   * Upload image to Cloudinary
   * @param {Buffer} fileBuffer - Image file buffer
   * @param {string} folder - Cloudinary folder name
   * @returns {Promise<string>} - Cloudinary URL
   */
  async uploadImage(fileBuffer, folder = 'menu-link/dishes') {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: 'image',
            transformation: [
              { width: 800, height: 600, crop: 'limit' },
              { quality: 'auto' },
              { fetch_format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) {
              logger.error('Cloudinary upload error', { error: error.message });
              reject(error);
            } else {
              logger.info('Image uploaded to Cloudinary', { url: result.secure_url });
              resolve(result.secure_url);
            }
          }
        );

        uploadStream.end(fileBuffer);
      });
    } catch (error) {
      logger.error('Error uploading image', { error: error.message });
      throw error;
    }
  }

  /**
   * Delete image from Cloudinary
   * @param {string} imageUrl - Cloudinary image URL
   * @returns {Promise<void>}
   */
  async deleteImage(imageUrl) {
    try {
      // Extract public_id from URL
      const urlParts = imageUrl.split('/');
      const filename = urlParts[urlParts.length - 1];
      const publicId = `menu-link/dishes/${filename.split('.')[0]}`;

      await cloudinary.uploader.destroy(publicId);
      logger.info('Image deleted from Cloudinary', { publicId });
    } catch (error) {
      logger.error('Error deleting image', { error: error.message });
      throw error;
    }
  }
}

module.exports = new ImageUploadService();
