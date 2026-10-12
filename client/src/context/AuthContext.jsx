import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to fetch current user, or login as default demo athlete
    async function initAuth() {
      try {
        const token = api.getToken();
        if (token) {
          const res = await api.getMe();
          setUser(res.user);
        } else {
          // Auto login as default demo user for instant interactive testing
          const res = await api.login('alex@apexmetrics.io', 'apex1234');
          setUser(res.user);
        }
      } catch (err) {
        console.warn('Auto-login failed, falling back to manual auth', err);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    setUser(res.user);
    return res.user;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const res = await api.updateProfile(updates);
    setUser(res.user);
    return res.user;
  };

  const connectStrava = async () => {
    const res = await api.connectStrava();
    setUser(prev => ({ ...prev, stravaLinked: true }));
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, updateProfile, connectStrava }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
