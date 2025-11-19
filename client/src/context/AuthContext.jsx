import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as loginApi, signup as signupApi } from '../api/authApi';

const AuthContext = createContext();

/**
 * Provides authentication state and helper functions to the app.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load persisted auth details from localStorage on first render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const persistAuth = (userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenValue);
  };

  const login = async (credentials) => {
    const { data } = await loginApi(credentials);
    persistAuth(data.user, data.token);
    return data;
  };

  const signup = async (payload) => {
    const { data } = await signupApi(payload);
    persistAuth(data.user, data.token);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
