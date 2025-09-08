import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import "./styles/Settings.css";

// Auth Context
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

// Page components
import ResumeBuilderPage from "./resumeBuilderPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";

// Job-related components
import JobsDashboard from "./pages/JobsDashboard";
import JobDetailPage from "./pages/JobDetailPage";
import UserDashboard from "./pages/UserDashboard";

// Layout components
import Navbar from "./components/Navbar";

// FIXED Landing Page Component
const JobSearchLandingPage = () => {
  return (
    <div className="bg-black text-white min-h-screen">
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
            {/* FIXED: Now redirects to login instead of jobs directly */}
            <Link
              to="/login"
              className="absolute right-1 top-1 px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Get started
            </Link>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Resume generation using AI",
              description:
                "Create a professional, tailored resume in seconds with our AI-powered resume builder, designed to meet the requirements of every job and location.",
            },
            {
              title: "Cover letter generation using AI",
              description:
                "Generate personalized, ATS-friendly cover letters that highlight your strengths and resonate with hiring managers, tailored to each job application.",
            },
            {
              title: "Automated Application",
              description:
                "Streamline your job hunt by automatically sending customized applications to top employers, saving you time and effort.",
            },
            {
              title: "Smart Job Matching",
              description:
                "Our AI analyzes your profile and preferences to find the perfect job opportunities that match your skills and career goals.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-900 p-8 rounded-3xl border border-gray-800"
            >
              <h3 className="text-2xl font-bold mb-4 text-left">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-left">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App bg-black text-white min-h-screen">
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <JobSearchLandingPage />
                </>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* MAIN: Jobs Dashboard - This is the main dashboard after login */}
            <Route
              path="/jobs"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <JobsDashboard />
                  </>
                </PrivateRoute>
              }
            />

            <Route
              path="/jobs/:id"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <JobDetailPage />
                  </>
                </PrivateRoute>
              }
            />

            {/* User Dashboard - Overview/Profile */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <UserDashboard />
                  </>
                </PrivateRoute>
              }
            />

            {/* Resume builder - Now in settings/profile */}
            <Route
              path="/resume"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <ResumeBuilderPage />
                  </>
                </PrivateRoute>
              }
            />

            {/* Settings - Contains resume builder and other settings */}
            <Route
              path="/settings/*"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />

            {/* Fallback: Redirect unknown routes to jobs if authenticated, login if not */}
            <Route
              path="*"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <JobsDashboard />
                  </>
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
