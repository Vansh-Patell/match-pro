const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  let credential;
  
  // Method 1: Use service account JSON file if it exists
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const serviceAccountPath = path.resolve(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    credential = admin.credential.cert(serviceAccountPath);
  } 
  // Otherwise, use individual environment variables
  else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    });
  } 
  // Error: No valid configuration found
  else {
    throw new Error(
      'Firebase Admin SDK configuration missing. Please set either:\n' +
      '1. FIREBASE_SERVICE_ACCOUNT_PATH (recommended), or\n' +
      '2. FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY\n' +
      'See .env.example for setup instructions.'
    );
  }

  admin.initializeApp({
    credential: credential,
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID || require(path.resolve(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_PATH)).project_id}.firebaseio.com`,
  });
}

const auth = admin.auth();
const firestore = admin.firestore();

module.exports = {
  admin,
  auth,
  firestore,
};