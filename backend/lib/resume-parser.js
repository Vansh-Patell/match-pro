const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { s3, BUCKET_NAME } = require('../config/aws');

/**
 * Extract text from PDF buffer
 */
const parsePDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
};

/**
 * Extract text from Word document buffer
 */
const parseWordDocument = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('Error parsing Word document:', error);
    throw new Error('Failed to parse Word document');
  }
};

/**
 * Download file from S3 and extract text based on file type
 */
const extractTextFromS3File = async (fileKey, mimeType) => {
  try {
    console.log(`Downloading file: ${fileKey} with type: ${mimeType}`);
    
    // Download file from S3
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileKey
    };
    
    const data = await s3.getObject(params).promise();
    const buffer = data.Body;
    
    // Parse based on file type
    let text = '';
    if (mimeType === 'application/pdf') {
      text = await parsePDF(buffer);
    } else if (
      mimeType === 'application/msword' || 
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      text = await parseWordDocument(buffer);
    } else {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }
    
    // Clean up the text
    text = text.replace(/\s+/g, ' ').trim();
    
    console.log(`Extracted ${text.length} characters of text`);
    return text;
    
  } catch (error) {
    console.error('Error extracting text from S3 file:', error);
    throw error;
  }
};

/**
 * Clean and normalize text for analysis
 */
const cleanText = (text) => {
  if (!text) return '';
  
  return text
    .replace(/\s+/g, ' ')           // Replace multiple spaces with single space
    .replace(/[\r\n]+/g, ' ')       // Replace line breaks with spaces
    .replace(/[^\w\s\-\.@]/g, ' ')  // Keep only alphanumeric, spaces, hyphens, dots, @
    .trim()
    .toLowerCase();
};

/**
 * Extract key information from resume text
 */
const extractResumeInfo = (text) => {
  const cleanedText = text.toLowerCase();
  
  // Extract email
  const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
  const email = emailMatch ? emailMatch[0] : null;
  
  // Extract phone number
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : null;
  
  // Extract skills (common programming languages and technologies)
  const skillKeywords = [
    'javascript', 'python', 'java', 'react', 'node', 'nodejs', 'angular', 'vue',
    'html', 'css', 'sql', 'mongodb', 'mysql', 'postgresql', 'aws', 'azure',
    'docker', 'kubernetes', 'git', 'github', 'typescript', 'php', 'ruby',
    'go', 'rust', 'c++', 'c#', 'swift', 'kotlin', 'flutter', 'django',
    'flask', 'express', 'spring', 'laravel', 'rails', 'tensorflow', 'pytorch'
  ];
  
  const foundSkills = skillKeywords.filter(skill => 
    cleanedText.includes(skill)
  );
  
  // Extract years of experience (rough estimate)
  const experienceMatches = text.match(/(\d+)\s*(years?|yrs?)\s*(of\s*)?(experience|exp)/gi);
  let experience = 0;
  if (experienceMatches) {
    const numbers = experienceMatches.map(match => {
      const num = match.match(/\d+/);
      return num ? parseInt(num[0]) : 0;
    });
    experience = Math.max(...numbers);
  }
  
  return {
    email,
    phone,
    skills: foundSkills,
    experience,
    wordCount: text.split(/\s+/).length,
    characterCount: text.length
  };
};

module.exports = {
  extractTextFromS3File,
  parsePDF,
  parseWordDocument,
  cleanText,
  extractResumeInfo
};