import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const MainPage = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Match-Pro
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img
                src={user?.photoURL || '/default-avatar.png'}
                alt={user?.displayName || 'User'}
                className="w-8 h-8 rounded-full border-2 border-slate-600"
              />
              <span className="text-white text-sm hidden sm:block">
                {user?.displayName || user?.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white transition-colors px-4 py-2 hover:bg-slate-800 rounded-lg"
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Welcome back, {user?.displayName?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Ready to optimize your resume and land your dream job? Let's get started with your job matching journey.
          </p>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-xl">
              🚀 Upload New Resume
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 text-gray-300 border-2 border-slate-600 hover:border-slate-500 px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-xl">
              📊 View Analytics
            </button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Upload Resume Card */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/70 transition-all cursor-pointer group hover:border-blue-400">
            <div className="text-blue-400 mb-6">
              <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors text-white">Upload Resume</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">Upload your current resume to get started with AI-powered optimization and detailed analysis.</p>
            <button className="text-blue-400 font-semibold hover:text-blue-300 flex items-center">
              Get Started 
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Optimization History Card */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/70 transition-all cursor-pointer group hover:border-purple-400">
            <div className="text-purple-400 mb-6">
              <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors text-white">My Progress</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">View your resume optimization history and track your improvement progress over time.</p>
            <button className="text-purple-400 font-semibold hover:text-purple-300 flex items-center">
              View History 
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-10 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Your Match-Pro Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-blue-400">0</span>
              </div>
              <div className="text-white font-semibold text-lg">Resumes Optimized</div>
              <div className="text-gray-400 text-sm mt-1">Get started with your first upload</div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-green-400">0</span>
              </div>
              <div className="text-white font-semibold text-lg">Jobs Matched</div>
              <div className="text-gray-400 text-sm mt-1">Find your perfect role</div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-purple-400">0%</span>
              </div>
              <div className="text-white font-semibold text-lg">Success Rate</div>
              <div className="text-gray-400 text-sm mt-1">Track your improvement</div>
            </div>
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">Getting Started</h2>
            <p className="text-gray-400 text-lg">Easy steps to improve your resume with Match-Pro</p>
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
                color: "green"
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
                color: "yellow"
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
                color: "purple"
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
                color: "indigo"
              }
            ].map((step, index) => (
              <div key={index} className="flex items-center space-x-6 group">
                <div className={`flex-shrink-0 w-16 h-16 bg-${step.color}-500/20 text-${step.color}-400 rounded-full flex items-center justify-center font-bold text-xl border-2 border-${step.color}-500/30`}>
                  {step.number}
                </div>
                <div className={`flex-shrink-0 w-12 h-12 bg-${step.color}-500/20 text-${step.color}-400 rounded-lg flex items-center justify-center`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {index < 4 && (
                  <div className="hidden md:block absolute left-8 mt-20 w-0.5 h-8 bg-slate-600"></div>
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