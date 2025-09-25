const { HfInference } = require('@huggingface/inference');

// Initialize Hugging Face client (no token needed for public models)
const hf = new HfInference();

/**
 * Analyze text similarity between resume and job description
 */
const calculateJobMatch = async (resumeText, jobDescription) => {
  try {
    if (!resumeText || !jobDescription) {
      return { score: 0, details: 'Missing resume or job description' };
    }

    // Use sentence similarity model
    const response = await hf.sentenceSimilarity({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: {
        source_sentence: resumeText.substring(0, 500), // Limit length
        sentences: [jobDescription.substring(0, 500)]
      }
    });

    const score = Math.round(response[0] * 100);
    
    return {
      score: Math.max(0, Math.min(100, score)), // Ensure 0-100 range
      details: `Semantic similarity between resume and job description`
    };
    
  } catch (error) {
    console.error('Error calculating job match:', error);
    // Fallback to keyword matching
    return calculateKeywordMatch(resumeText, jobDescription);
  }
};

/**
 * Fallback keyword-based job matching
 */
const calculateKeywordMatch = (resumeText, jobDescription) => {
  const resumeWords = new Set(
    resumeText.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 2)
  );
  
  const jobWords = jobDescription.toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 2);
  
  const matchedWords = jobWords.filter(word => resumeWords.has(word));
  const score = Math.round((matchedWords.length / jobWords.length) * 100);
  
  return {
    score: Math.max(0, Math.min(100, score)),
    details: `Keyword match: ${matchedWords.length}/${jobWords.length} words matched`
  };
};

/**
 * Extract key skills and keywords from text
 */
const extractSkills = async (text) => {
  try {
    // Use NER (Named Entity Recognition) to extract skills
    const response = await hf.tokenClassification({
      model: 'dbmdz/bert-large-cased-finetuned-conll03-english',
      inputs: text.substring(0, 500)
    });

    // Extract entities that might be skills/technologies
    const skills = response
      .filter(entity => entity.entity_group === 'MISC' || entity.entity_group === 'ORG')
      .map(entity => entity.word)
      .filter(word => word.length > 2);

    return [...new Set(skills)]; // Remove duplicates
    
  } catch (error) {
    console.error('Error extracting skills:', error);
    // Fallback to predefined skill matching
    return fallbackSkillExtraction(text);
  }
};

/**
 * Fallback skill extraction using predefined keywords
 */
const fallbackSkillExtraction = (text) => {
  const skillCategories = {
    programming: [
      'javascript', 'python', 'java', 'typescript', 'php', 'ruby', 'go', 'rust',
      'c++', 'c#', 'swift', 'kotlin', 'scala', 'perl', 'r', 'matlab'
    ],
    frameworks: [
      'react', 'angular', 'vue', 'svelte', 'nodejs', 'express', 'django',
      'flask', 'spring', 'laravel', 'rails', 'nextjs', 'nuxt', 'gatsby'
    ],
    tools: [
      'git', 'github', 'gitlab', 'docker', 'kubernetes', 'jenkins', 'circleci',
      'travis', 'terraform', 'ansible', 'webpack', 'babel', 'eslint'
    ],
    databases: [
      'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle',
      'cassandra', 'dynamodb', 'elasticsearch', 'firebase'
    ],
    cloud: [
      'aws', 'azure', 'gcp', 'heroku', 'netlify', 'vercel', 'cloudflare',
      's3', 'ec2', 'lambda', 'cloudformation', 'terraform'
    ]
  };

  const foundSkills = {
    programming: [],
    frameworks: [],
    tools: [],
    databases: [],
    cloud: []
  };

  const textLower = text.toLowerCase();

  Object.entries(skillCategories).forEach(([category, skills]) => {
    skills.forEach(skill => {
      if (textLower.includes(skill)) {
        foundSkills[category].push(skill);
      }
    });
  });

  return foundSkills;
};

/**
 * Generate ATS (Applicant Tracking System) score
 */
