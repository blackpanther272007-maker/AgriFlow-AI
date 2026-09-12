import axios from 'axios';
import { isDemoMode, STORAGE_KEY_TOKEN, STORAGE_KEY_USER } from './config';
import { handleDemoRequest } from './demo/demoApi';
import { seedDemoData } from './demo/demoData';

let rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
rawBaseUrl = rawBaseUrl.trim().replace(/\/+$/, '');
const baseURL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;

const api = axios.create({
  baseURL,
});

if (isDemoMode) {
  // Ensure seed data exists
  seedDemoData();

  api.interceptors.request.use(async (config) => {
    config.adapter = async (reqConfig) => {
      return await handleDemoRequest(reqConfig);
    };
    return config;
  });
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const originalRequest = error.config;
      // Do not trigger global unauthorized for login requests
      if (originalRequest.url !== '/auth/login' && originalRequest.url !== '/auth/google') {
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_USER);
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
