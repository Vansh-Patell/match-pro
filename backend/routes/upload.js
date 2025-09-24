const express = require('express');
const multer = require('multer');
const { s3, BUCKET_NAME } = require('../config/aws');
const { verifyFirebaseToken } = require('../middleware/auth');
const uploadStorage = require('../lib/upload-storage');
const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only PDF, DOC, DOCX files
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'), false);
    }
  }
});

// Generate presigned URL for direct upload
router.post('/presigned-url', verifyFirebaseToken, async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    const userId = req.user?.uid; // From Firebase auth middleware
    
    if (!fileName || !fileType) {
      return res.status(400).json({ error: 'fileName and fileType are required' });
    }

    // Create unique file key
    const timestamp = Date.now();
    const fileKey = `resumes/${userId || 'anonymous'}/${timestamp}-${fileName}`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Expires: 60 * 5, // 5 minutes
      ContentType: fileType,
      ACL: 'private'
    };

    const presignedUrl = s3.getSignedUrl('putObject', params);

    res.json({
      presignedUrl,
      fileKey,
      uploadUrl: presignedUrl
    });

  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

// Alternative: Direct upload through backend
router.post('/upload', verifyFirebaseToken, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.user?.uid || 'anonymous';
    const timestamp = Date.now();
    const fileKey = `resumes/${userId}/${timestamp}-${req.file.originalname}`;

    // Extract job description data from form
    const { jobDescriptions, jobType } = req.body;
    let jobData = null;
    
    if (jobDescriptions) {
      try {
        jobData = JSON.parse(jobDescriptions);
      } catch (e) {
        // If it's not JSON, treat as plain text
        jobData = [jobDescriptions];
      }
    }

    const params = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'private',
      Metadata: {
        userId: userId,
        originalName: req.file.originalname,
        uploadDate: new Date().toISOString(),
        jobType: jobType || 'text',
        hasJobData: jobData ? 'true' : 'false'
      }
    };

    const result = await s3.upload(params).promise();

    // Save upload metadata
    const uploadRecord = uploadStorage.addUpload(userId, {
      fileKey: result.Key,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      jobDescription: jobData ? (Array.isArray(jobData) ? jobData.join('\n') : jobData) : null,
      jobType: jobType || 'text',
      fileUrl: result.Location
    });

    res.json({
      success: true,
      fileUrl: result.Location,
      fileKey: result.Key,
      uploadId: uploadRecord.id,
      jobData: jobData,
      jobType: jobType,
      message: 'Resume uploaded successfully and ready for analysis'
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Get uploaded files for a user
router.get('/files', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.user?.uid || 'anonymous';
    
    // Get stored upload metadata
    const uploads = uploadStorage.getUserUploads(userId);
    
    res.json({ files: uploads });

  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to retrieve files' });
  }
});

// Delete a file
router.delete('/files/:fileKey', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.user?.uid || 'anonymous';
    const { fileKey } = req.params;
    
    // Find the upload record
    const upload = uploadStorage.findUploadByKey(userId, fileKey);
    if (!upload) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Delete from S3
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileKey
    };
    
    await s3.deleteObject(params).promise();
    
    // Delete from storage
    uploadStorage.deleteUpload(userId, upload.id);
    
    res.json({ success: true, message: 'File deleted successfully' });

  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;