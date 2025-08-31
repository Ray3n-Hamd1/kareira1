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
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0][0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.name) {
      return user.name;
    }
    return user?.email || "User";
  };

  return (
    <div className="min-h-screen text-white bg-transparent">
      {/* Top Navigation Bar */}
      <nav className="bg-transparent ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src="/logoKarieraWhite.svg"
                  alt="Kariera Logo"
                  className="w-8 h-8 mr-2"
                />
                <span className="font-bold text-xl">Kariera</span>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search jobs"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute right-3 top-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {getUserInitials()}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-gray-400">
                  {user?.email || "No email"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center text-gray-400 hover:text-white mr-8 mt-2"
          >
            <svg
              className="w-5 h-5 mr-2"
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

          <div className="flex-1">
            {/* Page Title */}
            <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

            <div className="flex">
              {/* Sidebar */}
              <div className="w-64 mr-8">
                <nav className="space-y-1">
                  <Link
                    to="/settings/profile"
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/settings/profile")
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings/security"
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/settings/security")
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    Security
                  </Link>
                  <Link
                    to="/settings/notification"
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/settings/notification")
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    Notification
                  </Link>
                  <div className="pt-4 mt-4 border-t border-gray-800">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-gray-800 transition-colors"
                    >
                      Log Out
                    </button>
                  </div>
                </nav>
              </div>

              {/* Content Area */}
              <div className="flex-1 max-w-3xl">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
