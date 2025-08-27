import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  // Determine if link is active
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="container mx-auto px-4 py-6">
      <div className="border border-gray-800 rounded-full px-6 py-3 flex justify-between items-center">
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
        <nav className="hidden md:flex space-x-8">
          <Link
            to="/"
            className={`${
              isActive("/") ? "text-purple-400" : "hover:text-purple-400"
            }`}
          >
            Home
          </Link>
          <Link
            to="/resume"
            className={`${
              isActive("/resume") ? "text-purple-400" : "hover:text-purple-400"
            }`}
          >
            Resume
          </Link>
          <Link
            to="/dashboard"
            className={`${
              isActive("/dashboard")
                ? "text-purple-400"
                : "hover:text-purple-400"
            }`}
          >
            Dashboard
          </Link>
          {/* Add Settings link only for authenticated users */}
          {isAuthenticated && (
            <Link
              to="/settings/profile"
              className={`${
                isActive("/settings")
                  ? "text-purple-400"
                  : "hover:text-purple-400"
              }`}
            >
              Settings
            </Link>
          )}
          <a href="#" className="hover:text-purple-400">
            Features
          </a>
          <a href="#" className="hover:text-purple-400">
            Testimonial
          </a>
        </nav>
        <div className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <span className="hidden md:inline text-sm text-gray-400 mr-2">
                Welcome, {user?.name || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full border border-gray-700 text-white hover:bg-gray-800"
              >
                Logout
              </button>
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700"
              >
                Sign-In
              </Link>
              <Link
                to="/resume"
                className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700"
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
