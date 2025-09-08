// src/App.js - Complete Final Version with All Features
import React from "react";
import { addGlobalObjectDetection } from "./utils/debugUtils";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import "./styles/Settings.css";

// Auth Context
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

// Page components
import ResumeBuilderPage from "./resumeBuilderPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import JobsDashboard from "./pages/JobsDashboard";
import UserDashboard from "./pages/UserDashboard";
import CompleteJobsDashboard from "./pages/CompleteJobsDashboard";

// Import for development/testing
import JobSearchLandingPage from "./template";
import EducationDetails from "./EducationDetails";
import SkillsDetails from "./SkillsDetails";
import ProfessionalExperience from "./ProfessionalExperience";
import ProjectDetails from "./ProjectDetails";

// Icons
import {
  Search,
  Bell,
  User,
  LogOut,
  Settings as SettingsIcon,
  FileText,
  Home,
  Briefcase,
  Users,
} from "lucide-react";
if (process.env.NODE_ENV === "development") {
  addGlobalObjectDetection();
}
// Header Component - Enhanced with all navigation
const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logoKarieraWhite.svg"
              alt="Kariera Logo"
              className="w-8 h-8"
            />
            <span className="text-white font-semibold">Kariera</span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/jobs"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive("/jobs")
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Jobs
              </Link>
              <Link
                to="/resume-builder"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive("/resume-builder")
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                <FileText className="w-4 h-4" />
                Resume Builder
              </Link>
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive("/dashboard")
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                to="/settings"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive("/settings")
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                <SettingsIcon className="w-4 h-4" />
                Settings
              </Link>
            </nav>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search job"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-white">
            <Bell className="w-5 h-5" />
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </div>
              <div className="hidden md:block">
                <span className="text-white text-sm">
                  {user?.name || user?.email}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Layout Wrapper - Decides whether to show header
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-black text-white">
      {!isLandingPage && <Header />}
      {children}
    </div>
  );
};

// Clean Landing Page Component - With logout option if logged in
const CleanLandingPage = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/jobs");
    } else {
      navigate("/register");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogout = () => {
    logout();
    // Stay on landing page after logout
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Auto-login indicator - shows if user is logged in */}
      {isAuthenticated && (
        <div className="bg-yellow-900/30 border-b border-yellow-500/30 px-6 py-2">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">●</span>
              <span className="text-sm text-yellow-200">
                You're logged in as {user?.name || user?.email}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/jobs")}
                className="text-sm text-yellow-200 hover:text-white underline"
              >
                Go to Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="text-sm text-yellow-200 hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-6xl font-bold mb-4">
          Land your next <br />
          <span className="bg-gradient-to-r from-purple-500 to-purple-300 text-transparent bg-clip-text">
            line of work
          </span>
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
          Kariera automates your job search—matching you with top jobs, crafting
          custom resumes, and writing tailored cover letters, so you can focus
          on landing your next role.
        </p>

        <div className="flex max-w-xl mx-auto mb-16">
          <div className="relative w-full">
            <input
              type="email"
              placeholder="Enter Email address"
              className="w-full px-6 py-4 pr-36 rounded-full border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-600"
            />
            <button
              onClick={handleGetStarted}
              className="absolute right-1 top-1 px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get started"}
            </button>
          </div>
        </div>

        <div className="flex justify-center space-x-8 text-sm text-gray-400 mb-16">
          {[
            "Automated applications",
            "Personalized content generation",
            "Accurate job matching",
          ].map((feature, index) => (
            <div key={index} className="flex items-center">
              <span className="w-5 h-5 mr-2 text-green-500">✓</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              title: "Resume generation using AI",
              description:
                "Create a professional, tailored resume in seconds with our AI-powered resume builder, designed to meet the requirements of every job and location.",
            },
            {
              title: "Advanced job matching",
              description:
                "Our smart algorithm finds the best job opportunities for you, ensuring you apply to positions that match your skills and experience.",
            },
            {
              title: "Cover letter generation using AI",
              description:
                "Generate personalized, ATS-friendly cover letters that highlight your strengths and resonate with hiring managers, tailored to each job application.",
            },
            {
              title: "Resume refining based on country",
              description:
                "Optimize your resume for specific countries and regions, ensuring it meets local standards and cultural expectations.",
            },
          ].map((feature, index) => (
            <div key={index} className="bg-gray-900 rounded-xl p-6 text-left">
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/jobs")}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={handleRegister}
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Register
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <LayoutWrapper>
          <Routes>
            {/* Landing page - NO HEADER */}
            <Route path="/" element={<CleanLandingPage />} />

            {/* Auth pages - WITH HEADER */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Development/Testing routes - WITH HEADER */}
            <Route path="/template" element={<JobSearchLandingPage />} />
            <Route path="/education" element={<EducationDetails />} />
            <Route path="/skills" element={<SkillsDetails />} />
            <Route path="/experience" element={<ProfessionalExperience />} />
            <Route path="/projects" element={<ProjectDetails />} />

            {/* Protected routes - WITH HEADER */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <UserDashboard />
                </PrivateRoute>
              }
            />

            {/* Enhanced Jobs Dashboard - THE PAGE FROM YOUR SCREENSHOT */}
            <Route
              path="/jobs"
              element={
                <PrivateRoute>
                  <CompleteJobsDashboard />
                </PrivateRoute>
              }
            />

            {/* Original Jobs Dashboard - For comparison */}
            <Route
              path="/jobs-original"
              element={
                <PrivateRoute>
                  <JobsDashboard />
                </PrivateRoute>
              }
            />

            {/* Resume Builder */}
            <Route
              path="/resume-builder"
              element={
                <PrivateRoute>
                  <ResumeBuilderPage />
                </PrivateRoute>
              }
            />

            {/* Settings */}
            <Route
              path="/settings/*"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />

            {/* Default redirect for authenticated users */}
            <Route
              path="*"
              element={
                <PrivateRoute>
                  <CompleteJobsDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </LayoutWrapper>
      </Router>
    </AuthProvider>
  );
}

export default App;
