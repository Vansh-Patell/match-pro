import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const MyProgress = ({ onBack }) => {
  const { user } = useAuth();

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
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            My Analytics
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Track your resume optimization journey and view your analysis history.
          </p>
        </div>

        {/* Coming Soon Placeholder */}
        <div className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-16 text-center shadow-lg">
          <div className="space-y-6">
            <div className="w-24 h-24 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-12 h-12 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Coming Soon</h2>
              <p className="text-gray-300 text-lg max-w-md mx-auto mb-8">
                This section will display your uploaded resumes, analysis results, and progress tracking once you start using the resume analyzer.
              </p>
              <div className="text-sm text-gray-400 bg-slate-600/30 rounded-lg p-4 max-w-md mx-auto">
                <strong>Future Features:</strong><br />
                • View all uploaded resumes<br />
                • Analysis history and scores<br />
                • Progress tracking over time<br />
                • Download optimized versions
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyProgress;