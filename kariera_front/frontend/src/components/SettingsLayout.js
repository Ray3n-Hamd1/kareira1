// src/components/SettingsLayout.js
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SettingsLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    if (path === "/settings/notification") {
      return location.pathname === path;
    }
    if (path === "/settings/security") {
      return (
        location.pathname === path ||
        location.pathname.startsWith("/settings/security")
      );
    }
    return location.pathname === path;
  };

  // Get breadcrumb text based on current path
  const getBreadcrumb = () => {
    if (location.pathname === "/settings/notification") return "notification";
    if (location.pathname.includes("/settings/security")) {
      if (location.pathname === "/settings/security/change-password") {
        return "security | change password";
      }
      return "security";
    }
    if (location.pathname === "/settings/profile") return "profile";
    return "settings";
  };

  const handleBack = () => {
    if (location.pathname === "/settings/security/change-password") {
      navigate("/settings/security");
    } else {
      navigate(-1);
    }
  };

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    navigate("/login");
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.name) {
      const names = user.name.split(" ");
      return names.length > 1
        ? `${names[0][0]}${names[1][0]}`.toUpperCase()
        : `${names[0][0]}${names[0][1] || ""}`.toUpperCase();
    }
    return "U";
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-semibold">Settings</h1>
                <p className="text-sm text-gray-400">{getBreadcrumb()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {getUserInitials()}
                </div>
                <span className="text-sm">{user?.name || "User"}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold mb-4">Settings</h2>
              <nav className="space-y-2">
                <Link
                  to="/settings/profile"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive("/settings/profile")
                      ? "bg-purple-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  Profile
                </Link>
                <Link
                  to="/settings/security"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive("/settings/security")
                      ? "bg-purple-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  Security
                </Link>
                <Link
                  to="/settings/notification"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive("/settings/notification")
                      ? "bg-purple-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  Notifications
                </Link>
                {/* ADDED: Resume Builder Link */}
                <div className="pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-500 mb-2 px-3">
                    Resume Tools
                  </p>
                  <Link
                    to="/resume"
                    className="block px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    Resume Builder
                  </Link>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900 rounded-xl border border-gray-800">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
