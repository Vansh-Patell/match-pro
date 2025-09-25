import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const ResumeUpload = ({ onBack, onAnalyzeFile }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('text');
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer?.files || e.target?.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Please upload a PDF, DOC, or DOCX file');
        return;
      }
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
      setUploadError('');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setUploadError('Please select a resume file');
      return;
    }

    if (!user) {
      setUploadError('Please sign in to upload your resume');
      return;
    }

    // Check if we have job description data
    const jobData = activeTab === 'text' ? jobDescription.trim() : jobUrl.trim();
    if (!jobData) {
      setUploadError('Please provide a job description or URL');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);
      formData.append('jobDescriptions', JSON.stringify([jobData]));
      formData.append('jobType', activeTab); // 'text' or 'url'

      // Get user token for authentication
      const token = await user.getIdToken();

      const response = await axios.post('http://localhost:5000/api/upload/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Upload successful:', response.data);
      setUploadSuccess(true);
      
      // Show success toast
      if (window.showToast) {
        window.showToast('Resume uploaded successfully! Starting analysis...', 'success');
      }
      
      // Auto-navigate to analysis after successful upload
      const uploadedFile = {
        fileKey: response.data.fileKey,
        fileName: selectedFile.name,
        jobDescription: jobDescription || '',
        uploadedAt: new Date().toISOString()
      };
      
      setTimeout(() => {
        if (onAnalyzeFile) {
          onAnalyzeFile(uploadedFile);
        }
      }, 1500); // Give time for toast to show
      
      // Reset form after navigation
      setTimeout(() => {
        setSelectedFile(null);
        setJobDescription('');
        setJobUrl('');
        setUploadSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage = error.response?.data?.error || 'Upload failed. Please try again.';
      setUploadError(errorMessage);
      
      // Show error toast
      if (window.showToast) {
        window.showToast(errorMessage, 'error');
      }
    } finally {
      setIsUploading(false);
    }
  };

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
            <div className="text-2xl font-display font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
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
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">
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
            <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center">
              <svg className="w-7 h-7 text-orange-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Your Resume
            </h3>
            
            {/* File Drop Zone */}
            <div 
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer group transition-all ${
                dragActive 
                  ? 'border-orange-400 bg-orange-500/10' 
                  : selectedFile
                    ? 'border-green-400 bg-green-500/10'
                    : 'border-slate-500 hover:border-orange-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleDrop}
                className="hidden"
              />
              
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                    selectedFile 
                      ? 'bg-green-500/20 group-hover:bg-green-500/30' 
                      : 'bg-orange-500/20 group-hover:bg-orange-500/30'
                  }`}>
                    {selectedFile ? (
                      <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  {selectedFile ? (
                    <>
                      <p className="text-lg font-semibold text-green-400 mb-2">✓ {selectedFile.name}</p>
                      <p className="text-gray-400">File ready for upload • Click to change</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-semibold text-white mb-2">Drop your resume here, or click to browse</p>
                      <p className="text-gray-400">Supports PDF, DOC, DOCX files up to 10MB</p>
                    </>
                  )}
                </div>
                <button 
                  type="button"
                  className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg ${
                    selectedFile
                      ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white'
                      : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white'
                  }`}
                >
                  {selectedFile ? 'Change File' : 'Choose File'}
                </button>
              </div>
            </div>
          </div>

          {/* Job Description Input */}
          <div className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center">
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

          {/* Error Message */}
          {uploadError && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400 text-center">
              {uploadError}
            </div>
          )}

          {/* Success Message */}
          {uploadSuccess && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-400 text-center">
              ✓ Resume uploaded successfully! Analysis in progress...
            </div>
          )}

          {/* Analyze Button */}
          <div className="text-center">
            <button 
              onClick={handleAnalyze}
              disabled={isUploading || !selectedFile}
              className="bg-gradient-to-r from-orange-500 via-pink-500 to-teal-500 hover:from-orange-600 hover:via-pink-600 hover:to-teal-600 text-white px-12 py-4 rounded-xl text-xl font-bold transition-all hover:scale-105 shadow-2xl hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center">
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Analyze Resume
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeUpload;