import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = () => {
    setAuthMode('signin');
    setShowAuthModal(true);
  };

  const handleGetStarted = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

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
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50' 
          : 'bg-transparent'
      }`}>
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Match-Pro
          </div>
          
          <div className="hidden md:flex items-center space-x-12">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.photoURL || '/default-avatar.png'}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-white text-sm hidden sm:block">
                    {user.displayName || user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white transition-colors px-4 py-2"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleSignIn}
                  className="text-gray-300 hover:text-white transition-colors px-4 py-2"
                >
                  Sign In
                </button>
                <button
                  onClick={handleGetStarted}
                  className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-100 transition-all hover:scale-105"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 lg:px-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full border border-slate-700 bg-slate-800/50 text-sm text-gray-300 mb-6">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  AI-Powered Resume Optimization
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Land Your{' '}
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
                    Dream Job
                  </span>{' '}
                  with Intelligent Resume Matching
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                  Stop sending generic resumes. Our advanced AI analyzes job descriptions, optimizes your resume with the right keywords, and provides real-time match scores.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <button className="group bg-white text-black px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition-all hover:scale-105 flex items-center justify-center">
                    Go to Dashboard
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={handleGetStarted}
                    className="group bg-white text-black px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition-all hover:scale-105 flex items-center justify-center"
                  >
                    Optimize My Resume
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                )}
                <button className="border border-slate-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:border-slate-400 hover:bg-slate-800/50 transition-all">
                  Watch Demo
                </button>
              </div>

              <div className="pt-8">
                <p className="text-sm text-gray-500 mb-4">Trusted by professionals at</p>
                <div className="flex items-center space-x-8 text-gray-400">
                  <span className="font-medium">Google</span>
                  <span className="font-medium">Meta</span>
                  <span className="font-medium">Amazon</span>
                  <span className="font-medium">Microsoft</span>
                </div>
              </div>
            </div>

            {/* Resume Visual */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Main Resume Card */}
                <div className="bg-white/5 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-8 w-80 h-96 transform -rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105">
                  {/* AI Badge */}
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-medium animate-pulse">
                    AI Optimized
                  </div>
                  
                  {/* Resume Content Mockup */}
                  <div className="space-y-4">
                    <div className="h-6 bg-gradient-to-r from-white to-gray-300 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-600/50 rounded w-full"></div>
                      <div className="h-3 bg-slate-600/50 rounded w-5/6"></div>
                      <div className="h-3 bg-slate-600/50 rounded w-4/5"></div>
                    </div>
                    
                    <div className="pt-4">
                      <div className="h-4 bg-slate-300 rounded w-1/2 mb-3"></div>
                      <div className="space-y-2">
                        <div className="h-2 bg-slate-700/50 rounded w-full"></div>
                        <div className="h-2 bg-slate-700/50 rounded w-11/12"></div>
                        <div className="h-2 bg-slate-700/50 rounded w-4/5"></div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="h-4 bg-slate-400 rounded w-2/3 mb-3"></div>
                      <div className="space-y-2">
                        <div className="h-2 bg-slate-700/50 rounded w-5/6"></div>
                        <div className="h-2 bg-slate-700/50 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Stats */}
                <div className="absolute -top-6 -left-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 text-green-300 text-xs px-3 py-2 rounded-lg font-medium">
                  Match Score: 94%
                </div>
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-300 text-xs px-3 py-2 rounded-lg font-medium">
                  Keywords: +12
                </div>
                <div className="absolute top-1/2 -left-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-300 text-xs px-3 py-2 rounded-lg font-medium">
                  ATS Score: 98%
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-800/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Match-Pro?
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Advanced AI technology that understands both your resume and job requirements to maximize your chances of success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                title: "AI Resume Analysis",
                description: "Advanced NLP algorithms analyze your resume and suggest improvements for keywords, phrasing, and formatting to match industry standards."
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Job Match Scoring",
                description: "Get real-time compatibility scores between your resume and job descriptions. Know exactly where you stand before applying."
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Instant Optimization",
                description: "Upload your resume and paste any job description. Get optimized suggestions in seconds, not hours."
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 h-full transition-all duration-300 hover:border-slate-600/50 hover:bg-slate-800/70">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-6 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 via-transparent to-slate-900/50"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              How It{' '}
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Four simple steps to transform your resume and boost your job search success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Upload Your Resume",
                description: "Upload your current resume in PDF or Word format. Our AI will parse and analyze every section."
              },
              {
                step: "2", 
                title: "Paste Job Description",
                description: "Copy and paste the job description you're interested in. Our AI will identify key requirements and skills."
              },
              {
                step: "3",
                title: "Get AI Insights", 
                description: "Receive detailed feedback on missing keywords, skill gaps, and optimization suggestions tailored to the role."
              },
              {
                step: "4",
                title: "Download & Apply",
                description: "Download your optimized resume and apply with confidence, knowing you're a stronger candidate."
              }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl mx-auto flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-purple-500/50"></div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_50%)]"></div>
        
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8 relative">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            Ready to Transform Your{' '}
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Career?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            Join professionals who've revolutionized their job search with AI-powered resume optimization. Stand out from the competition and land interviews faster.
          </p>
          {user ? (
            <button className="group bg-white text-black px-10 py-5 rounded-xl text-lg font-medium hover:bg-gray-100 transition-all hover:scale-105 inline-flex items-center">
              Go to Dashboard
              <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleGetStarted}
              className="group bg-white text-black px-10 py-5 rounded-xl text-lg font-medium hover:bg-gray-100 transition-all hover:scale-105 inline-flex items-center"
            >
              Start Optimizing Now
              <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-700/50 relative">
        {/* make overlay non-interactive so links are clickable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="col-span-2">

              {/* Tech Stack */}
              <div>
                <h4 className="font-semibold text-white mb-3">Built With</h4>
                <div className="flex flex-wrap gap-3">
                  {/* React */}
                  <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700/50">
                    <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89s-.84 1.85-1.87 1.85-1.87-.82-1.87-1.85.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9s-1.17 0-1.71.03c-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03s1.17 0 1.71-.03c.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72H11.41c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.37 1.95-1.47-.84-1.63-3.05-1.01-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1.01-5.63 1.46-.84 3.45.12 5.37 1.95 1.92-1.83 3.91-2.79 5.37-1.95Z"/>
                    </svg>
                    <span className="text-sm text-gray-300">React</span>
                  </div>

                  {/* Next.js */}
                  <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700/50">
                    {/* (existing Next.js svg unchanged) */}
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.5725 0c-.1763 0-.3098.0013-.3584.0067..."></path>
                    </svg>
                    <span className="text-sm text-gray-300">Next.js</span>
                  </div>

                  {/* Tailwind */}
                  <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700/50">
                    <svg className="w-5 h-5 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C7.666,17.818,9.027,19.2,12.001,19.2c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
                    </svg>
                    <span className="text-sm text-gray-300">Tailwind</span>
                  </div>

                  {/* Node.js */}
                  <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700/50">
                    {/* (existing Node svg unchanged) */}
                    <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247..."></path>
                    </svg>
                    <span className="text-sm text-gray-300">Node.js</span>
                  </div>

                  {/* Python */}
                  <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700/50">
                    {/* (existing Python svg unchanged) */}
                    <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14.25.18l.9.2.73.26..."></path>
                    </svg>
                    <span className="text-sm text-gray-300">Python</span>
                  </div>

                  {/* AWS */}
                  <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700/50">
                    {/* (consider replacing the AWS path you had if it’s corrupted) */}
                    <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0a12 12 0 1 0 0 24A12 12 0 0 0 12 0z" opacity=".05" />
                      <path d="M19.6 15.2c-2.9 1.7-5.9 2.5-8.5 2.5-2.6 0-4.7-.8-6.1-1.5-.5-.2-.2-.8.3-.6 1.8 1.1 4.2 1.5 6.9 1.5 2.7 0 5.6-.6 8.3-2.2.5-.3.9.3.1.7zM20.7 13.4c-.4-.5-2.6-.3-3.6-.2-.3 0-.3.3-.1.5.9.2 1.8.4 2.4.8.6.4 1 .8 1.2 1.1.1.2.5.1.6-.2.1-.4.1-1-.5-2z"/>
                    </svg>
                    <span className="text-sm text-gray-300">AWS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-semibold text-white mb-4">Connect</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.562 21.8 24 17.303 24 12 24 5.373 18.627 0 12 0z" />
                    </svg>
                    <span>GitHub</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0zM7.119 20.452H3.56V9h3.559v11.452zM5.34 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zM20.452 20.452h-3.559v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.345V9h3.415v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.276 2.37 4.276 5.455v6.286z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-700/50 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Match-Pro. Built with AI for the future of work.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </div>
  );
};

export default LandingPage;