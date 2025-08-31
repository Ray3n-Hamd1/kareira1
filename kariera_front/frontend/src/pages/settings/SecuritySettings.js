// src/pages/settings/SecuritySettings.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true); // Default to enabled as shown in design
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleTwoFactor = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTwoFactorEnabled(!twoFactorEnabled);
      // In a real implementation, you would call an API to enable/disable 2FA
    } catch (error) {
      console.error("Error toggling 2FA:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    // Show confirmation modal
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      // Handle account deletion
      console.log("Delete account requested");
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-8">
      <h2 className="text-2xl font-semibold text-white mb-2">Security</h2>
      <p className="text-gray-400 mb-8">
        Manage and enhance the security of your account
      </p>

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
          <div className="flex items-center justify-between">
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
                onClick={handleToggleTwoFactor}
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
        </div>

        {/* Login Activity */}
        <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
          <Link
            to="/settings/security/login-activity"
            className="flex items-center justify-between w-full"
          >
            <div>
              <h3 className="text-lg font-medium text-white mb-1">
                Login Activity
              </h3>
              <p className="text-sm text-gray-400">
                Monitor your login history to ensure your account is being
                accessed only by you
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
    </div>
  );
}