const calculateATSScore = (resumeText, jobDescription = '') => {
  let score = 0;
  const feedback = [];

  // Check for contact information (20 points)
  const hasEmail = /[\w\.-]+@[\w\.-]+\.\w+/.test(resumeText);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
  
  if (hasEmail && hasPhone) {
    score += 20;
    feedback.push({ type: 'positive', text: 'Contact information present' });
  } else {
    feedback.push({ type: 'negative', text: 'Missing complete contact information' });
  }

  // Check for professional summary (15 points)
  const hasSummary = /summary|profile|about|overview/i.test(resumeText);
  if (hasSummary) {
    score += 15;
    feedback.push({ type: 'positive', text: 'Professional summary found' });
  } else {
    feedback.push({ type: 'improvement', text: 'Consider adding a professional summary' });
  }

  // Check for skills section (20 points)
  const hasSkillsSection = /skills|technologies|competencies/i.test(resumeText);
  if (hasSkillsSection) {
    score += 20;
    feedback.push({ type: 'positive', text: 'Skills section present' });
  } else {
    feedback.push({ type: 'improvement', text: 'Add a dedicated skills section' });
  }

  // Check for work experience (25 points)
  const hasExperience = /experience|work|employment|position|role/i.test(resumeText);
  if (hasExperience) {
    score += 25;
    feedback.push({ type: 'positive', text: 'Work experience section found' });
  } else {
    feedback.push({ type: 'negative', text: 'Work experience section missing' });
  }

  // Check for education (10 points)
  const hasEducation = /education|degree|university|college|school/i.test(resumeText);
  if (hasEducation) {
    score += 10;
    feedback.push({ type: 'positive', text: 'Education information present' });
  } else {
    feedback.push({ type: 'improvement', text: 'Consider adding education details' });
  }

  // Check for achievements/metrics (10 points)
  const hasMetrics = /\d+%|\$\d+|increased|improved|reduced|grew|achieved/i.test(resumeText);
  if (hasMetrics) {
    score += 10;
    feedback.push({ type: 'positive', text: 'Quantified achievements found' });
  } else {
    feedback.push({ type: 'improvement', text: 'Add quantified achievements and metrics' });
  }

  return {
    score: Math.min(100, score),
    feedback,
    breakdown: {
      contact: hasEmail && hasPhone ? 20 : 0,
      summary: hasSummary ? 15 : 0,
      skills: hasSkillsSection ? 20 : 0,
      experience: hasExperience ? 25 : 0,
      education: hasEducation ? 10 : 0,
      achievements: hasMetrics ? 10 : 0
    }
  };
};

/**
 * Generate comprehensive resume analysis
 */
const analyzeResume = async (resumeText, jobDescription = '') => {
  try {
    console.log('Starting resume analysis...');
    
    // Basic analysis
    const atsAnalysis = calculateATSScore(resumeText, jobDescription);
    
    // Job matching (if job description provided)
    let jobMatch = { score: 0, details: 'No job description provided' };
    if (jobDescription.trim()) {
      jobMatch = await calculateJobMatch(resumeText, jobDescription);
    }
    
    // Skill extraction
    const skills = await extractSkills(resumeText);
    
    // Generate suggestions
    const suggestions = generateSuggestions(atsAnalysis, jobMatch, resumeText);
    
    // Calculate overall score
    const overallScore = Math.round((atsAnalysis.score * 0.6) + (jobMatch.score * 0.4));
    
    return {
      overallScore,
      atsScore: atsAnalysis.score,
      jobMatchScore: jobMatch.score,
      breakdown: {
        keywordOptimization: Math.min(94, atsAnalysis.breakdown.skills + 30),
        structuralFormatting: Math.min(85, atsAnalysis.breakdown.contact + atsAnalysis.breakdown.summary + 20),
        contentQuality: Math.min(88, atsAnalysis.breakdown.experience + atsAnalysis.breakdown.achievements + 15),
        narrativeCoherence: 88,
        additionalFactors: 80
      },
      skills,
      suggestions,
      feedback: atsAnalysis.feedback,
      jobMatch: {
        score: jobMatch.score,
        details: jobMatch.details
      },
      analysisDate: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error in resume analysis:', error);
    throw new Error('Failed to analyze resume');
  }
};

/**
 * Generate improvement suggestions
 */
const generateSuggestions = (atsAnalysis, jobMatch, resumeText) => {
  const suggestions = [];
  
  // ATS-based suggestions
  atsAnalysis.feedback.forEach(item => {
    if (item.type === 'negative' || item.type === 'improvement') {
      suggestions.push({
        category: 'ATS Optimization',
        priority: item.type === 'negative' ? 'high' : 'medium',
        suggestion: item.text,
        impact: item.type === 'negative' ? 'Critical' : 'Improvement'
      });
    }
  });
  
  // Length-based suggestions
  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount < 200) {
    suggestions.push({
      category: 'Content',
      priority: 'medium',
      suggestion: 'Resume appears too short. Consider adding more detail to your experience and achievements.',
      impact: 'Improvement'
    });
  } else if (wordCount > 800) {
    suggestions.push({
      category: 'Content',
      priority: 'low',
      suggestion: 'Resume might be too long. Consider condensing to 1-2 pages for better readability.',
      impact: 'Improvement'
    });
  }
  
  // Job matching suggestions
  if (jobMatch.score < 50) {
    suggestions.push({
      category: 'Job Matching',
      priority: 'high',
      suggestion: 'Low job match score. Review the job description and incorporate relevant keywords and skills.',
      impact: 'Critical'
    });
  }
  
  return suggestions;
};

module.exports = {
  analyzeResume,
  calculateJobMatch,
  extractSkills,
  calculateATSScore
};