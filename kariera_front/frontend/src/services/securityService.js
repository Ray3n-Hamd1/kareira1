// src/services/securityService.js - CREATE THIS NEW FILE
import api from "./api";

// Two-Factor Authentication services
export const setup2FA = async () => {
  try {
    const response = await api.post("/2fa/setup");
    return response.data;
  } catch (error) {
    console.error("Error setting up 2FA:", error);
    throw error;
  }
};

export const verify2FA = async (token) => {
  try {
    const response = await api.post("/2fa/verify", { token });
    return response.data;
  } catch (error) {
    console.error("Error verifying 2FA:", error);
    throw error;
  }
};

export const disable2FA = async (password) => {
  try {
    const response = await api.post("/2fa/disable", { password });
    return response.data;
  } catch (error) {
    console.error("Error disabling 2FA:", error);
    throw error;
  }
};

export const get2FAStatus = async () => {
  try {
    const response = await api.get("/2fa/status");
    return response.data;
  } catch (error) {
    console.error("Error getting 2FA status:", error);
    throw error;
  }
};

// Notification services
export const getNotificationSettings = async () => {
  try {
    const response = await api.get("/notifications/settings");
    return response.data;
  } catch (error) {
    console.error("Error getting notification settings:", error);
    throw error;
  }
};

export const updateNotificationSettings = async (settings) => {
  try {
    const response = await api.put("/notifications/settings", settings);
    return response.data;
  } catch (error) {
    console.error("Error updating notification settings:", error);
    throw error;
  }
};
