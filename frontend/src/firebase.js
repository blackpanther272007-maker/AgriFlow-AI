/**
 * AgriFlow AI - Standalone Demo Mock
 * Completely disables external Firebase initialization and credential dependencies.
 */

export const auth = {
  currentUser: {
    uid: 'user_demo_001',
    displayName: 'Ramesh Kumar',
    email: 'ramesh.farmer@agriflow.demo',
  },
  signOut: async () => {},
};

export const googleProvider = {};

export const signInWithGooglePopup = async () => {
  return auth.currentUser;
};

export const app = {};
export const analytics = null;

export default app;
