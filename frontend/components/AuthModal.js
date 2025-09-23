import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthModal = ({ isOpen, onClose, mode = 'signin', onModeSwitch }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, loading } = useAuth();
  const [authLoading, setAuthLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [errors, setErrors] = useState({});

  // Clear form data when mode changes
  useEffect(() => {
    setFormData({ email: '', password: '', confirmPassword: '', fullName: '' });
    setErrors({});
  }, [mode]);

  const handleGoogleAuth = async () => {
    try {
      setAuthLoading(true);
      await signInWithGoogle();
      onClose(); // Close modal on successful auth
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({ google: error.message });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setErrors({});
    
    try {
      setAuthLoading(true);
      
      if (mode === 'signup') {
        // Validation for signup - check in proper order
        if (!formData.fullName.trim()) {
          setErrors({ fullName: 'Full name is required' });
          return;
        }
        
        // 1. First check password length
        if (formData.password.length < 8) {
          setErrors({ password: 'Password must be at least 8 characters long' });
          return;
        }
        
        // 2. Then check password complexity
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#_])[A-Za-z\d@#_]+$/;
        if (!passwordRegex.test(formData.password)) {
          setErrors({ password: 'Password must contain letters, numbers, and at least one of: @, #, _' });
          return;
        }
        
        // 3. Finally check if passwords match
        if (formData.password !== formData.confirmPassword) {
          setErrors({ confirmPassword: 'Passwords do not match' });
          return;
        }
        
        await signUpWithEmail(formData.email, formData.password, formData.fullName);
      } else {
        // Sign in - only basic validation
        if (formData.password.length === 0) {
          setErrors({ password: 'Password is required' });
          return;
        }
        
        await signInWithEmail(formData.email, formData.password);
      }
      
      onClose(); // Close modal on successful auth
    } catch (error) {
      console.error('Authentication error:', error);
      
      // Clear password field on authentication error (not validation errors)
      if (mode !== 'signup') {
        setFormData(prev => ({ ...prev, password: '' }));
      }
      
      setErrors({ email: error.message });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Real-time validation
    let newErrors = { ...errors };
    
    if (name === 'password' && mode === 'signup') {
      if (value.length > 0 && value.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      } else if (value.length >= 8) {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#_])[A-Za-z\d@#_]+$/;
        if (!passwordRegex.test(value)) {
          newErrors.password = 'Password must contain letters, numbers, and at least one of: @, #, _';
        } else {
          newErrors.password = '';
        }
      } else {
        newErrors.password = '';
      }
      
      // Check confirm password match if it has value
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      } else if (formData.confirmPassword && value === formData.confirmPassword) {
        newErrors.confirmPassword = '';
      }
    }
    
    if (name === 'confirmPassword' && mode === 'signup') {
      if (value !== formData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
      } else {
        newErrors.confirmPassword = '';
      }
    }
    
    if (name === 'fullName' && mode === 'signup') {
      if (value.trim() === '') {
        newErrors.fullName = 'Full name is required';
      } else {
        newErrors.fullName = '';
      }
    }
    
    // Clear other field errors when user starts typing
    if (newErrors[name] && name !== 'password' && name !== 'confirmPassword') {
      newErrors[name] = '';
    }
    
    setErrors(newErrors);
  };

  const switchMode = (newMode) => {
    if (onModeSwitch) {
      if (mode === 'quick-signin' && newMode === 'signup') {
        onModeSwitch('signup');
      } else if (mode === 'signin' && newMode === 'signup') {
        onModeSwitch('signup');
      } else if (mode === 'signup' && newMode === 'signin') {
        onModeSwitch('signin');
      }
    }
  };

  if (!isOpen) return null;

  const getModalConfig = () => {
    switch (mode) {
      case 'signup':
        return {
          title: 'Create your account',
          subtitle: 'Join Match-Pro and start optimizing your resume',
          showFullForm: true,
          switchText: 'Already have an account?',
          switchAction: 'Sign in'
        };
      case 'quick-signin':
        return {
          title: 'Sign in to optimize',
          subtitle: 'Quick sign in to start resume optimization',
          showFullForm: false,
          switchText: 'Need an account?',
          switchAction: 'Sign up'
        };
      default: // signin
        return {
          title: 'Welcome back',
          subtitle: 'Sign in to your Match-Pro account',
          showFullForm: false,
          switchText: "Don't have an account?",
          switchAction: 'Sign up'
        };
    }
  };

  const config = getModalConfig();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-8 w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {config.title}
          </h2>
          <p className="text-gray-400">
            {config.subtitle}
          </p>
        </div>

        {/* Error Display */}
        {errors.google && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {errors.google}
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleAuth}
          disabled={authLoading || loading}
          className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 mb-6"
        >
          {authLoading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-slate-900 px-2 text-gray-400">or</span>
          </div>
        </div>

        {/* Email form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {/* Full Name - Only for signup */}
          {config.showFullForm && (
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors ${
                  errors.fullName ? 'border-red-500' : 'border-slate-600'
                }`}
                required
              />
              {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
            </div>
          )}

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors ${
                errors.email ? 'border-red-500' : 'border-slate-600'
              }`}
              required
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors ${
                errors.password ? 'border-red-500' : 'border-slate-600'
              }`}
              required
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            {mode === 'signup' && !errors.password && formData.password.length > 0 && (
              <div className="text-xs text-gray-400 mt-1">
                {formData.password.length >= 8 ? '✓' : '○'} At least 8 characters{' '}
                {/[a-zA-Z]/.test(formData.password) ? '✓' : '○'} Letters{' '}
                {/\d/.test(formData.password) ? '✓' : '○'} Numbers{' '}
                {/[@#_]/.test(formData.password) ? '✓' : '○'} Special chars (@, #, _)
              </div>
            )}
          </div>

          {/* Confirm Password - Only for signup */}
          {config.showFullForm && (
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors ${
                  errors.confirmPassword ? 'border-red-500' : 'border-slate-600'
                }`}
                required
              />
              {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={authLoading || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {authLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            ) : (
              mode === 'signup' ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          {config.switchText}{' '}
          <button 
            onClick={() => switchMode(mode === 'signin' || mode === 'quick-signin' ? 'signup' : 'signin')}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {config.switchAction}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;