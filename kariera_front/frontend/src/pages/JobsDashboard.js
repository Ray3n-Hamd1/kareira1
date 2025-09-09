// src/pages/JobsDashboard.js - Updated to use real API data
import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  MapPin,
  Filter,
  Briefcase,
  TrendingUp,
  Heart,
  ExternalLink,
  Building2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function JobsDashboard() {
  const { user } = useAuth();

  // Core state
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [filters, setFilters] = useState({
    datePosted: "any",
    jobType: [],
    workSetting: "any",
    salaryRange: { min: 0, max: 200000 },
    experienceLevel: [],
  });

  // UI state
  const [viewMode, setViewMode] = useState("grid");
  const [showFilterSidebar, setShowFilterSidebar] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;

  // Selection state
  const [selectedJobs, setSelectedJobs] = useState(new Set());
  const [savedJobIds, setSavedJobIds] = useState(new Set());

  // Load jobs from real API
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching jobs from API...");
        const response = await api.get("/jobs/all");

        if (response.data.success) {
          console.log(`Loaded ${response.data.jobs.length} jobs from API`);
          setAllJobs(response.data.jobs);
          setFilteredJobs(response.data.jobs);
        } else {
          throw new Error(response.data.message || "Failed to load jobs");
        }
      } catch (err) {
        console.error("Error loading jobs:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load jobs. Please try again."
        );

        // Fallback to empty array
        setAllJobs([]);
        setFilteredJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...allJobs];

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (job) =>
          job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply location filter
    if (locationQuery.trim()) {
      filtered = filtered.filter((job) =>
        job.location?.toLowerCase().includes(locationQuery.toLowerCase())
      );
    }

    // Apply job type filter
    if (filters.jobType.length > 0) {
      filtered = filtered.filter((job) =>
        filters.jobType.includes(job.type?.toLowerCase())
      );
    }

    // Apply remote work filter
    if (filters.workSetting !== "any") {
      if (filters.workSetting === "remote") {
        filtered = filtered.filter((job) => job.isRemote);
      } else if (filters.workSetting === "onsite") {
        filtered = filtered.filter((job) => !job.isRemote);
      }
    }

    // Apply sorting
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    } else if (sortBy === "company") {
      filtered.sort((a, b) => (a.company || "").localeCompare(b.company || ""));
    }

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [allJobs, searchQuery, locationQuery, filters, sortBy]);

  // Get current page jobs
  const getCurrentPageJobs = useCallback(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    return filteredJobs.slice(startIndex, endIndex);
  }, [filteredJobs, currentPage, jobsPerPage]);

  // Handle job selection
  const handleJobSelect = useCallback((jobId, selected) => {
    setSelectedJobs((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(jobId);
      } else {
        newSet.delete(jobId);
      }
      return newSet;
    });
  }, []);

  // Handle save job
  const handleSaveJob = async (jobId) => {
    try {
      const response = await api.post("/jobs/save", { jobId });

      if (response.data.success) {
        setSavedJobIds((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(jobId)) {
            newSet.delete(jobId);
          } else {
            newSet.add(jobId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Failed to save job. Please try again.");
    }
  };

  // Handle bulk apply
  const handleBulkApply = useCallback(async () => {
    if (selectedJobs.size === 0) {
      alert("Please select jobs to apply to");
      return;
    }

    const confirmed = window.confirm(
      `Apply to ${selectedJobs.size} selected jobs?`
    );
    if (!confirmed) return;

    try {
      // In a real implementation, you'd call an API to apply to jobs
      console.log("Applying to jobs:", Array.from(selectedJobs));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update applied status
      setAllJobs((prev) =>
        prev.map((job) =>
          selectedJobs.has(job.id) ? { ...job, applied: true } : job
        )
      );

      setSelectedJobs(new Set());
      alert(`Successfully applied to ${selectedJobs.size} jobs!`);
    } catch (error) {
      console.error("Error applying to jobs:", error);
      alert("Failed to apply to jobs. Please try again.");
    }
  }, [selectedJobs]);

  // Manual refresh
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await api.get("/jobs/all");
      if (response.data.success) {
        setAllJobs(response.data.jobs);
        setFilteredJobs(response.data.jobs);
      }
    } catch (error) {
      console.error("Error refreshing jobs:", error);
      setError("Failed to refresh jobs");
    } finally {
      setLoading(false);
    }
  };

  // Trigger job scraping
  const handleScrapeJobs = async () => {
    setLoading(true);
    try {
      const response = await api.post("/jobs/scrape");
      if (response.data.success) {
        alert(`Successfully scraped ${response.data.jobs.length} new jobs!`);
        // Reload jobs
        handleRefresh();
      }
    } catch (error) {
      console.error("Error scraping jobs:", error);
      alert("Failed to scrape jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-xl">Loading jobs...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
          <button
            onClick={handleScrapeJobs}
            className="ml-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Scrape New Jobs
          </button>
        </div>
      </div>
    );
  }

  const currentPageJobs = getCurrentPageJobs();
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Find Jobs</h1>
            <p className="text-gray-400 mt-2">
              {filteredJobs.length} jobs found
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Refresh
            </button>
            <button
              onClick={handleScrapeJobs}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Scrape Jobs
            </button>
            {selectedJobs.size > 0 && (
              <button
                onClick={handleBulkApply}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Apply to {selectedJobs.size} Jobs
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location..."
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="relevance">Most Relevant</option>
              <option value="newest">Newest First</option>
              <option value="company">Company A-Z</option>
            </select>
          </div>

          {/* Quick Filters */}
          <div className="flex space-x-4">
            {["remote", "onsite", "any"].map((setting) => (
              <button
                key={setting}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, workSetting: setting }))
                }
                className={`px-4 py-2 rounded-full text-sm ${
                  filters.workSetting === setting
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {setting === "any"
                  ? "All Jobs"
                  : setting.charAt(0).toUpperCase() + setting.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentPageJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSelected={selectedJobs.has(job.id)}
              isSaved={savedJobIds.has(job.id)}
              onSelect={(selected) => handleJobSelect(job.id, selected)}
              onSave={() => handleSaveJob(job.id)}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              Previous
            </button>
            <span className="flex items-center px-4 py-2 text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Job Card Component
const JobCard = ({ job, isSelected, isSaved, onSelect, onSave }) => {
  return (
    <div
      className={`bg-gray-900 border rounded-xl p-6 transition-all duration-200 ${
        isSelected
          ? "border-purple-500 bg-purple-900/20"
          : "border-gray-700 hover:border-gray-600"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
        </div>
        <button
          onClick={onSave}
          className={`p-2 rounded-lg transition-colors ${
            isSaved
              ? "text-red-500 bg-red-500/20"
              : "text-gray-400 hover:text-red-500 hover:bg-red-500/20"
          }`}
        >
          <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
        {job.title}
      </h3>

      <p className="text-purple-400 mb-2">{job.company}</p>

      <div className="flex items-center text-gray-400 text-sm mb-3">
        <MapPin className="w-4 h-4 mr-1" />
        <span>{job.location}</span>
        {job.isRemote && (
          <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
            Remote
          </span>
        )}
      </div>

      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills?.slice(0, 3).map((skill, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-green-400 font-semibold">{job.salary}</span>
        <div className="flex space-x-2">
          {job.applied ? (
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm">
              Applied
            </span>
          ) : (
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
              Apply Now
            </button>
          )}
          {job.jobUrl && job.jobUrl !== "#" && (
            <a
              href={job.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
