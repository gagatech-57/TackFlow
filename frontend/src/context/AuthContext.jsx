import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('taskflow_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('taskflow_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          setUser(res.data.user);
          setToken(storedToken);
        } catch (err) {
          console.error('Failed to restore session:', err);
          localStorage.removeItem('taskflow_token');
          localStorage.removeItem('taskflow_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const credentials = typeof email === 'object' ? email : { email, password };
      const res = await authService.login(credentials);
      const { user: userData, token: jwtToken } = res.data;

      localStorage.setItem('taskflow_token', jwtToken);
      localStorage.setItem('taskflow_user', JSON.stringify(userData));
      setUser(userData);
      setToken(jwtToken);
      return { success: true, data: res.data };
    } catch (err) {
      console.error('AuthContext login error:', err);
      return {
        success: false,
        message: err.message || 'Invalid email or password.'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const payload = typeof name === 'object' ? name : { name, email, password };
      const res = await authService.register(payload);
      const { user: userData, token: jwtToken } = res.data;

      localStorage.setItem('taskflow_token', jwtToken);
      localStorage.setItem('taskflow_user', JSON.stringify(userData));
      setUser(userData);
      setToken(jwtToken);
      return { success: true, data: res.data };
    } catch (err) {
      console.error('AuthContext register error:', err);
      return {
        success: false,
        message: err.message || 'Registration failed.'
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Ignore network error on logout
    } finally {
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
