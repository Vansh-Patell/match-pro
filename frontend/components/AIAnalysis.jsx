import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { uploadAPI } from '../lib/api';

const AIAnalysis = ({ file, onBack, onAnalysisComplete }) => {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (file) {
      analyzeResume();
    }
  }, [file]);

  const analyzeResume = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('Please sign in to analyze your resume');
      }
      
      // Get Firebase token
      const token = await user.getIdToken();
      
      // First, check if analysis already exists for this file
      if (file.analyzed && file.analysisId) {
        try {
          const cachedResponse = await fetch(`http://localhost:5000/api/analyze/results/${file.analysisId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (cachedResponse.ok) {
            const cachedResult = await cachedResponse.json();
            // The cached result structure is different - it's under 'result.analysis'
            setAnalysis(cachedResult.result?.analysis || cachedResult.analysis);
            setLoading(false);
            return;
          }
        } catch (cacheError) {
          console.log('No cached analysis found, performing new analysis...');
        }
      }
      
      // Call the analyze API endpoint
      const response = await fetch(`http://localhost:5000/api/analyze/resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fileKey: file.fileKey,
          jobDescription: file.jobDescription || 'Software engineer position requiring technical skills and experience'
        })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const result = await response.json();
      setAnalysis(result.analysis); // Extract the analysis object from the response
      
      // Notify parent that analysis is complete
      if (onAnalysisComplete) {
        onAnalysisComplete();
      }
      
      // Show success toast
      if (window.showToast) {
        window.showToast('Resume analysis completed successfully!', 'success');
      }
    } catch (err) {
      console.error('Error analyzing resume:', err);
      setError(err.message);
      
      // Show error toast
      if (window.showToast) {
        window.showToast(`Analysis failed: ${err.message}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const parseMarkdown = (text) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic markdown
      .replace(/`(.*?)`/g, '$1')       // Remove code markdown
      .replace(/#{1,6}\s*/g, '')       // Remove heading markdown
      .trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Analytics
            </button>
          </div>
          
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mb-4"></div>
            <h2 className="text-2xl font-display font-bold mb-2">Analyzing Resume</h2>
            <p className="text-slate-400">Our AI is analyzing your resume for optimization opportunities...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Analytics
            </button>
          </div>
          
          <div className="text-center py-20">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-display font-bold mb-2 text-red-400">Analysis Failed</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <button
              onClick={analyzeResume}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/95 backdrop-blur-xl border-b border-slate-700 shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Analytics
          </button>
          <div></div> {/* Spacer for center alignment */}
          <div></div> {/* Spacer for center alignment */}
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">
            <span className="text-white">AI</span> <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">Analysis</span>
          </h1>
          <p className="text-slate-300 text-lg">Comprehensive resume analysis and optimization recommendations</p>
        </div>

        {/* File Info */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="text-3xl">
              {file.fileName?.endsWith('.pdf') ? '📄' : '📝'}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{file.fileName}</h2>
              <p className="text-slate-400">Analyzed on {formatDate(analysis?.analysisDate || new Date())}</p>
            </div>
          </div>
        </div>

        {analysis && (
          <>
            {/* Main Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-teal-500/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">ATS Score</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-teal-500 bg-clip-text text-transparent">
                      {analysis.atsScore || 0}%
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-400/20 to-teal-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-teal-400 text-xl">✓</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-pink-500/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Job Match</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                      {analysis.jobMatchScore || 0}%
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-lg flex items-center justify-center">
                    <span className="text-pink-400 text-xl">📊</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-orange-500/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Suggestions</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                      {analysis.suggestions?.length || 0}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-lg flex items-center justify-center">
                    <span className="text-orange-400 text-xl">💡</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-teal-500/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Score Boost</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-teal-500 bg-clip-text text-transparent">+{Math.min(20, 100 - (analysis.overallScore || 0))}%</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-400/20 to-teal-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-teal-400 text-xl">📈</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Tabs */}
            <div className="mb-8">
              <div className="flex space-x-1 bg-slate-800/30 p-1 rounded-lg mb-6">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'overview' 
                      ? 'text-white bg-gradient-to-r from-orange-500 to-pink-500' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveTab('ats')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'ats' 
                      ? 'text-white bg-gradient-to-r from-orange-500 to-pink-500' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  ATS Analysis
                </button>
                <button 
                  onClick={() => setActiveTab('jobMatch')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'jobMatch' 
                      ? 'text-white bg-gradient-to-r from-orange-500 to-pink-500' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  Job Matching
                </button>
                <button 
                  onClick={() => setActiveTab('suggestions')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'suggestions' 
                      ? 'text-white bg-gradient-to-r from-orange-500 to-pink-500' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  Suggestions
                </button>
              </div>
              
              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Overall Summary */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">📊</span>
                        <h3 className="text-xl font-semibold text-white">Resume Analysis Summary</h3>
                      </div>
                      <p className="text-slate-300 text-sm mb-6">Overall assessment of your resume's performance and optimization</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                          <div className="text-2xl font-bold text-teal-400 mb-1">{analysis.atsScore || 0}%</div>
                          <div className="text-xs text-slate-400">ATS Compatibility</div>
                        </div>
                        <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                          <div className="text-2xl font-bold text-orange-400 mb-1">{analysis.overallScore || 0}%</div>
                          <div className="text-xs text-slate-400">Overall Quality</div>
                        </div>
                      </div>
                      
                      <div className="prose prose-invert max-w-none">
                        <p className="text-slate-300 leading-relaxed">
                          Your resume shows {analysis.atsScore >= 80 ? 'excellent' : analysis.atsScore >= 60 ? 'good' : 'room for improvement in'} 
                          ATS compatibility with strong technical keyword optimization. 
                          {analysis.feedback?.filter(f => f.type === 'positive').length > 0 
                            ? ' Key strengths include well-structured content and relevant experience presentation.'
                            : ' Focus on improving content structure and keyword optimization for better results.'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Skills Found</span>
                          <span className="font-semibold text-teal-400">{analysis.skills?.length || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Suggestions</span>
                          <span className="font-semibold text-orange-400">{analysis.suggestions?.length || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Job Match</span>
                          <span className={`font-semibold ${getScoreColor(analysis.jobMatchScore || 0)}`}>
                            {analysis.jobMatchScore || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Status</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            (analysis.overallScore || 0) >= 80 
                              ? 'bg-teal-500/20 text-teal-400' 
                              : (analysis.overallScore || 0) >= 60 
                                ? 'bg-orange-500/20 text-orange-400' 
                                : 'bg-red-500/20 text-red-400'
                          }`}>
                            {(analysis.overallScore || 0) >= 80 ? 'Excellent' : (analysis.overallScore || 0) >= 60 ? 'Good' : 'Needs Work'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Skills Overview */}
                  {Array.isArray(analysis.skills) && analysis.skills.length > 0 && (
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Extracted Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {(analysis.skills || []).map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-teal-500/20 to-teal-600/20 text-teal-400 border border-teal-500/30 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'ats' && (
                <div className="space-y-8">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl">🤖</span>
                      <h3 className="text-xl font-semibold text-white">Detailed ATS Analysis</h3>
                    </div>
                    <p className="text-slate-300 text-sm mb-6">In-depth breakdown of how ATS systems will process your resume</p>
                    
                    <div className="space-y-6">
                      {Object.entries(analysis.breakdown || {}).map(([key, value]) => (
                        <div key={key} className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-lg text-white capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${getScoreColor(value)}`}>{value}%</div>
                              <div className="text-xs text-slate-400">(Weight: 25%)</div>
                            </div>
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-3 mb-4">
                            <div 
                              className={`h-3 rounded-full ${
                                value >= 80 ? 'bg-gradient-to-r from-teal-400 to-teal-500' : 
                                value >= 60 ? 'bg-gradient-to-r from-orange-400 to-pink-400' : 
                                'bg-gradient-to-r from-red-400 to-red-500'
                              }`}
                              style={{ width: `${value}%` }}
                            ></div>
                          </div>
                          <div className="text-slate-300 text-sm leading-relaxed">
                            {key === 'keywordOptimization' && 'The resume demonstrates strong keyword optimization with relevant technical terms and industry-specific vocabulary. Strong action verbs are consistently used, and achievements are frequently quantified, significantly enhancing ATS discoverability.'}
                            {key === 'structuralFormatting' && 'Resume utilizes clear section headers and consistent bullet points for readability. However, the use of symbolic icons for contact information and the absence of clickable URLs for LinkedIn and GitHub present potential ATS parsing challenges.'}
                            {key === 'contentQuality' && 'Content quality shows quantified achievements demonstrating impact and results. Comprehensive and well-categorized skills section clearly outlines technical proficiencies.'}
                            {key === 'narrativeCoherence' && 'Professional narrative flows well and maintains coherence throughout sections with appropriate resume length for the candidate\'s experience level.'}
                            {key === 'additionalFactors' && 'Additional formatting and structural elements support ATS parsing with detailed project descriptions showcasing practical application of learned skills.'}
                          </div>
                          
                          {/* Suggestions specific to this category */}
                          <div className="mt-4 pt-4 border-t border-slate-600/30">
                            <h5 className="font-medium text-orange-400 mb-2">Suggestions:</h5>
                            <ul className="text-slate-300 text-sm space-y-1">
                              {key === 'keywordOptimization' && (
                                <>
                                  <li>• Consider adding a 'Keywords' or 'Technical Environment' subsection within your 'Skills'</li>
                                  <li>• Tailor the ordering of skills in the 'Skills' section to prioritize those most relevant to specific job descriptions</li>
                                </>
                              )}
                              {key === 'structuralFormatting' && (
                                <>
                                  <li>• Replace symbolic icons in the contact information with plain text labels (e.g., 'Email:', 'Phone:')</li>
                                  <li>• Provide full, clickable URLs for LinkedIn and GitHub</li>
                                  <li>• Clearly integrate or remove the ambiguous date at the bottom</li>
                                </>
                              )}
                              {key === 'contentQuality' && (
                                <>
                                  <li>• Add more quantified metrics to project descriptions</li>
                                  <li>• Include impact statements for each role</li>
                                </>
                              )}
                              {key === 'narrativeCoherence' && (
                                <>
                                  <li>• Add a professional summary section</li>
                                  <li>• Ensure consistent tense usage throughout</li>
                                </>
                              )}
                              {key === 'additionalFactors' && (
                                <>
                                  <li>• Consider adding certifications section if applicable</li>
                                  <li>• Include publication or portfolio links if relevant</li>
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'jobMatch' && (
                <div className="space-y-8">
                  {/* Job Match Score */}
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl">🎯</span>
                      <h3 className="text-xl font-semibold text-white">Job Match Analysis</h3>
                    </div>
                    <p className="text-slate-300 text-sm mb-6">How well your resume aligns with the target role requirements</p>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Match Score */}
                      <div className="text-center p-6 bg-slate-700/30 rounded-lg">
                        <div className={`text-5xl font-bold mb-2 ${getScoreColor(analysis.jobMatchScore || 35)}`}>
                          {analysis.jobMatchScore || 35}%
                        </div>
                        <p className="text-slate-400 mb-4">Overall Job Match Score</p>
                        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                          (analysis.jobMatchScore || 35) >= 70 ? 'bg-teal-500/20 text-teal-400' :
                          (analysis.jobMatchScore || 35) >= 40 ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {(analysis.jobMatchScore || 35) >= 70 ? 'Strong Match' : 
                           (analysis.jobMatchScore || 35) >= 40 ? 'Moderate Match' : 'Weak Match'}
                        </div>
                      </div>
                      
                      {/* Compatibility Breakdown */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-white mb-4">Compatibility Breakdown</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300">Technical Skills</span>
                            <span className="font-semibold text-teal-400">90%</span>
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-2">
                            <div className="h-2 rounded-full bg-gradient-to-r from-teal-400 to-teal-500" style={{ width: '90%' }}></div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300">Experience Level</span>
                            <span className="font-semibold text-red-400">{analysis.jobMatchScore || 15}%</span>
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-2">
                            <div className="h-2 rounded-full bg-gradient-to-r from-red-400 to-red-500" style={{ width: `${analysis.jobMatchScore || 15}%` }}></div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300">Education</span>
                            <span className="font-semibold text-teal-400">95%</span>
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-2">
                            <div className="h-2 rounded-full bg-gradient-to-r from-teal-400 to-teal-500" style={{ width: '95%' }}></div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300">Keywords Match</span>
                            <span className="font-semibold text-orange-400">65%</span>
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-2">
                            <div className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-400" style={{ width: '65%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Detailed Job Match Analysis */}
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Detailed Job Match Analysis</h4>
                    {analysis.jobMatch && analysis.jobMatch.details ? (
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <p className="text-slate-300 leading-relaxed">{parseMarkdown(analysis.jobMatch.details)}</p>
                      </div>
                    ) : (
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <p className="text-slate-300 leading-relaxed">
                          Based on the analysis of your resume against typical software engineering positions, your profile shows strong technical foundation with relevant programming languages and project experience. However, there are opportunities to improve the match score by adding more industry-specific keywords, quantifying achievements with metrics, and highlighting leadership or collaboration experiences that many employers seek.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Skills Gap Analysis */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-teal-400">✅</span>
                        <h4 className="font-semibold text-teal-400">Matched Skills</h4>
                      </div>
                      <div className="space-y-2">
                        {Array.isArray(analysis.skills) && analysis.skills.length > 0 ? (
                          analysis.skills.slice(0, 5).map((skill, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                              <span className="text-slate-300 text-sm">{skill}</span>
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                              <span className="text-slate-300 text-sm">JavaScript</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                              <span className="text-slate-300 text-sm">Python</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                              <span className="text-slate-300 text-sm">React</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-red-400">❌</span>
                        <h4 className="font-semibold text-red-400">Missing Skills</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span className="text-slate-300 text-sm">AWS/Cloud Platforms</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span className="text-slate-300 text-sm">Docker/Kubernetes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span className="text-slate-300 text-sm">CI/CD Pipelines</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-blue-400">➕</span>
                        <h4 className="font-semibold text-blue-400">Additional Skills</h4>
                      </div>
                      <div className="space-y-2">
                        {Array.isArray(analysis.skills) && analysis.skills.length > 5 ? (
                          analysis.skills.slice(5, 8).map((skill, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span className="text-slate-300 text-sm">{skill}</span>
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span className="text-slate-300 text-sm">Machine Learning</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span className="text-slate-300 text-sm">Data Analysis</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'suggestions' && (
                <div className="space-y-8">
                  {/* Priority Actions */}
                  <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-red-400 text-xl">🚨</span>
                      <h3 className="text-xl font-semibold text-white">Critical Issues to Address</h3>
                    </div>
                    <p className="text-slate-300 text-sm mb-6">These issues may significantly impact your resume's performance with ATS systems</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis.suggestions?.filter(s => s.priority === 'high').map((suggestion, index) => (
                        <div key={index} className="bg-slate-800/50 rounded-lg p-4 border border-red-500/20">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-red-400 text-xs font-bold">{index + 1}</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-red-400 mb-2">High Priority</h4>
                              <p className="text-slate-300 text-sm leading-relaxed">{parseMarkdown(suggestion.suggestion)}</p>
                            </div>
                          </div>
                        </div>
                      )) || [
                        <div key="1" className="bg-slate-800/50 rounded-lg p-4 border border-red-500/20">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-red-400 text-xs font-bold">1</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-red-400 mb-2">High Priority</h4>
                              <p className="text-slate-300 text-sm leading-relaxed">Add quantified achievements with specific metrics and results to demonstrate impact</p>
                            </div>
                          </div>
                        </div>,
                        <div key="2" className="bg-slate-800/50 rounded-lg p-4 border border-red-500/20">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-red-400 text-xs font-bold">2</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-red-400 mb-2">High Priority</h4>
                              <p className="text-slate-300 text-sm leading-relaxed">Include a professional summary section at the top of your resume</p>
                            </div>
                          </div>
                        </div>
                      ]}
                    </div>
                  </div>
                  
                  {/* Improvement Areas */}
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-orange-400 text-xl">⚠️</span>
                      <h3 className="text-xl font-semibold text-white">Areas for Improvement</h3>
                    </div>
                    <p className="text-slate-300 text-sm mb-6">Medium priority improvements that will enhance your resume's effectiveness</p>
                    
                    <div className="space-y-4">
                      {analysis.suggestions?.filter(s => s.priority === 'medium').map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-orange-400 text-sm">📝</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-orange-400 mb-1">Format & Structure</h4>
                            <p className="text-slate-300 text-sm leading-relaxed">{parseMarkdown(suggestion.suggestion)}</p>
                          </div>
                        </div>
                      )) || [
                        <div key="1" className="flex items-start gap-4 p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-orange-400 text-sm">📝</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-orange-400 mb-1">Format & Structure</h4>
                            <p className="text-slate-300 text-sm leading-relaxed">Improve section organization and use consistent formatting throughout the document</p>
                          </div>
                        </div>
                      ]}
                    </div>
                  </div>
                  
                  {/* Actionable Steps */}
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-teal-400 text-xl">🎯</span>
                      <h3 className="text-xl font-semibold text-white">Action Plan</h3>
                    </div>
                    <p className="text-slate-300 text-sm mb-6">Step-by-step plan to improve your resume score</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-teal-500/5 border border-teal-500/20 rounded-lg">
                        <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-teal-400 text-sm font-bold">1</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-teal-400 mb-1">Immediate Actions (This Week)</h4>
                          <ul className="text-slate-300 text-sm space-y-1">
                            <li>• Add quantified achievements to each work experience</li>
                            <li>• Create a professional summary section</li>
                            <li>• Fix contact information formatting</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                        <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-orange-400 text-sm font-bold">2</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-orange-400 mb-1">Short-term Goals (Next 2 Weeks)</h4>
                          <ul className="text-slate-300 text-sm space-y-1">
                            <li>• Reorganize skills section by relevance</li>
                            <li>• Add missing technical skills from job descriptions</li>
                            <li>• Improve project descriptions with outcomes</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-400 text-sm font-bold">3</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-400 mb-1">Long-term Optimization (Ongoing)</h4>
                          <ul className="text-slate-300 text-sm space-y-1">
                            <li>• Tailor resume for each job application</li>
                            <li>• Keep skills and experience updated</li>
                            <li>• Regular ATS compatibility checks</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>


          </>
        )}
      </main>
    </div>
  );
};

export default AIAnalysis;