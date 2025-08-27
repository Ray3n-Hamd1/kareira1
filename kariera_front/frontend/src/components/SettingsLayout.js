// src/components/SettingsLayout.js
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function SettingsLayout({ children }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="bg-gray-900 rounded-xl p-6">
            <nav className="space-y-1">
              <Link
                to="/settings/profile"
                className={`block px-4 py-3 rounded-xl ${
                  isActive("/settings/profile")
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:bg-gray-800"
                }`}
              >
                Profile
              </Link>
              <Link
                to="/settings/security"
                className={`block px-4 py-3 rounded-xl ${
                  isActive("/settings/security")
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:bg-gray-800"
                }`}
              >
                Security
              </Link>
              <Link
                to="/settings/notification"
                className={`block px-4 py-3 rounded-xl ${
                  isActive("/settings/notification")
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:bg-gray-800"
                }`}
              >
                Notification
              </Link>
              <Link
                to="/"
                className="block px-4 py-3 rounded-xl text-red-400 hover:bg-gray-800"
              >
                Log Out
              </Link>
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-3 bg-gray-900 rounded-xl p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
