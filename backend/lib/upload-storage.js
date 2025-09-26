// S3-backed persistent storage for upload metadata
const s3Storage = require('./s3-storage');

class UploadStorage {
  constructor() {
    // No in-memory storage needed - using S3
  }

  // Add upload metadata
  async addUpload(userId, uploadData) {
    try {
      return await s3Storage.addFileToUserMetadata(userId, uploadData);
    } catch (error) {
      console.error('Error adding upload:', error);
      throw error;
    }
  }

  // Get all uploads for a user
  async getUserUploads(userId) {
    try {
      return await s3Storage.loadUserMetadata(userId);
    } catch (error) {
      console.error('Error getting user uploads:', error);
      return [];
    }
  }

  // Update upload metadata
  async updateUpload(userId, uploadId, updateData) {
    try {
      return await s3Storage.updateFileInUserMetadata(userId, uploadId, updateData);
    } catch (error) {
      console.error('Error updating upload:', error);
      return null;
    }
  }

  // Delete upload metadata
  async deleteUpload(userId, uploadId) {
    try {
      return await s3Storage.deleteFileFromUserMetadata(userId, uploadId);
    } catch (error) {
      console.error('Error deleting upload:', error);
      return false;
    }
  }

  // Find upload by file key
  async findUploadByKey(userId, fileKey) {
    try {
      return await s3Storage.findFileByKey(userId, fileKey);
    } catch (error) {
      console.error('Error finding upload by key:', error);
      return null;
    }
  }

  // Get all uploads for debugging
  async getAllUploads() {
    // This would be expensive in S3, so we'll return a message
    return { message: 'Use specific user queries for S3 storage' };
  }
}

// Create singleton instance
const uploadStorage = new UploadStorage();

module.exports = uploadStorage;