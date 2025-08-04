import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// API URL - make sure this matches your backend server
const API_URL = 'http://localhost:5000/api';

// Create context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [error, setError] = useState(null);
  
  // Set axios defaults
  useEffect(() => {
    if (token) {
      // Use both header formats to ensure compatibility
      axios.defaults.headers.common['x-auth-token'] = token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);
  
  // Load user data when token changes
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        // Include token in request headers
        const res = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            'x-auth-token': token,
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.data && res.data.user) {
          setUser(res.data.user);
          setError(null);
        } else {
          console.error('Invalid user data format:', res.data);
          localStorage.removeItem('token');
          setToken(null);
          setError('Invalid user data received');
        }
      } catch (err) {
        console.error('Error loading user:', err.response?.data?.message || err.message);
        localStorage.removeItem('token');
        setToken(null);
        setError('Authentication failed. Please log in again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, [token]);
  
  // Login function
  const login = async (credentials) => {
    try {
      setError(null);
      
      // Check if credentials are valid
      if (!credentials.email || !credentials.password) {
        setError('Email and password are required');
        return { success: false, error: 'Email and password are required' };
      }
      
      // Make the login request
      const res = await axios.post(`${API_URL}/auth/login`, credentials);
      
      // Check if response contains token
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      } else {
        const errorMsg = 'Invalid response from server';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      console.error('Login error:', errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };
  
  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      
      // Make the registration request
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      
      // Check if response contains token
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      } else {
        const errorMsg = 'Invalid response from server';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      console.error('Register error:', errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  };
  
  // Clear error function
  const clearError = () => {
    setError(null);
  };
  
  // Context value
  const contextValue = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    clearError
  };
  
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

// Custom hook for using auth context
export function useAuth() {
  return useContext(AuthContext);
}
