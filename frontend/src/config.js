// Configuration and Mode Detection
export const isDemoMode = import.meta.env.VITE_APP_MODE === 'demo';
export const STORAGE_KEY_TOKEN = isDemoMode ? 'farmflow_demo_token' : 'token';
export const STORAGE_KEY_USER = isDemoMode ? 'farmflow_demo_user' : 'user';
