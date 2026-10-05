import { createContext, useState, useCallback } from 'react';
import { safeGet, STORAGE_KEYS, resetDemoData } from '../demo/demoStorage';

export const AuthContext = createContext();

const DEFAULT_DEMO_USER = {
  _id: 'user_demo_001',
  id: 'user_demo_001',
  name: 'Ramesh Kumar',
  email: 'ramesh.farmer@agriflow.demo',
  role: 'Farmer',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const settings = safeGet(STORAGE_KEYS.SETTINGS, null);
    return settings?.user || DEFAULT_DEMO_USER;
  });
  const [token] = useState('agriflow_demo_bearer_token');
  const [isAuthenticated] = useState(true);
  const [isLoading] = useState(false);

  const login = useCallback(async () => {
    setUser(DEFAULT_DEMO_USER);
    return DEFAULT_DEMO_USER;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setUser(DEFAULT_DEMO_USER);
    return DEFAULT_DEMO_USER;
  }, []);

  const registerWithGoogle = useCallback(async () => {
    setUser(DEFAULT_DEMO_USER);
    return DEFAULT_DEMO_USER;
  }, []);

  const register = useCallback(async () => {
    setUser(DEFAULT_DEMO_USER);
    return DEFAULT_DEMO_USER;
  }, []);

  const logout = useCallback(() => {
    if (window.confirm("You are currently in AgriFlow AI Standalone Demo Mode. Would you like to reset demo data to the initial state?")) {
      resetDemoData();
      window.location.replace('/');
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        loginWithGoogle,
        registerWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
