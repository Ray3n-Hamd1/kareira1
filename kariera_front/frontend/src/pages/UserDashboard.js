import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useJobs } from "../context/JobsContext";

export default function UserDashboard() {
  const { user } = useAuth();
  const {
    myJobs,
    availableJobs,
    jobStats,
    toggleSaveJob,
    subscribeToJobAlerts,
  } = useJobs();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("saved");
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Get user initials
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
    return "EI";
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.name) {
      return user.name;
    }
    return "Emmanuel Ikechukwu";
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleViewAll = (section) => {
    switch (section) {
      case "jobs":
        navigate("/jobs");
        break;
      case "saved":
        navigate("/jobs?filter=saved");
        break;
      default:
        navigate("/jobs");
    }
  };

  const handleToggleBookmark = (jobId) => {
    toggleSaveJob(jobId);
  };

  const handleSelectMultiple = () => {
    navigate("/jobs?mode=select");
  };

  const handleSubscribe = async () => {
    if (!email) {
      alert("Please enter your email address");
      return;
    }

    setIsSubscribing(true);
    try {
      const result = await subscribeToJobAlerts(email);
      if (result.success) {
        alert(result.message);
        setEmail("");
      } else {
        alert("Failed to subscribe. Please try again.");
      }
    } catch (error) {
      alert("Failed to subscribe. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleUpdateResume = () => {
    navigate("/resume");
  };

  const handleUpdateProfile = () => {
    navigate("/settings/profile");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* My Jobs Section */}
            <div
              className=" rounded-lg p-6 mb-8"
              style={{
                background:
                  "linear-gradient(135deg, #71717a 0%, #52525b 25%, #71717a 50%, #52525b 75%, #71717a 100%)",
                boxShadow:
                  "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">My Jobs</h2>
                <button
                  onClick={() => handleViewAll("jobs")}
                  className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
                >
                  View all
                </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 mb-6">
                {["saved", "applied", "pending", "expired"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`px-4 py-1 rounded-xl text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
                <button className="ml-auto p-2 text-gray-400 hover:text-white transition-colors">
                  <svg
                    className="w-4 h-4"
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

              {/* Job Cards */}
              <div className="flex gap-4 overflow-x-auto pb-2">
                {myJobs[activeTab]?.length > 0 ? (
                  myJobs[activeTab].map((job) => (
                    <div
                      key={job.id}
                      className="min-w-[300px] bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6.5A1.5 1.5 0 0116.5 16h-13A1.5 1.5 0 012 14.5V8a2 2 0 012-2h2zm1-1v1h6V5a2 2 0 00-2-2H9a2 2 0 00-2 2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white truncate">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-400 truncate">
                            {job.company} • {job.location}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm font-medium text-white">
                              {job.salary}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12,6 12,12 16,14" />
                              </svg>
                              {job.posted}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-center py-8 w-full">
                    No {activeTab} jobs yet
                  </div>
                )}
              </div>
            </div>

            {/* Quick Overview */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Quick overview
                </h2>
                <button
                  onClick={() => handleViewAll("stats")}
                  className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
                >
                  View all
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {Object.entries(jobStats).map(([key, value]) => (
                  <div
                    key={key}
                    className=" rounded-lg p-4 text-center hover:bg-gray-750 transition-colors cursor-pointer"
                  >
                    <div className="text-2xl font-bold text-white mb-1">
                      {value}
                    </div>
                    <div className="text-sm text-gray-400 capitalize mb-2">
                      {key}
                    </div>
                    <button
                      onClick={() => handleViewAll(key)}
                      className="text-blue-400 text-xs hover:text-blue-300 transition-colors"
                    >
                      View all →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Find Jobs Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Find Jobs</h2>
                <button
                  onClick={handleSelectMultiple}
                  className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
                >
                  Select multiple
                </button>
              </div>

              <div className="space-y-4">
                {availableJobs?.length > 0 ? (
                  availableJobs.map((job) => (
                    <div
                      key={job.id}
                      className=" rounded-lg p-6 hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                          <svg
                            className="w-7 h-7 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6.5A1.5 1.5 0 0116.5 16h-13A1.5 1.5 0 012 14.5V8a2 2 0 012-2h2zm1-1v1h6V5a2 2 0 00-2-2H9a2 2 0 00-2 2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-white mb-1">
                                {job.title}
                              </h3>
                              <p className="text-gray-400 text-sm mb-3">
                                {job.company} • {job.location}
                              </p>

                              {job.tags && (
                                <div className="flex items-center gap-2 mb-4">
                                  {job.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="px-3 py-1 bg-gray-700 rounded-full text-xs text-gray-300"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <div className="flex items-center gap-4 mb-4">
                                <span className="font-semibold text-white">
                                  {job.salary}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12,6 12,12 16,14" />
                                  </svg>
                                  {job.posted}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleToggleBookmark(job.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                job.bookmarked
                                  ? "text-purple-400 bg-purple-400/20"
                                  : "text-gray-400 hover:text-purple-400 hover:bg-purple-400/20"
                              }`}
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                              </svg>
                            </button>
                          </div>

                          {job.description && (
                            <div className="text-sm text-gray-300 leading-relaxed">
                              {job.description
                                .split("\n")
                                .map((line, index) => (
                                  <div key={index} className="mb-1">
                                    • {line}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-center py-8">
                    No jobs available at the moment
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 space-y-6">
            {/* Resume Update Card - Metallic Grey */}
            <div
              className="rounded-lg p-6 text-center border border-gray-400/50"
              style={{
                background:
                  "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 25%, #8b5cf6 50%, #7c3aed 75%, #8b5cf6 100%)",
                boxShadow:
                  "0 8px 32px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
                <svg
                  className="w-8 h-8 text-white drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-purple-100 mb-2 drop-shadow-sm">
                Ready to make your next career move?
              </p>
              <h3 className="text-lg font-semibold text-white mb-4 drop-shadow-sm">
                Start by updating your resume today
              </h3>
              <button
                onClick={handleUpdateResume}
                className="w-full bg-white/90 backdrop-blur-sm text-purple-600 font-semibold py-3 rounded-lg hover:bg-white transition-colors shadow-lg border border-white/20"
              >
                Update resume
              </button>
            </div>

            {/* User Profile Card - Black */}
            <div className="bg-black border border-gray-800 rounded-lg p-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-semibold text-lg">
                    {getUserInitials()}
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-1">
                  {getUserDisplayName()}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Product Designer, UI/UX Designer, Brand Gra...
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  Your profile is 80% complete. Finish setting up
                </p>
                <button
                  onClick={handleUpdateProfile}
                  className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Update profile
                </button>
              </div>
            </div>

            {/* Job Listings Subscription - Metallic Grey */}
            <div
              className="rounded-lg p-6 border border-gray-400/50"
              style={{
                background:
                  "linear-gradient(135deg, #71717a 0%, #52525b 25%, #71717a 50%, #52525b 75%, #71717a 100%)",
                boxShadow:
                  "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-600/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-purple-400/50">
                  <svg
                    className="w-8 h-8 text-purple-300 drop-shadow-lg"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-200 mb-2 drop-shadow-sm">
                  Get job listings directly to your inbox
                </p>
                <h3 className="font-semibold text-white mb-4 drop-shadow-sm">
                  Be the first to see new jobs listings
                </h3>
                <p className="text-xs text-gray-300 mb-4">
                  Subscribe today to never miss out. Let's start your new
                  career.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-800/70 backdrop-blur-sm border border-gray-600/50 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    disabled={isSubscribing}
                  />
                  <button
                    onClick={handleSubscribe}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold disabled:opacity-50 shadow-md"
                    disabled={isSubscribing || !email}
                  >
                    {isSubscribing ? "..." : "Subscribe"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
