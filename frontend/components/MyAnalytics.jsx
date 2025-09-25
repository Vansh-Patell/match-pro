import React, { useState, useEffect } from 'react';
import { uploadAPI } from '../lib/api';

const MyAnalytics = ({ onBack, onNavigateToUpload, onAnalyzeFile }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyzingFiles, setAnalyzingFiles] = useState(new Set());

  useEffect(() => {
    fetchFiles();
    // Clear analyzing states when component mounts
    setAnalyzingFiles(new Set());
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      console.log('Fetching files...');
      const response = await uploadAPI.getUserFiles();
      console.log('API response:', response);
      setFiles(response.files || []);
    } catch (err) {
      console.error('Error fetching files:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        response: err.response
      });
      setError(`Failed to load your files: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileKey) => {
    try {
      await uploadAPI.deleteFile(fileKey);
      setFiles(files.filter(file => file.fileKey !== fileKey));
    } catch (err) {
      console.error('Error deleting file:', err);
      alert('Failed to delete file');
    }
  };

  const handleAnalyzeFile = (file) => {
    // Add file to analyzing state
    setAnalyzingFiles(prev => new Set([...prev, file.fileKey]));
    
    if (onAnalyzeFile) {
      onAnalyzeFile(file);
    }
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-slate-300">Loading your analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-4">Error Loading Analytics</h2>
            <p className="text-slate-300 mb-6">{error}</p>
            <button
              onClick={fetchFiles}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">
            My <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">Analytics</span>
          </h1>
          <p className="text-slate-300 text-lg">Track your resume uploads and analysis results</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Uploads</p>
                <p className="text-2xl font-bold text-orange-400">{files.length}</p>
              </div>
              <div className="text-orange-400 text-3xl">📄</div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Analyzed</p>
                <p className="text-2xl font-bold text-pink-400">{files.filter(f => f.analyzed).length}</p>
              </div>
              <div className="text-pink-400 text-3xl">🔍</div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-teal-400">
                  {files.length > 0 ? Math.round((files.filter(f => f.analyzed).length / files.length) * 100) : 0}%
                </p>
              </div>
              <div className="text-teal-400 text-3xl">📊</div>
            </div>
          </div>
        </div>

        {/* Files List */}
        {files.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-500 text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold mb-2">No files uploaded yet</h3>
            <p className="text-slate-400 mb-6">Upload your first resume to get started with analysis</p>
            <button
              onClick={onNavigateToUpload}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
            >
              Upload Resume
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold mb-6">Your Uploaded Files</h2>
            {files.map((file, index) => (
              <div
                key={file.fileKey || file.id || index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-orange-500/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-2xl">
                        {file.fileName?.endsWith('.pdf') ? '📄' : '📝'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{file.fileName || 'Unknown File'}</h3>
                        <p className="text-slate-400 text-sm">
                          Uploaded {formatDate(file.uploadedAt)} • {formatFileSize(file.fileSize || 0)}
                        </p>
                      </div>
                    </div>
                    
                    {file.jobDescription && (
                      <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
                        <p className="text-sm text-slate-300">
                          <span className="font-medium text-slate-200">Job Description:</span> {file.jobDescription}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 mt-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        file.analyzed 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {file.analyzed ? 'Analyzed' : 'Pending Analysis'}
                      </span>
                      
                      {file.matchScore && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          Match: {file.matchScore}%
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleAnalyzeFile(file)}
                      disabled={analyzingFiles.has(file.fileKey)}
                      className={`px-4 py-2 text-white text-sm rounded-lg transition-all duration-300 ${
                        analyzingFiles.has(file.fileKey)
                          ? 'bg-slate-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600'
                      }`}
                      title="Analyze with AI"
                    >
                      {analyzingFiles.has(file.fileKey) ? (
                        <>
                          <div className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-2"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>🔍 Analyze</>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file.fileKey)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete file"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAnalytics;