const express = require('express');
const { verifyFirebaseToken } = require('../middleware/auth');
const { extractTextFromS3File } = require('../lib/resume-parser');
const { analyzeResume } = require('../lib/ai-analysis');
const uploadStorage = require('../lib/upload-storage');
const router = express.Router();

// Store analysis results (in-memory for now)
const analysisStorage = new Map();

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
    
    // Find the uploaded file metadata
    const uploadRecord = uploadStorage.findUploadByKey(userId, fileKey);
    if (!uploadRecord) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Extract text from the uploaded file
    console.log('Extracting text from file...');
    const resumeText = await extractTextFromS3File(fileKey, uploadRecord.mimeType);
    
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
    
    analysisStorage.set(analysisId, analysisResult);
    
    console.log(`Analysis completed for ${analysisId}`);
    
    // Update upload record with analysis ID
    uploadStorage.updateUpload(userId, fileKey, { 
      analyzed: true, 
      analysisId,
      lastAnalyzed: new Date().toISOString()
    });
    
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
    
    const analysisResult = analysisStorage.get(analysisId);
    
    if (!analysisResult) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    
    // Check if user owns this analysis
    if (analysisResult.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
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
    
    // Get all analyses for this user
    const userAnalyses = [];
    for (const [id, analysis] of analysisStorage) {
      if (analysis.userId === userId) {
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
    
    const analysisResult = analysisStorage.get(analysisId);
    
    if (!analysisResult) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    
    // Check if user owns this analysis
    if (analysisResult.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Delete from storage
    analysisStorage.delete(analysisId);
    
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