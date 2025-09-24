// Simple in-memory storage for upload metadata
// In production, this should be replaced with a proper database

class UploadStorage {
  constructor() {
    this.uploads = new Map(); // userId -> uploads[]
  }

  // Add upload metadata
  addUpload(userId, uploadData) {
    if (!this.uploads.has(userId)) {
      this.uploads.set(userId, []);
    }
    
    const uploads = this.uploads.get(userId);
    uploads.push({
      id: Date.now().toString(),
      ...uploadData,
      uploadedAt: new Date().toISOString(),
      analyzed: false,
      matchScore: null
    });
    
    return uploads[uploads.length - 1];
  }

  // Get all uploads for a user
  getUserUploads(userId) {
    return this.uploads.get(userId) || [];
  }

  // Update upload metadata
  updateUpload(userId, uploadId, updateData) {
    const uploads = this.uploads.get(userId);
    if (!uploads) return null;
    
    const uploadIndex = uploads.findIndex(u => u.id === uploadId);
    if (uploadIndex === -1) return null;
    
    uploads[uploadIndex] = {
      ...uploads[uploadIndex],
      ...updateData
    };
    
    return uploads[uploadIndex];
  }

  // Delete upload metadata
  deleteUpload(userId, uploadId) {
    const uploads = this.uploads.get(userId);
    if (!uploads) return false;
    
    const uploadIndex = uploads.findIndex(u => u.id === uploadId);
    if (uploadIndex === -1) return false;
    
    uploads.splice(uploadIndex, 1);
    return true;
  }

  // Find upload by file key
  findUploadByKey(userId, fileKey) {
    const uploads = this.uploads.get(userId);
    if (!uploads) return null;
    
    return uploads.find(u => u.fileKey === fileKey);
  }
}

// Create singleton instance
const uploadStorage = new UploadStorage();

module.exports = uploadStorage;