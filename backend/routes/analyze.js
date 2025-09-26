const express = require('express');
const { verifyFirebaseToken } = require('../middleware/auth');
const { extractTextFromS3File } = require('../lib/resume-parser');
const { analyzeResume } = require('../lib/ai-analysis');
const uploadStorage = require('../lib/upload-storage');
const s3Storage = require('../lib/s3-storage');
const router = express.Router();

// Debug endpoint to check all files in storage (no auth required)
router.get('/debug/all-files', async (req, res) => {
  try {
    const allUploads = await uploadStorage.getAllUploads();
    res.json({
      message: 'Using S3 storage - use specific user queries',
      info: allUploads
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ error: 'Debug failed', message: error.message });
  }
});

// Debug endpoint to check uploaded files
router.get('/debug/files', verifyFirebaseToken, async (req, res) => {
  const userId = req.user?.uid || 'anonymous';
  const userFiles = await uploadStorage.getUserUploads(userId);
  res.json({
    userId,
    filesCount: userFiles.length,
    files: userFiles.map(f => ({
      fileKey: f.fileKey,
      originalName: f.fileName,
      uploadedAt: f.uploadedAt
    }))
  });
});

// Removed duplicate debug endpoint - using S3 storage now

// Analysis results now stored in S3 via s3Storage module

/**
 * POST /api/analyze/resume
 * Analyze a resume that was previously uploaded
 */
router.post('/resume', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.user?.uid || 'anonymous';
    const { fileKey, jobDescription = '' } = req.body;
    
    if (!fileKey) {
      return res.status(400).json({ error: 'fileKey is required' });
    }
    
    console.log(`Starting analysis for file: ${fileKey}, user: ${userId}`);
    
    // Debug: Check what files exist for this user
    const userFiles = await uploadStorage.getUserUploads(userId);
    console.log(`User ${userId} has ${userFiles.length} files:`, userFiles.map(f => f.fileKey));
    
    // Find the uploaded file metadata
    const uploadRecord = await uploadStorage.findUploadByKey(userId, fileKey);
    if (!uploadRecord) {
      console.log(`File ${fileKey} not found for user ${userId}`);
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Extract text from the uploaded file
    console.log('Extracting text from file...');
    const resumeText = await extractTextFromS3File(fileKey, uploadRecord.fileType);
    
    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({ 
        error: 'Could not extract meaningful text from the resume. Please ensure the file is readable and contains text.' 
      });
    }
    
    console.log(`Extracted ${resumeText.length} characters from resume`);
    
    // Perform AI analysis
    console.log('Performing AI analysis...');
    const analysis = await analyzeResume(resumeText, jobDescription);
    
    // Generate unique analysis ID
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store analysis results
    const analysisResult = {
      id: analysisId,
      userId,
      fileKey,
      fileName: uploadRecord.originalName,
      jobDescription,
      resumeText: resumeText.substring(0, 1000), // Store first 1000 chars for preview
      analysis,
      createdAt: new Date().toISOString(),
      status: 'completed'
    };
    
    // Save analysis result to S3
    await s3Storage.saveAnalysisResult(userId, analysisId, analysisResult);
    
    console.log(`Analysis completed for ${analysisId}`);
    
    // Update upload record with analysis ID
    const existingUpload = await uploadStorage.findUploadByKey(userId, fileKey);
    if (existingUpload) {
      await uploadStorage.updateUpload(userId, existingUpload.id, { 
        analyzed: true, 
        analysisId,
        matchScore: analysis.jobMatchScore || analysis.overallScore,
        lastAnalyzed: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      analysisId,
      analysis: analysis,
      message: 'Resume analysis completed successfully'
    });
    
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({ 
      error: 'Failed to analyze resume',
      message: error.message 
    });
  }
});

/**
 * GET /api/analyze/results/:analysisId
 * Get analysis results by ID
 */
router.get('/results/:analysisId', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.user?.uid || 'anonymous';
    const { analysisId } = req.params;
    
    const analysisResult = await s3Storage.loadAnalysisResult(userId, analysisId);
    
    if (!analysisResult) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    
    // Analysis is already user-specific by userId in S3 path
    res.json({
      success: true,
      result: analysisResult
    });
    
  } catch (error) {
    console.error('Error retrieving analysis:', error);
    res.status(500).json({ error: 'Failed to retrieve analysis' });
  }
});

/**
 * GET /api/analyze/history
 * Get user's analysis history
 */
router.get('/history', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.user?.uid || 'anonymous';
    
    // Get all analysis IDs for this user from S3
    const analysisIds = await s3Storage.getUserAnalyses(userId);
    
    // Load summary data for each analysis
    const userAnalyses = [];
    for (const analysisId of analysisIds) {
      try {
        const analysis = await s3Storage.loadAnalysisResult(userId, analysisId);
        if (analysis) {
          // Return summary without full text
          userAnalyses.push({
            id: analysis.id,
            fileName: analysis.fileName,
            overallScore: analysis.analysis.overallScore,
            atsScore: analysis.analysis.atsScore,
            jobMatchScore: analysis.analysis.jobMatchScore,
            createdAt: analysis.createdAt,
            status: analysis.status
          });
        }
      } catch (error) {
        console.error(`Error loading analysis ${analysisId}:`, error);
      }
    }
    
    // Sort by creation date (newest first)
    userAnalyses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      success: true,
      analyses: userAnalyses
    });
    
  } catch (error) {
    console.error('Error retrieving analysis history:', error);
    res.status(500).json({ error: 'Failed to retrieve analysis history' });
  }
});

/**
 * DELETE /api/analyze/results/:analysisId
 * Delete an analysis result
 */
router.delete('/results/:analysisId', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.user?.uid || 'anonymous';
    const { analysisId } = req.params;
    
    // Check if analysis exists and delete it
    const analysisResult = await s3Storage.loadAnalysisResult(userId, analysisId);
    
    if (!analysisResult) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    
    // Delete from S3 (analysis is already user-specific by userId in path)
    await s3Storage.deleteAnalysis(userId, analysisId);
    
    res.json({
      success: true,
      message: 'Analysis deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting analysis:', error);
    res.status(500).json({ error: 'Failed to delete analysis' });
  }
});

/**
 * GET /api/analyze/test
 * Test endpoint to verify the service is working
 */
router.get('/test', async (req, res) => {
  try {
    const testText = "John Doe, Software Engineer with 5 years of experience in JavaScript, React, Node.js, and Python. Email: john@example.com, Phone: (555) 123-4567. Experience includes building web applications and APIs.";
    const testJobDescription = "Looking for a Senior Software Engineer with experience in JavaScript, React, and Node.js. Must have 3+ years of experience building web applications.";
    
    const analysis = await analyzeResume(testText, testJobDescription);
    
    res.json({
      success: true,
      testAnalysis: analysis,
      message: 'AI analysis service is working correctly'
    });
    
  } catch (error) {
    console.error('Error testing analysis service:', error);
    res.status(500).json({ 
      error: 'Analysis service test failed',
      message: error.message 
    });
  }
});

module.exports = router;