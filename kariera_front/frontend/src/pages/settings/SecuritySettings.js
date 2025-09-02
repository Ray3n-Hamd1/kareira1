// src/pages/settings/SecuritySettings.js - ENHANCED VERSION
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [setupMode, setSetupMode] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [disablePassword, setDisablePassword] = useState("");
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  // Load 2FA status on component mount
  useEffect(() => {
    loadTwoFactorStatus();
  }, []);

  const loadTwoFactorStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/2fa/status`, {
        headers: { "x-auth-token": token },
      });
      setTwoFactorEnabled(response.data.twoFactorEnabled);
    } catch (error) {
      console.error("Error loading 2FA status:", error);
    }
  };

  const handleSetup2FA = async () => {
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/2fa/setup`,
        {},
        {
          headers: { "x-auth-token": token },
        }
      );

      setQrCode(response.data.qrCode);
      setSecret(response.data.secret);
      setSetupMode(true);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to setup 2FA" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationCode) {
      setMessage({ type: "error", text: "Please enter verification code" });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/2fa/verify`,
        { token: verificationCode },
        { headers: { "x-auth-token": token } }
      );

      setTwoFactorEnabled(true);
      setSetupMode(false);
      setVerificationCode("");
      setMessage({ type: "success", text: "2FA enabled successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Invalid verification code" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!disablePassword) {
      setMessage({ type: "error", text: "Please enter your password" });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/2fa/disable`,
        { password: disablePassword },
        { headers: { "x-auth-token": token } }
      );

      setTwoFactorEnabled(false);
      setShowDisableModal(false);
      setDisablePassword("");
      setMessage({ type: "success", text: "2FA disabled successfully" });
    } catch (error) {
      setMessage({ type: "error", text: "Incorrect password" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      console.log("Delete account requested");
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-8">
      <h2 className="text-2xl font-semibold text-white mb-2">Security</h2>
      <p className="text-gray-400 mb-8">
        Manage and enhance the security of your account
      </p>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-900 border border-green-700 text-green-300"
              : "bg-red-900 border border-red-700 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Change Password */}
        <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
          <Link
            to="/settings/security/change-password"
            className="flex items-center justify-between w-full"
          >
            <div>
              <h3 className="text-lg font-medium text-white mb-1">
                Change Password
              </h3>
              <p className="text-sm text-gray-400">
                Change your password regularly to keep your account secure
              </p>
            </div>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-1">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-gray-400">
                Add an extra layer of protection by enabling 2FA
              </p>
            </div>
            <div className="flex items-center">
              <button
                onClick={
                  twoFactorEnabled
                    ? () => setShowDisableModal(true)
                    : handleSetup2FA
                }
                disabled={isLoading}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  twoFactorEnabled ? "bg-purple-600" : "bg-gray-600"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 2FA Setup Modal */}
          {setupMode && (
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <h4 className="text-white font-medium mb-4">
                Setup Two-Factor Authentication
              </h4>

              {qrCode && (
                <div className="text-center mb-4">
                  <img
                    src={qrCode}
                    alt="2FA QR Code"
                    className="mx-auto mb-4"
                  />
                  <p className="text-sm text-gray-400 mb-2">
                    Scan this QR code with your authenticator app
                  </p>
                  <p className="text-xs text-gray-500">
                    Or manually enter:{" "}
                    <code className="bg-gray-800 px-2 py-1 rounded">
                      {secret}
                    </code>
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code from your app"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  maxLength={6}
                />
                <div className="flex space-x-3">
                  <button
                    onClick={handleVerify2FA}
                    disabled={isLoading}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                  >
                    {isLoading ? "Verifying..." : "Verify & Enable"}
                  </button>
                  <button
                    onClick={() => setSetupMode(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Login Activity Placeholder */}
        <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors opacity-50">
          <div className="flex items-center justify-between w-full">
            <div>
              <h3 className="text-lg font-medium text-white mb-1">
                Login Activity
              </h3>
              <p className="text-sm text-gray-400">
                Monitor your login history (Coming Soon)
              </p>
            </div>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        {/* Delete Account */}
        <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
          <button
            onClick={handleDeleteAccount}
            className="flex items-center justify-between w-full text-left"
          >
            <div>
              <h3 className="text-lg font-medium text-red-400 mb-1">
                Delete Account
              </h3>
              <p className="text-sm text-gray-400">
                Deleting your account is irreversible, and all associated data
                will be lost
              </p>
            </div>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Disable 2FA Modal */}
      {showDisableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-white mb-4">
              Disable Two-Factor Authentication
            </h3>
            <p className="text-gray-400 mb-4">
              Enter your password to disable 2FA
            </p>
            <input
              type="password"
              value={disablePassword}
              onChange={(e) => setDisablePassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleDisable2FA}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? "Disabling..." : "Disable 2FA"}
              </button>
              <button
                onClick={() => {
                  setShowDisableModal(false);
                  setDisablePassword("");
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
