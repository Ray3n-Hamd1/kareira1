import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserDashboard() {
  const { user } = useAuth();
  const [profileCompletion] = useState(80);
  const [stats] = useState({
    applied: 20,
    pending: 20,
    expired: 20,
    viewed: 20,
  });

  // Sample job applications
  const [jobApplications] = useState([
    {
      id: 1,
      company: "Meta",
      position: "UI/UX Designer",
      location: "Washington DC, USA",
      salary: "₦1.5million/month",
      appliedDays: 3,
      status: "applied",
    },
    {
      id: 2,
      company: "Meta",
      position: "UI/UX Designer",
      location: "Washington DC, USA",
      salary: "₦1.5million/month",
      appliedDays: 4,
      status: "pending",
    },
    {
      id: 3,
      company: "Meta",
      position: "UI/UX Designer",
      location: "Washington DC, USA",
      salary: "₦1.5million/month",
      appliedDays: 4,
      status: "expired",
    },
  ]);

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - My Jobs */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">My Jobs</h2>
              <Link
                to="/jobs"
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                View all
              </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-900 rounded-lg p-1">
              {[
                { key: "saved", label: "Saved" },
                { key: "applied", label: "Applied", active: true },
                { key: "pending", label: "Pending" },
                { key: "expired", label: "Expired" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tab.active
                      ? "bg-purple-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
              {jobApplications.map((job) => (
                <div
                  key={job.id}
                  className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">M</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          {job.position}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2">
                          {job.company} • {job.location}
                        </p>
                        <p className="text-white font-medium">{job.salary}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <span className="text-gray-400 text-sm">
                          Posted {job.appliedDays} days ago
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            job.status === "applied"
                              ? "bg-green-500"
                              : job.status === "pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Profile & Stats */}
          <div className="space-y-8">
            {/* Profile Completion Card */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl p-6 text-center">
              <div className="mb-4">
                <div className="w-20 h-20 mx-auto mb-4">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#ffffff20"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="8"
                      strokeDasharray={`${profileCompletion * 2.83} 283`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Ready to make your next career move?
              </h3>
              <p className="text-purple-200 text-sm mb-4">
                Start by updating your resume today
              </p>
              {/* FIXED: Resume builder link */}
              <Link
                to="/resume"
                className="w-full py-2 px-4 bg-white text-purple-800 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
              >
                Update resume
              </Link>
            </div>

            {/* Profile Info Card */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {user?.name ? user.name[0].toUpperCase() : "U"}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {user?.name || "User"}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Product Designer, UI/UX Designer, Brand Strategist
                  </p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Your profile is {profileCompletion}% complete. Finish setting up
              </p>
              {/* FIXED: Settings/Profile link */}
              <Link
                to="/settings/profile"
                className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors inline-block text-center"
              >
                Update profile
              </Link>
            </div>

            {/* Quick Overview Stats */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Quick overview</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(stats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {value}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">
                      {key}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Newsletter Signup */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-600 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-400 text-sm text-center mb-4">
                Get job listings directly to your inbox
              </p>
              <h3 className="text-center font-semibold mb-4">
                Be the first to see new jobs listings
              </h3>
              <p className="text-gray-400 text-xs text-center mb-4">
                Subscribe today to never miss out
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
