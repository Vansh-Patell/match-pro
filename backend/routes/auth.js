const express = require('express');
const { verifyFirebaseToken } = require('../middleware/auth');
const { auth, firestore } = require('../lib/firebase-admin');

const router = express.Router();

/**
 * POST /api/auth/verify
 * Verify user token and return user info
 */
router.post('/verify', verifyFirebaseToken, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
      message: 'Token verified successfully'
    });
  } catch (error) {
    console.error('Error in token verification:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to verify token'
    });
  }
});

/**
 * POST /api/auth/create-user
 * Create user profile in Firestore after authentication
 */
router.post('/create-user', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user;
    
    // Check if user already exists
    const userDoc = await firestore.collection('users').doc(uid).get();
    
    if (userDoc.exists) {
      return res.json({
        success: true,
        user: userDoc.data(),
        message: 'User already exists'
      });
    }

    // Create new user profile
    const userData = {
      uid,
      email,
      name,
      picture,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      subscription: 'free', // Default subscription
      resumesOptimized: 0,
      matchScores: [],
    };

    await firestore.collection('users').doc(uid).set(userData);

    res.json({
      success: true,
      user: userData,
      message: 'User profile created successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to create user profile'
    });
  }
});

/**
 * GET /api/auth/user
 * Get current user profile
 */
router.get('/user', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;
    
    const userDoc = await firestore.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'User profile not found in database'
      });
    }

    res.json({
      success: true,
      user: userDoc.data()
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to fetch user profile'
    });
  }
});

/**
 * PUT /api/auth/user
 * Update user profile
 */
router.put('/user', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const updates = req.body;
    
    // Remove sensitive fields that shouldn't be updated directly
    delete updates.uid;
    delete updates.createdAt;
    delete updates.email;

    // Add last updated timestamp
    updates.updatedAt = new Date().toISOString();

    await firestore.collection('users').doc(uid).update(updates);

    res.json({
      success: true,
      message: 'User profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to update user profile'
    });
  }
});

/**
 * DELETE /api/auth/user
 * Delete user account (both Firebase Auth and Firestore)
 */
router.delete('/user', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;
    
    // Delete from Firestore
    await firestore.collection('users').doc(uid).delete();
    
    // Delete from Firebase Auth
    await auth.deleteUser(uid);

    res.json({
      success: true,
      message: 'User account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to delete user account'
    });
  }
});

module.exports = router;