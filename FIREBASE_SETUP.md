# Firebase Setup Instructions

## Quick Fix Applied ✅
I've created a temporary `.env.local` file with placeholder values to stop the immediate error. Your app should now load without crashing.

## Next Steps - Set Up Your Firebase Project

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" (or select existing)
3. Enter project name (e.g., "match-pro")
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Set Up Web App
1. In your Firebase project dashboard, click the **Web icon** (`</>`)
2. Enter app nickname (e.g., "Match Pro Web")
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"

### 3. Get Configuration Values
You'll see something like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-ABC123DEF"
};
```

### 4. Update Environment Variables
1. Open `/frontend/.env.local`
2. Replace the placeholder values with your real Firebase config:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB_your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123DEF
```

### 5. Enable Google Authentication
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on **Google** provider
3. Enable it
4. Set support email
5. Click "Save"

### 6. Set Up Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" for now
4. Select your preferred location
5. Click "Done"

### 7. Backend Configuration (Optional)
If you plan to use the backend server:
1. Go to **Project Settings** > **Service accounts**
2. Click "Generate new private key"
3. Download the JSON file
4. Place it in `/backend/` folder
5. Update `/backend/.env` with the path

### 8. Restart Your Development Server
```bash
cd frontend
npm run dev
```

## Security Notes
- Never commit `.env.local` to git (it's already in .gitignore)
- Keep your Firebase keys secure
- Set up proper Firestore security rules before going to production

## Testing
Once set up, you should be able to:
- ✅ Load the app without errors
- ✅ See Firebase authentication working
- ✅ Sign in with Google
- ✅ Backend API integration (if configured)

## Need Help?
If you encounter issues:
1. Check the browser console for specific error messages
2. Verify all environment variables are set correctly
3. Make sure Firebase project settings match your domain
4. Ensure Google Auth is enabled in Firebase Console