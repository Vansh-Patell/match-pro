import React, { useState, useEffect } from 'react';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200' 
          : 'bg-transparent'
      }`}>
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-black">Match-Pro</div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-black transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-black transition-colors">How It Works</a>
            <a href="#about" className="text-gray-600 hover:text-black transition-colors">About</a>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-black transition-colors px-4 py-2">
              Sign In
            </button>
            <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Land Your{' '}
                  <span className="text-gray-500">Dream Job</span>{' '}
                  with AI-Powered Resume Optimization
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Stop sending generic resumes. Our AI analyzes job descriptions, optimizes your resume with the right keywords, and ranks your match score in real-time.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-black text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors">
                  Optimize My Resume
                </button>
                <button className="border border-gray-300 text-black px-8 py-4 rounded-lg text-lg font-medium hover:border-gray-400 transition-colors">
                  See How It Works
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
                <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-8 w-80 h-96 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  {/* AI Badge */}
                  <div className="absolute -top-3 -right-3 bg-black text-white text-xs px-3 py-1 rounded-full font-medium">
                    AI Optimized
                  </div>
                  
                  {/* Resume Content Mockup */}
                  <div className="space-y-4">
                    <div className="h-6 bg-black rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    </div>
                    
                    <div className="pt-4">
                      <div className="h-4 bg-gray-800 rounded w-1/2 mb-3"></div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-300 rounded w-full"></div>
                        <div className="h-2 bg-gray-300 rounded w-11/12"></div>
                        <div className="h-2 bg-gray-300 rounded w-4/5"></div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="h-4 bg-gray-600 rounded w-2/3 mb-3"></div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-300 rounded w-5/6"></div>
                        <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -left-4 bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium">
                  Match Score: 94%
                </div>
                <div className="absolute -bottom-4 -right-4 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">
                  Keywords: +12
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Why Choose Match-Pro?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI technology that understands both your resume and job requirements to maximize your chances of success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-black rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">AI Resume Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced NLP algorithms analyze your resume and suggest improvements for keywords, phrasing, and formatting to match industry standards.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-black rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M target M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Job Match Scoring</h3>
              <p className="text-gray-600 leading-relaxed">
                Get real-time compatibility scores between your resume and job descriptions. Know exactly where you stand before applying.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-black rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Instant Optimization</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload your resume and paste any job description. Get optimized suggestions in seconds, not hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Four simple steps to transform your resume and boost your job search success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
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
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-black text-white rounded-full mx-auto mb-6 flex items-center justify-center text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Join professionals who've revolutionized their job search with AI-powered resume optimization. Stand out from the competition and land interviews faster.
          </p>
          <button className="bg-white text-black px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors">
            Start Optimizing Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-2xl font-bold text-black">Match-Pro</div>
            <div className="flex space-x-8 text-sm text-gray-600">
              <a href="#" className="hover:text-black transition-colors">Privacy</a>
              <a href="#" className="hover:text-black transition-colors">Terms</a>
              <a href="#" className="hover:text-black transition-colors">Support</a>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 Match-Pro. Built with AI for the future of work.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;