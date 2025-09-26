const { s3, BUCKET_NAME } = require('../config/aws');

/**
 * S3-based persistent storage for metadata and analysis results
 * Structure:
 * - metadata/{userId}.json - User's file metadata
 * - analyses/{userId}/{analysisId}.json - Analysis results
 */

class S3Storage {
  constructor() {
    this.bucketName = BUCKET_NAME;
  }

  /**
   * Save user file metadata to S3
   */
  async saveUserMetadata(userId, metadata) {
    try {
      const key = `metadata/${userId}.json`;
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: JSON.stringify(metadata, null, 2),
        ContentType: 'application/json'
      };

      await s3.upload(params).promise();
      console.log(`Saved metadata for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Error saving user metadata:', error);
      throw error;
    }
  }

  /**
   * Load user file metadata from S3
   */
  async loadUserMetadata(userId) {
    try {
      const key = `metadata/${userId}.json`;
      const params = {
        Bucket: this.bucketName,
        Key: key
      };

      const result = await s3.getObject(params).promise();
      const metadata = JSON.parse(result.Body.toString());
      console.log(`Loaded metadata for user ${userId}:`, metadata.length, 'files');
      return metadata;
    } catch (error) {
      if (error.code === 'NoSuchKey') {
        // User has no metadata yet, return empty array
        console.log(`No metadata found for user ${userId}, returning empty array`);
        return [];
      }
      console.error('Error loading user metadata:', error);
      throw error;
    }
  }

  /**
   * Save analysis result to S3
   */
  async saveAnalysisResult(userId, analysisId, analysisData) {
    try {
      const key = `analyses/${userId}/${analysisId}.json`;
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: JSON.stringify(analysisData, null, 2),
        ContentType: 'application/json'
      };

      await s3.upload(params).promise();
      console.log(`Saved analysis ${analysisId} for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Error saving analysis result:', error);
      throw error;
    }
  }

  /**
   * Load analysis result from S3
   */
  async loadAnalysisResult(userId, analysisId) {
    try {
      const key = `analyses/${userId}/${analysisId}.json`;
      const params = {
        Bucket: this.bucketName,
        Key: key
      };

      const result = await s3.getObject(params).promise();
      const analysisData = JSON.parse(result.Body.toString());
      console.log(`Loaded analysis ${analysisId} for user ${userId}`);
      return analysisData;
    } catch (error) {
      if (error.code === 'NoSuchKey') {
        console.log(`Analysis ${analysisId} not found for user ${userId}`);
        return null;
      }
      console.error('Error loading analysis result:', error);
      throw error;
    }
  }

  /**
   * Get all analysis IDs for a user
   */
  async getUserAnalyses(userId) {
    try {
      const prefix = `analyses/${userId}/`;
      const params = {
        Bucket: this.bucketName,
        Prefix: prefix
      };

      const result = await s3.listObjectsV2(params).promise();
      const analysisIds = result.Contents.map(obj => {
        const filename = obj.Key.replace(prefix, '');
        return filename.replace('.json', '');
      });

      console.log(`Found ${analysisIds.length} analyses for user ${userId}`);
      return analysisIds;
    } catch (error) {
      console.error('Error getting user analyses:', error);
      return [];
    }
  }

  /**
   * Delete user's analysis
   */
  async deleteAnalysis(userId, analysisId) {
    try {
      const key = `analyses/${userId}/${analysisId}.json`;
      const params = {
        Bucket: this.bucketName,
        Key: key
      };

      await s3.deleteObject(params).promise();
      console.log(`Deleted analysis ${analysisId} for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Error deleting analysis:', error);
      throw error;
    }
  }

  /**
   * Add file to user metadata
   */
  async addFileToUserMetadata(userId, fileData) {
    try {
      const currentMetadata = await this.loadUserMetadata(userId);
      
      const newFile = {
        id: Date.now().toString(),
        ...fileData,
        uploadedAt: new Date().toISOString(),
        analyzed: false,
        matchScore: null
      };

      currentMetadata.push(newFile);
      await this.saveUserMetadata(userId, currentMetadata);
      
      return newFile;
    } catch (error) {
      console.error('Error adding file to user metadata:', error);
      throw error;
    }
  }

  /**
   * Update file in user metadata
   */
  async updateFileInUserMetadata(userId, fileId, updateData) {
    try {
      const currentMetadata = await this.loadUserMetadata(userId);
      const fileIndex = currentMetadata.findIndex(f => f.id === fileId);
      
      if (fileIndex === -1) {
        console.log(`File ${fileId} not found for user ${userId}`);
        return null;
      }

      currentMetadata[fileIndex] = {
        ...currentMetadata[fileIndex],
        ...updateData
      };

      await this.saveUserMetadata(userId, currentMetadata);
      return currentMetadata[fileIndex];
    } catch (error) {
      console.error('Error updating file in user metadata:', error);
      throw error;
    }
  }

  /**
   * Find file by key in user metadata
   */
  async findFileByKey(userId, fileKey) {
    try {
      const metadata = await this.loadUserMetadata(userId);
      return metadata.find(f => f.fileKey === fileKey) || null;
    } catch (error) {
      console.error('Error finding file by key:', error);
      return null;
    }
  }

  /**
   * Delete file from user metadata
   */
  async deleteFileFromUserMetadata(userId, fileId) {
    try {
      const currentMetadata = await this.loadUserMetadata(userId);
      const updatedMetadata = currentMetadata.filter(f => f.id !== fileId);
      
      if (updatedMetadata.length === currentMetadata.length) {
        console.log(`File ${fileId} not found for user ${userId}`);
        return false;
      }

      await this.saveUserMetadata(userId, updatedMetadata);
      return true;
    } catch (error) {
      console.error('Error deleting file from user metadata:', error);
      throw error;
    }
  }
}

// Create singleton instance
const s3Storage = new S3Storage();

module.exports = s3Storage;