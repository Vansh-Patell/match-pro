import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ResumeUpload from './ResumeUpload';
import MyAnalytics from './MyAnalytics';
import AIAnalysis from './AIAnalysis';

const MainPage = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleUploadResume = () => {
    setCurrentView('upload');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedFile(null);
  };

  const handleAnalyzeFile = (file) => {
    setSelectedFile(file);
    setCurrentView('aiAnalysis');
  };

  const handleBackToAnalytics = () => {
    setCurrentView('analytics');
    setSelectedFile(null);
  };

  if (currentView === 'upload') {
    return <ResumeUpload onBack={handleBackToDashboard} onAnalyzeFile={handleAnalyzeFile} />;
  }

  if (currentView === 'analytics') {
    return (
      <MyAnalytics 
        onBack={handleBackToDashboard} 
        onNavigateToUpload={() => setCurrentView('upload')}
        onAnalyzeFile={handleAnalyzeFile}
      />
    );
  }

  if (currentView === 'aiAnalysis' && selectedFile) {
    return (
      <AIAnalysis 
        file={selectedFile}
        onBack={handleBackToAnalytics}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800/95 backdrop-blur-xl border-b border-slate-700 shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-display font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
            Match-Pro
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
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white transition-colors px-4 py-2 hover:bg-slate-700 rounded-lg"
            >
              Sign Out
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">
            Welcome back, {user?.displayName?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Ready to optimize your resume and land your dream job? Let's get started with your job matching journey.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Upload Resume Card */}
          <div 
            onClick={handleUploadResume}
            className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 hover:shadow-xl transition-all cursor-pointer group hover:border-orange-400 shadow-md hover:bg-slate-700/70"
          >
            <div className="text-orange-400 mb-6">
              <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-2xl font-display font-bold mb-3 group-hover:text-orange-300 transition-colors text-white">Upload Resume</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">Upload your current resume to get started with AI-powered optimization and detailed analysis.</p>
            <div className="text-orange-400 font-semibold hover:text-orange-300 flex items-center">
              Get Started 
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Optimization History Card */}
          <div 
            onClick={() => setCurrentView('analytics')}
            className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 hover:shadow-xl transition-all cursor-pointer group hover:border-teal-400 shadow-md hover:bg-slate-700/70"
          >
            <div className="text-teal-400 mb-6">
              <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-display font-bold mb-3 group-hover:text-teal-300 transition-colors text-white">My Analytics</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">View your resume optimization history and track your improvement progress over time.</p>
            <div className="text-teal-400 font-semibold hover:text-teal-300 flex items-center">
              View History 
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-10 mb-16 shadow-md">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Your Match-Pro Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-3xl font-bold text-orange-400">0</span>
              </div>
              <div className="text-white font-semibold text-lg">Resumes Optimized</div>
              <div className="text-gray-300 text-sm mt-1">Get started with your first upload</div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-3xl font-bold text-teal-400">0</span>
              </div>
              <div className="text-white font-semibold text-lg">Jobs Matched</div>
              <div className="text-gray-300 text-sm mt-1">Find your perfect role</div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-3xl font-bold text-pink-400">0%</span>
              </div>
              <div className="text-white font-semibold text-lg">Success Rate</div>
              <div className="text-gray-300 text-sm mt-1">Track your improvement</div>
            </div>
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-3xl p-12 shadow-xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-400/30 backdrop-blur-sm font-medium text-sm mb-8">
              <div className="w-2 h-2 bg-lime-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
                Your Resume Optimization Journey
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black mb-6 text-white">Getting Started</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">Transform your resume from good to exceptional with our AI-powered optimization process</p>
          </div>

          <div className="space-y-8">
            {[
              {
                number: "1",
                title: "Upload your resume file",
                description: "Choose your PDF or Word document to get started",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                ),
                color: "blue"
              },
              {
                number: "2", 
                title: "AI analyzes your resume",
                description: "Our system checks for improvements and compatibility",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                color: "teal"
              },
              {
                number: "3",
                title: "Review improvement tips", 
                description: "See what changes will make your resume better",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                color: "orange"
              },
              {
                number: "4",
                title: "Get your improved resume",
                description: "We create a better version based on our analysis",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                color: "pink"
              },
              {
                number: "5",
                title: "Download your new resume",
                description: "Save your updated resume in PDF or other formats",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                color: "teal"
              }
            ].map((step, index) => (
              <div key={index} className="relative group">
                <div className="flex items-start space-x-8 p-6 rounded-2xl hover:bg-slate-600/50 transition-all duration-300">
                  <div className={`flex-shrink-0 w-20 h-20 ${
                    step.color === 'orange' 
                      ? 'bg-gradient-to-br from-orange-400/30 to-orange-500/40 border border-orange-400/50' 
                      : step.color === 'teal' 
                        ? 'bg-gradient-to-br from-teal-400/30 to-teal-500/40 border border-teal-400/50'
                        : 'bg-gradient-to-br from-pink-400/30 to-pink-500/40 border border-pink-400/50'
                  } ${
                    step.color === 'orange' 
                      ? 'text-orange-300' 
                      : step.color === 'teal' 
                        ? 'text-teal-300'
                        : 'text-pink-300'
                  } rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform backdrop-blur-sm`}>
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-300 transition-colors">{step.title}</h3>
                    <p className="text-gray-300 text-lg leading-relaxed">{step.description}</p>
                  </div>
                </div>
                {index < 4 && (
                  <div className="hidden lg:block absolute left-16 top-28 w-0.5 h-12 bg-gradient-to-b from-slate-400/50 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;