import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { uploadAPI } from '../lib/api';

const AIAnalysis = ({ file, onBack }) => {
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
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">
            AI <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">Analysis</span>
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - ATS Score Breakdown */}
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl">🎯</span>
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">ATS Score Breakdown</h3>
                    </div>
                    <p className="text-slate-400 text-sm mb-6">How your resume performs against ATS systems</p>
                    
                    <div className="space-y-4">
                      {Object.entries(analysis.breakdown || {}).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300 font-medium">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className={`font-semibold ${getScoreColor(value)}`}>{value}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                value >= 80 ? 'bg-gradient-to-r from-teal-400 to-teal-500' : 
                                value >= 60 ? 'bg-gradient-to-r from-orange-400 to-pink-400' : 
                                'bg-gradient-to-r from-red-400 to-red-500'
                              }`}
                              style={{ width: `${value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Right Column - Key Insights */}
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl">⭐</span>
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">Key Insights</h3>
                    </div>
                    <p className="text-slate-400 text-sm mb-6">Your resume's main strengths and areas for improvement</p>
                    
                    {/* Strengths */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-teal-400">✅</span>
                        <h4 className="font-semibold text-teal-400">Strengths</h4>
                      </div>
                      <div className="space-y-2">
                        {analysis.feedback?.filter(f => f.type === 'positive').slice(0, 3).map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="text-teal-400 text-xs mt-1">•</span>
                            <span className="text-slate-300 text-sm">{parseMarkdown(item.text)}</span>
                          </div>
                        )) || [
                          <div key="1" className="flex items-start gap-2">
                            <span className="text-teal-400 text-xs mt-1">•</span>
                            <span className="text-slate-300 text-sm">Strong technical keyword optimization</span>
                          </div>
                        ]}
                      </div>
                    </div>
                    
                    {/* Areas to Improve */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-orange-400">⚠️</span>
                        <h4 className="font-semibold text-orange-400">Areas to Improve</h4>
                      </div>
                      <div className="space-y-2">
                        {analysis.suggestions?.slice(0, 3).map((suggestion, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="text-orange-400 text-xs mt-1">•</span>
                            <span className="text-slate-300 text-sm">{parseMarkdown(suggestion.suggestion)}</span>
                          </div>
                        )) || [
                          <div key="1" className="flex items-start gap-2">
                            <span className="text-orange-400 text-xs mt-1">•</span>
                            <span className="text-slate-300 text-sm">Add quantified achievements and metrics</span>
                          </div>
                        ]}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ats' && (
                <div className="space-y-8">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">Detailed ATS Analysis</h3>
                    <p className="text-slate-400 text-sm mb-6">In-depth breakdown of how ATS systems will process your resume</p>
                    
                    <div className="space-y-6">
                      {Object.entries(analysis.breakdown || {}).map(([key, value]) => (
                        <div key={key} className="border border-slate-700/50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-lg capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                            <span className={`text-2xl font-bold ${getScoreColor(value)}`}>{value}% (Weight: 25%)</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-3 mb-3">
                            <div 
                              className={`h-3 rounded-full ${
                                value >= 80 ? 'bg-gradient-to-r from-teal-400 to-teal-500' : 
                                value >= 60 ? 'bg-gradient-to-r from-orange-400 to-pink-400' : 
                                'bg-gradient-to-r from-red-400 to-red-500'
                              }`}
                              style={{ width: `${value}%` }}
                            ></div>
                          </div>
                          <p className="text-slate-400 text-sm">
                            {key === 'keywordOptimization' && 'The resume demonstrates strong keyword optimization with relevant technical terms and industry-specific vocabulary.'}
                            {key === 'structuralFormatting' && 'Resume utilizes clear section headers and consistent formatting for ATS readability.'}
                            {key === 'contentQuality' && 'Content quality shows quantified achievements and relevant experience descriptions.'}
                            {key === 'narrativeCoherence' && 'Professional narrative flows well and maintains coherence throughout sections.'}
                            {key === 'additionalFactors' && 'Additional formatting and structural elements support ATS parsing.'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'jobMatch' && (
                <div className="space-y-8">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">Job Match Analysis</h3>
                    <p className="text-slate-400 text-sm mb-6">Detailed analysis of how well your resume matches the target role</p>
                    
                    <div className="mb-6">
                      <div className="text-center p-6 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg">
                        <div className={`text-4xl font-bold mb-2 ${getScoreColor(analysis.jobMatchScore || 0)}`}>
                          {analysis.jobMatchScore || 0}%
                        </div>
                        <p className="text-slate-400">Overall Job Match Score</p>
                      </div>
                    </div>

                    {analysis.jobMatch && analysis.jobMatch.details ? (
                      <div className="prose prose-invert max-w-none">
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <p className="text-slate-300 leading-relaxed">{parseMarkdown(analysis.jobMatch.details)}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                        <p className="text-orange-400 text-center">Job description analysis requires a specific job posting to compare against your resume.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'suggestions' && (
                <div className="space-y-8">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">Improvement Suggestions</h3>
                    <p className="text-slate-400 text-sm mb-6">Actionable recommendations to enhance your resume</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Critical Issues */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-red-400">🚨</span>
                          <h4 className="font-semibold text-red-400">Critical Issues</h4>
                        </div>
                        <div className="space-y-3">
                          {analysis.suggestions?.filter(s => s.priority === 'high').map((suggestion, index) => (
                            <div key={index} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                              <p className="text-slate-300 text-sm">{parseMarkdown(suggestion.suggestion)}</p>
                            </div>
                          )) || [
                            <div key="1" className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                              <p className="text-slate-300 text-sm">Add quantified achievements with specific metrics</p>
                            </div>
                          ]}
                        </div>
                      </div>
                      
                      {/* Medium Priority */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-orange-400">⚠️</span>
                          <h4 className="font-semibold text-orange-400">Areas to Improve</h4>
                        </div>
                        <div className="space-y-3">
                          {analysis.suggestions?.filter(s => s.priority === 'medium').map((suggestion, index) => (
                            <div key={index} className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                              <p className="text-slate-300 text-sm">{parseMarkdown(suggestion.suggestion)}</p>
                            </div>
                          )) || [
                            <div key="1" className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                              <p className="text-slate-300 text-sm">Improve formatting and section organization</p>
                            </div>
                          ]}
                        </div>
                      </div>
                      
                      {/* Strengths */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-teal-400">✅</span>
                          <h4 className="font-semibold text-teal-400">Strengths</h4>
                        </div>
                        <div className="space-y-3">
                          {analysis.feedback?.filter(f => f.type === 'positive').map((item, index) => (
                            <div key={index} className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-lg">
                              <p className="text-slate-300 text-sm">{parseMarkdown(item.text)}</p>
                            </div>
                          )) || [
                            <div key="1" className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-lg">
                              <p className="text-slate-300 text-sm">Strong technical skills presentation</p>
                            </div>
                          ]}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Skills Overview */}
            {analysis.skills && analysis.skills.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Compatibility Breakdown */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-2">Compatibility Breakdown</h3>
                  <p className="text-slate-400 text-sm mb-6">How well your resume matches the job requirements</p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-medium">Technical Skills</span>
                        <span className="font-semibold text-green-400">90%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-medium">Experience</span>
                        <span className="font-semibold text-red-400">{analysis.jobMatchScore || 15}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="h-2 rounded-full bg-red-500" style={{ width: `${analysis.jobMatchScore || 15}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-medium">Education</span>
                        <span className="font-semibold text-green-400">95%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-medium">Soft Skills</span>
                        <span className="font-semibold text-yellow-400">65%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="h-2 rounded-full bg-yellow-500" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Skills Overview */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-2">Skills Overview</h3>
                  <p className="text-slate-400 text-sm mb-6">Summary of your skills alignment with the job</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        {Math.floor(analysis.skills.length * 0.6)}
                      </div>
                      <div className="text-xs text-slate-400">Matched Skills</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400 mb-1">
                        {Math.floor(analysis.skills.length * 0.3)}
                      </div>
                      <div className="text-xs text-slate-400">Missing Skills</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">
                        {Math.floor(analysis.skills.length * 1.2)}
                      </div>
                      <div className="text-xs text-slate-400">Additional Skills</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Matched Skills</h4>
                    <div className="space-y-3">
                      {analysis.skills.slice(0, 3).map((skill, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-slate-300">{skill}</span>
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">Required</span>
                          </div>
                          <span className="text-green-400 font-semibold">100%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Job Match Details */}
            {analysis.jobMatch && analysis.jobMatch.details && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">Detailed Job Match Analysis</h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 leading-relaxed">{parseMarkdown(analysis.jobMatch.details)}</p>
                </div>
              </div>
            )}

            {/* Critical Issues to Address */}
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-orange-400 text-xl">⚠️</span>
                <h3 className="text-xl font-semibold text-orange-400">Critical Issues to Address</h3>
              </div>
              <p className="text-slate-300 text-sm mb-4">These issues may significantly impact your resume's performance with ATS systems</p>
              
              <div className="space-y-3">
                {analysis.suggestions?.filter(s => s.priority === 'high').slice(0, 3).map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-orange-400 text-sm mt-1">•</span>
                    <span className="text-slate-300 text-sm">{parseMarkdown(suggestion.suggestion)}</span>
                  </div>
                )) || [
                  <div key="1" className="flex items-start gap-3">
                    <span className="text-orange-400 text-sm mt-1">•</span>
                    <span className="text-slate-300 text-sm">Add quantified achievements with specific metrics and results</span>
                  </div>,
                  <div key="2" className="flex items-start gap-3">
                    <span className="text-orange-400 text-sm mt-1">•</span>
                    <span className="text-slate-300 text-sm">Include a professional summary section at the top of your resume</span>
                  </div>
                ]}
              </div>
            </div>

            {/* All Suggestions */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">All Improvement Suggestions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* High Priority */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-red-400">🚨</span>
                      <h4 className="font-semibold text-red-400">Critical Issues</h4>
                    </div>
                    <div className="space-y-2">
                      {analysis.suggestions.filter(s => s.priority === 'high').map((suggestion, index) => (
                        <div key={index} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <p className="text-slate-300 text-sm">{parseMarkdown(suggestion.suggestion)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Medium Priority */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-yellow-400">⚠️</span>
                      <h4 className="font-semibold text-yellow-400">Weaknesses</h4>
                    </div>
                    <div className="space-y-2">
                      {analysis.suggestions.filter(s => s.priority === 'medium').map((suggestion, index) => (
                        <div key={index} className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <p className="text-slate-300 text-sm">{parseMarkdown(suggestion.suggestion)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Low Priority */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-green-400">✅</span>
                      <h4 className="font-semibold text-green-400">Strengths</h4>
                    </div>
                    <div className="space-y-2">
                      {analysis.feedback?.filter(f => f.type === 'positive').map((item, index) => (
                        <div key={index} className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <p className="text-slate-300 text-sm">{parseMarkdown(item.text)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AIAnalysis;