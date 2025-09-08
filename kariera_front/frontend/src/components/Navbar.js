import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-black border-b border-gray-800 px-4 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <div className="w-8 h-8 bg-purple-600 rounded-full mr-2"></div>
          <span className="font-bold text-xl">Kariera</span>
        </Link>

        <nav className="hidden md:flex space-x-8">
          {isAuthenticated && (
            <>
              <Link
                to="/jobs"
                className={`hover:text-purple-400 ${
                  location.pathname === "/jobs" ||
                  location.pathname.startsWith("/jobs/")
                    ? "text-purple-400"
                    : "hover:text-purple-400"
                }`}
              >
                Jobs
              </Link>
              <Link
                to="/dashboard"
                className={`hover:text-purple-400 ${
                  location.pathname === "/dashboard"
                    ? "text-purple-400"
                    : "hover:text-purple-400"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/settings"
                className={`hover:text-purple-400 ${
                  location.pathname.startsWith("/settings")
                    ? "text-purple-400"
                    : "hover:text-purple-400"
                }`}
              >
                Settings
              </Link>
            </>
          )}
          {/* FIXED: Changed from anchor tags to buttons for accessibility */}
          <button
            className="hover:text-purple-400 bg-transparent border-none cursor-pointer text-white"
            onClick={() => console.log("Features coming soon")}
          >
            Features
          </button>
          <button
            className="hover:text-purple-400 bg-transparent border-none cursor-pointer text-white"
            onClick={() => console.log("Testimonials coming soon")}
          >
            Testimonials
          </button>
        </nav>

        <div className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <span className="hidden md:inline text-sm text-gray-400 mr-2">
                Welcome, {user?.name || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full border border-gray-700 text-white hover:bg-gray-800 transition-colors"
              >
                Logout
              </button>
              <Link
                to="/jobs"
                className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                Find Jobs
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                Sign In
              </Link>
              {/* FIXED: Get Started now goes to login instead of resume */}
              <Link
                to="/login"
                className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
