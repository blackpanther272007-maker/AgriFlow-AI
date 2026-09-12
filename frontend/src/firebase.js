import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { isDemoMode } from "./config";

let app = null;
let auth = null;
let googleProvider = null;
let analytics = null;

if (!isDemoMode) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };

  // Initialize Firebase App
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

  // Initialize Auth & Google Provider
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });

  // Initialize Analytics if supported
  if (typeof window !== "undefined") {
    isSupported().then(yes => {
      if (yes) {
        analytics = getAnalytics(app);
      }
    }).catch(() => {});
  }
}

export const signInWithGoogle = async () => {
  if (isDemoMode) return null;
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export { app, auth, googleProvider, analytics };
export default app;
