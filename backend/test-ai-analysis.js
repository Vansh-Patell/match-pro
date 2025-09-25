/**
 * Test script for OpenAI integration in AI analysis
 * Run with: node test-ai-analysis.js
 */

require('dotenv').config();
const { analyzeResume } = require('./lib/ai-analysis');

const testResume = `
John Doe
Software Engineer
Email: john.doe@email.com
Phone: (555) 123-4567

SUMMARY
Experienced full-stack developer with 5 years of experience in JavaScript, React, and Node.js.
Passionate about building scalable web applications and working with modern technologies.

EXPERIENCE
Senior Software Engineer | Tech Company (2021 - Present)
- Developed and maintained React applications serving 100k+ users
- Built RESTful APIs using Node.js and Express
- Collaborated with cross-functional teams to deliver features on time
- Improved application performance by 40% through code optimization

Software Developer | Startup Inc (2019 - 2021)
- Created responsive web applications using React and TypeScript
- Integrated third-party APIs and payment systems
- Participated in agile development processes
- Mentored junior developers

SKILLS
Languages: JavaScript, TypeScript, Python, HTML, CSS
Frameworks: React, Node.js, Express, Next.js
Databases: MongoDB, PostgreSQL, Redis
Tools: Git, Docker, AWS, Jenkins

EDUCATION
Bachelor of Science in Computer Science
University of Technology (2015 - 2019)
`;

const testJobDescription = `
We are looking for a Senior React Developer to join our team.

Requirements:
- 3+ years of experience with React and JavaScript
- Experience with TypeScript and modern frontend tooling
- Knowledge of state management (Redux, Context API)
- Experience with REST APIs and GraphQL
- Familiar with testing frameworks (Jest, Cypress)
- Experience with AWS and cloud deployment

Responsibilities:
- Build and maintain React applications
- Collaborate with design and backend teams
- Write clean, maintainable code
- Participate in code reviews
- Mentor junior developers
`;

async function testAnalysis() {
  try {
    console.log('Testing OpenAI integration...');
    console.log('API Key configured:', !!process.env.OPENAI_API_KEY);
    
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.error('Please set your OPENAI_API_KEY in the .env file');
      return;
    }
    
    const analysis = await analyzeResume(testResume, testJobDescription);
    
    console.log('\n=== ANALYSIS RESULTS ===');
    console.log('Overall Score:', analysis.overallScore);
    console.log('ATS Score:', analysis.atsScore);
    console.log('Job Match Score:', analysis.jobMatchScore);
    console.log('\nExtracted Skills:', analysis.skills);
    console.log('\nSuggestions:');
    analysis.suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. [${suggestion.category}] ${suggestion.suggestion}`);
    });
    
    console.log('\nJob Match Details:', analysis.jobMatch.details);
    
  } catch (error) {
    console.error('Test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testAnalysis();