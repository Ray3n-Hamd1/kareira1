// STEP 1: Create the CompleteJobsDashboard.js file
// Save this as: src/pages/CompleteJobsDashboard.js

import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Filter,
  Briefcase,
  TrendingUp,
  Bell,
  User,
  Settings,
  MoreHorizontal,
  Bookmark,
  Calendar,
  DollarSign,
  Clock,
  ExternalLink,
  Download,
  Paperclip,
  Share2,
  X,
  ChevronRight,
  Building2,
  Globe,
  CheckCircle,
  Star,
  Eye,
  Plus,
  Send,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { generateMockJobs } from "../services/mockJobService";

export default function CompleteJobsDashboard() {
  const { user } = useAuth();

  // Core state
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [activeTab, setActiveTab] = useState("saved");
  const [selectedJobIds, setSelectedJobIds] = useState(new Set());

  // UI state
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [selectedJobForDetail, setSelectedJobForDetail] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJobForApplication, setSelectedJobForApplication] =
    useState(null);
  const [showBulkSummary, setShowBulkSummary] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(true);
  const [profileCompletion] = useState(88);

  // Load initial jobs
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const jobs = generateMockJobs(100);
        setAllJobs(jobs);
        setError(null);
      } catch (err) {
        setError("Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Apply search filters
  useEffect(() => {
    let filtered = allJobs;

    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (locationQuery) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(locationQuery.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [allJobs, searchQuery, locationQuery]);

  // Mock saved jobs based on active tab
  const getJobsForTab = (tab) => {
    const mockSavedJobs = filteredJobs.filter((_, index) => index < 8);

    switch (tab) {
      case "saved":
        return mockSavedJobs;
      case "applied":
        return mockSavedJobs.slice(0, 3);
      case "pending":
        return mockSavedJobs.slice(0, 5);
      case "expired":
        return mockSavedJobs.slice(0, 2);
      default:
        return mockSavedJobs;
    }
  };

  const currentJobs = getJobsForTab(activeTab);

  const handleJobClick = (job) => {
    setSelectedJobForDetail(job);
    setShowJobDetail(true);
  };

  const handleApplyToJob = (job) => {
    setSelectedJobForApplication(job);
    setShowApplicationModal(true);
  };

  const toggleJobSelection = (jobId) => {
    setSelectedJobIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const clearSelection = () => {
    setSelectedJobIds(new Set());
  };

  const handleBulkAction = (action) => {
    if (action === "apply") {
      setShowBulkSummary(true);
    }
  };

  // Job Card Component
  const JobCard = ({ job, isSelected, onToggle, onJobClick, onApply }) => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-grow">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onToggle(job.id);
            }}
            className="mt-1 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />

          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            {job.company?.charAt(0) || "J"}
          </div>

          <div className="flex-grow">
            <h3
              className="text-white font-semibold text-lg mb-1 cursor-pointer hover:text-purple-400 transition-colors"
              onClick={() => onJobClick(job)}
            >
              {job.title}
            </h3>
            <p className="text-gray-400 text-sm mb-2">{job.company}</p>
            <div className="flex items-center gap-4 text-gray-500 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {job.salary || "Not specified"}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {job.postedDate || "Recently"}
              </span>
            </div>
          </div>
        </div>

        <button className="text-gray-400 hover:text-purple-400 transition-colors">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills?.slice(0, 3).map((skill, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-md"
          >
            {skill}
          </span>
        ))}
        {job.skills?.length > 3 && (
          <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-md">
            +{job.skills.length - 3} more
          </span>
        )}
      </div>

      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            Posted 4 days ago
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onApply(job);
          }}
          className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
        >
          Apply Now
        </button>
      </div>
    </div>
  );

  // Right Sidebar Component
  const RightSidebar = () => (
    <div className="w-80 bg-gray-900 border-l border-gray-700 p-6 space-y-6">
      {/* Resume Update Prompt */}
      {showResumePrompt && (
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white relative">
          <button
            onClick={() => setShowResumePrompt(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              📄
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Ready to make your next career move?
            </h3>
            <p className="text-white/80 text-sm mb-4">
              Start by updating your resume today
            </p>
          </div>

          <button className="w-full bg-white text-purple-600 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Update resume
          </button>
        </div>
      )}

      {/* Profile Completion */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div>
            <h4 className="text-white font-semibold">
              {user?.name || "Emmanuel Ikechukwu"}
            </h4>
            <p className="text-gray-400 text-sm">
              Product Designer | UI/UX Designer
            </p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">
              Your profile is {profileCompletion}% complete
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
        </div>

        <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
          Update profile
        </button>
      </div>

      {/* Job Alerts */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="mb-4">
          <div className="w-16 h-16 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
            📋
          </div>
          <h3 className="text-white font-semibold mb-2">
            Be the first to see new jobs listings
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Subscribe to our job feed newsletter
          </p>
        </div>

        <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
          Subscribe
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* My Jobs Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">My Jobs</h2>
              <button className="text-purple-400 hover:text-purple-300 text-sm">
                View all
              </button>
            </div>

            {/* Job Status Tabs */}
            <div className="flex gap-1 mb-6">
              {[
                { id: "saved", label: "Saved", count: 8 },
                { id: "applied", label: "Applied", count: 3 },
                { id: "pending", label: "Pending", count: 5 },
                { id: "expired", label: "Expired", count: 2 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Job Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
              {currentJobs.slice(0, 3).map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSelected={selectedJobIds.has(job.id)}
                  onToggle={toggleJobSelection}
                  onJobClick={handleJobClick}
                  onApply={handleApplyToJob}
                />
              ))}
            </div>
          </div>

          {/* Quick Overview Stats */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick overview
            </h3>
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: "Applied", count: 20 },
                { label: "Viewed", count: 20 },
                { label: "Viewing", count: 20 },
                { label: "Viewing", count: 20 },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.count}
                  </div>
                  <div className="text-gray-400 text-sm mb-2">{stat.label}</div>
                  <button className="text-purple-400 hover:text-purple-300 text-sm">
                    View all →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Find Jobs Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Find Jobs</h3>
              <button className="text-purple-400 hover:text-purple-300 text-sm">
                Select multiple
              </button>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
              {currentJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSelected={selectedJobIds.has(job.id)}
                  onToggle={toggleJobSelection}
                  onJobClick={handleJobClick}
                  onApply={handleApplyToJob}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>

      {/* Bulk Action Bar */}
      {selectedJobIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              <span className="text-white">Please select an action</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={clearSelection}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel selection
              </button>
              <button
                onClick={() => handleBulkAction("apply")}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Apply to all
              </button>
              <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
