import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ResumeUpload = ({ onBack }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('text');
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800/95 backdrop-blur-xl border-b border-slate-700 shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
              Match-Pro
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img
                src={user?.photoURL || '/default-avatar.png'}
                alt={user?.displayName || 'User'}
                className="w-8 h-8 rounded-full border-2 border-gray-300"
              />
              <span className="text-gray-300 text-sm hidden sm:block">
                {user?.displayName || user?.email}
              </span>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Resume Analyzer
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Upload your resume and provide a job description to get AI-powered optimization recommendations.
          </p>
        </div>

        {/* Resume Upload & Job Description Section */}
        <div className="space-y-8 mb-16">
          {/* Resume Upload */}
          <div className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg className="w-7 h-7 text-orange-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Your Resume
            </h3>
            
            {/* File Drop Zone */}
            <div className="border-2 border-dashed border-slate-500 rounded-xl p-12 text-center hover:border-orange-400 transition-colors cursor-pointer group">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                    <svg className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold text-white mb-2">Drop your resume here, or click to browse</p>
                  <p className="text-gray-400">Supports PDF, DOC, DOCX files up to 10MB</p>
                </div>
                <button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg">
                  Choose File
                </button>
              </div>
            </div>
          </div>

          {/* Job Description Input */}
          <div className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg className="w-7 h-7 text-teal-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              Job Description or URL
            </h3>
            
            {/* Input Tabs */}
            <div className="flex space-x-1 mb-6 bg-slate-600/50 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('text')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                  activeTab === 'text' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-slate-500/50'
                }`}
              >
                Paste Text
              </button>
              <button 
                onClick={() => setActiveTab('url')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                  activeTab === 'url' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-slate-500/50'
                }`}
              >
                Job URL
              </button>
            </div>
            
            {/* Text Area or URL Input */}
            {activeTab === 'text' ? (
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-40 bg-slate-600/50 border border-slate-500 rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20 transition-all"
              />
            ) : (
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://example.com/job-posting"
                className="w-full bg-slate-600/50 border border-slate-500 rounded-lg p-4 text-white placeholder-gray-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20 transition-all"
              />
            )}
            
            <div className="mt-4 text-sm text-gray-400">
              {activeTab === 'text' 
                ? 'Tip: Include the full job description with requirements, skills, and qualifications for best results.'
                : 'Tip: Paste the direct URL to the job posting for automatic extraction.'
              }
            </div>
          </div>

          {/* Analyze Button */}
          <div className="text-center">
            <button className="bg-gradient-to-r from-orange-500 via-pink-500 to-teal-500 hover:from-orange-600 hover:via-pink-600 hover:to-teal-600 text-white px-12 py-4 rounded-xl text-xl font-bold transition-all hover:scale-105 shadow-2xl hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed">
              <span className="flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Analyze Resume
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeUpload;