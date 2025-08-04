import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.kareira.app';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Logout the user or refresh token
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Add a method to check if backend is available
api.isBackendAvailable = true; // Default to true

// Function to ping the backend and update availability status
api.checkBackendAvailability = async () => {
  try {
    await axios.get(`${API_URL}/health`, { timeout: 3000 });
    api.isBackendAvailable = true;
    return true;
  } catch (error) {
    api.isBackendAvailable = false;
    console.warn('Backend API is not available, using localStorage fallback');
    return false;
  }
};

// Check backend availability on init
api.checkBackendAvailability();

export default api;