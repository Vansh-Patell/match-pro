import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { authAPI } from '../lib/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create or update user profile in backend
  const syncUserWithBackend = async (firebaseUser) => {
    try {
      // Create user profile if it doesn't exist
      const response = await authAPI.createUser();
      setUserProfile(response.user);
    } catch (error) {
      console.error('Error syncing user with backend:', error);
      // Continue without backend profile for now
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      await syncUserWithBackend(result.user);
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google (redirect - better for mobile)
  const signInWithGoogleRedirect = async () => {
    try {
      setLoading(true);
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google redirect:', error);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Sync with backend when user signs in
        await syncUserWithBackend(firebaseUser);
      } else {
        // Clear user profile when user signs out
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    // Check for redirect result on component mount
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          setUser(result.user);
          await syncUserWithBackend(result.user);
        }
      })
      .catch((error) => {
        console.error('Error getting redirect result:', error);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    signInWithGoogle,
    signInWithGoogleRedirect,
    logout,
    syncUserWithBackend,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};