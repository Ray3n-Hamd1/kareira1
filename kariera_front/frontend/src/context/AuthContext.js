import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// API URL - make sure this matches your backend server
const API_URL = "http://localhost:5000/api";

// Create context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [error, setError] = useState(null);

  // Set axios defaults
  useEffect(() => {
    if (token) {
      // Use both header formats to ensure compatibility
      axios.defaults.headers.common["x-auth-token"] = token;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
      delete axios.defaults.headers.common["Authorization"];
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
            "x-auth-token": token,
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data && res.data.user) {
          setUser(res.data.user);
          setError(null);
        } else {
          console.error("Invalid user data format:", res.data);
          localStorage.removeItem("token");
          setToken(null);
          setError("Invalid user data received");
        }
      } catch (err) {
        console.error(
          "Error loading user:",
          err.response?.data?.message || err.message
        );
        localStorage.removeItem("token");
        setToken(null);
        setError("Authentication failed. Please log in again.");
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
        setError("Email and password are required");
        return { success: false, error: "Email and password are required" };
      }

      // Make the login request
      const res = await axios.post(`${API_URL}/auth/login`, credentials);

      // Check if response contains token
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      } else {
        const errorMsg = "Invalid response from server";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      console.error("Login error:", errorMsg);
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
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      } else {
        const errorMsg = "Invalid response from server";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed";
      console.error("Register error:", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setError(null);
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Update user profile - IMPROVED VERSION
  const updateUserProfile = async (profileData) => {
    try {
      console.log("AuthContext: Sending profile update request:", profileData);

      // Ensure token exists
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await axios.put(
        `${API_URL}/users/profile`,
        profileData,
        {
          headers: {
            "x-auth-token": token,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("AuthContext: Full response:", response);
      console.log("AuthContext: Response data:", response.data);
      console.log("AuthContext: Response status:", response.status);

      // Handle successful response (200-299 status codes)
      if (response.status >= 200 && response.status < 300) {
        // Check for different possible response formats
        let updatedUser = null;
        let successMessage = "Profile updated successfully!";

        // Format 1: { success: true, user: {...}, message: "..." }
        if (response.data && response.data.success && response.data.user) {
          updatedUser = response.data.user;
          successMessage = response.data.message || successMessage;
        }
        // Format 2: { user: {...}, message: "..." }
        else if (response.data && response.data.user) {
          updatedUser = response.data.user;
          successMessage = response.data.message || successMessage;
        }
        // Format 3: Direct user object { id, name, email, ... }
        else if (
          response.data &&
          (response.data.id || response.data.email || response.data._id)
        ) {
          updatedUser = response.data;
        }
        // Format 4: { data: { user: {...} } }
        else if (
          response.data &&
          response.data.data &&
          response.data.data.user
        ) {
          updatedUser = response.data.data.user;
        }
        // Format 5: { message: "success" } - no user data returned
        else if (response.data && response.data.message) {
          successMessage = response.data.message;
          // Keep current user data, just assume it was updated
          updatedUser = { ...user, ...profileData };
        } else {
          console.warn(
            "AuthContext: Unexpected response format, treating as success:",
            response.data
          );
          // Assume success and merge the sent data with current user
          updatedUser = { ...user, ...profileData };
        }

        // Update local user state if we have user data
        if (updatedUser) {
          setUser(updatedUser);
          console.log("AuthContext: User updated successfully:", updatedUser);
        }

        return {
          success: true,
          user: updatedUser,
          message: successMessage,
        };
      }
      // Handle non-2xx status codes
      else {
        console.error("AuthContext: Non-success status code:", response.status);
        return {
          success: false,
          error: `Server returned status: ${response.status}`,
        };
      }
    } catch (error) {
      console.error("AuthContext: Error updating profile:", error);

      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("AuthContext: Response data:", error.response.data);
        console.error("AuthContext: Response status:", error.response.status);
        console.error("AuthContext: Response headers:", error.response.headers);

        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error (${error.response.status})`;

        return {
          success: false,
          error: errorMessage,
        };
      } else if (error.request) {
        // The request was made but no response was received
        console.error("AuthContext: No response received:", error.request);
        return {
          success: false,
          error: "No response from server. Please check your connection.",
        };
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("AuthContext: Request setup error:", error.message);
        return {
          success: false,
          error: error.message || "Request failed",
        };
      }
    }
  };

  // Change password - Updated for your specific backend
  const changePassword = async (oldPassword, newPassword) => {
    try {
      console.log("AuthContext: Attempting to change password");

      if (!token) {
        throw new Error("No authentication token available");
      }

      // Use the correct endpoint for your backend
      const response = await axios.put(
        `${API_URL}/auth/change-password`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            "x-auth-token": token,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("AuthContext: Password change response:", response.data);

      return {
        success: true,
        message: response.data?.message || "Password changed successfully!",
      };
    } catch (error) {
      console.error("AuthContext: Error changing password:", error);

      let errorMessage = "Failed to change password";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Add helpful debugging info
      if (error.response?.status === 404) {
        errorMessage +=
          ". Please make sure you've added the password change route to your backend.";
      }

      throw new Error(errorMessage);
    }
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
    clearError,
    updateUserProfile,
    changePassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
