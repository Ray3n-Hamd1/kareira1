// src/pages/JobsDashboard.js - Updated dashboard with enhanced components
import React, { useState, useEffect, useCallback } from "react";
import { Search, MapPin, Filter, Briefcase, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Enhanced components
import FilterSidebar from "../components/jobs/FilterSidebar";
import JobList from "../components/jobs/JobList";
import ApplicationModal from "../components/jobs/ApplicationModal";

// Mock job service (replace with real API)
import {
  generateMockJobs,
  applyFiltersToJobs,
} from "../services/mockJobService";

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

  // Modal state
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJobForApplication, setSelectedJobForApplication] =
    useState(null);

  // User tier (mock data - replace with real user data)
  const [userTier, setUserTier] = useState("free");
  const [remainingApplications, setRemainingApplications] = useState(3);

  // Load initial jobs
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const jobs = generateMockJobs(100); // Generate 100 mock jobs
        setAllJobs(jobs);
        setError(null);
      } catch (err) {
        setError("Failed to load jobs. Please try again.");
        console.error("Error loading jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Apply filters and search
  useEffect(() => {
    const filtered = applyFiltersToJobs(allJobs, {
      searchQuery,
      locationQuery,
      filters,
      sortBy,
    });
    setFilteredJobs(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [allJobs, searchQuery, locationQuery, filters, sortBy]);

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

  // Handle select all
  const handleSelectAll = useCallback((selected, jobIds = []) => {
    if (selected) {
      const currentPageJobs = getCurrentPageJobs();
      const allJobIds =
        jobIds.length > 0 ? jobIds : currentPageJobs.map((job) => job.id);
      setSelectedJobs(new Set(allJobIds));
    } else {
      setSelectedJobs(new Set());
    }
  }, []);

  // Handle bulk apply
  const handleBulkApply = useCallback(async () => {
    const selectedJobsList = Array.from(selectedJobs)
      .map((id) => allJobs.find((job) => job.id === id))
      .filter(Boolean);

    console.log("Bulk applying to jobs:", selectedJobsList);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update applied status for selected jobs
    setAllJobs((prev) =>
      prev.map((job) =>
        selectedJobs.has(job.id) ? { ...job, applied: true } : job
      )
    );

    // Reduce remaining applications
    setRemainingApplications((prev) => Math.max(0, prev - selectedJobs.size));

    // Clear selection
    setSelectedJobs(new Set());

    alert(`Successfully applied to ${selectedJobs.size} jobs!`);
  }, [selectedJobs, allJobs]);

  // Handle bulk save
  const handleBulkSave = useCallback(async () => {
    console.log("Bulk saving jobs:", selectedJobs);

    // Update saved status for selected jobs
    setAllJobs((prev) =>
      prev.map((job) =>
        selectedJobs.has(job.id) ? { ...job, saved: true } : job
      )
    );

    alert(`Successfully saved ${selectedJobs.size} jobs!`);
  }, [selectedJobs]);

  // Handle individual job save
  const handleJobSave = useCallback((jobId) => {
    setAllJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, saved: !job.saved } : job
      )
    );
  }, []);

  // Handle individual job apply
  const handleJobApply = useCallback((job) => {
    setSelectedJobForApplication(job);
    setShowApplicationModal(true);
  }, []);

  // Handle application submission
  const handleApplicationSubmit = useCallback(
    async (applicationData) => {
      console.log("Submitting application:", applicationData);

      // Update applied status
      setAllJobs((prev) =>
        prev.map((job) =>
          job.id === selectedJobForApplication.id
            ? { ...job, applied: true }
            : job
        )
      );

      setRemainingApplications((prev) => Math.max(0, prev - 1));
      setShowApplicationModal(false);
      setSelectedJobForApplication(null);

      alert("Application submitted successfully!");
    },
    [selectedJobForApplication]
  );

  // Get current page jobs
  const getCurrentPageJobs = useCallback(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    return filteredJobs.slice(startIndex, endIndex);
  }, [filteredJobs, currentPage, jobsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const hasNextPage = currentPage < totalPages;

  // Get current page jobs for display
  const currentPageJobs = getCurrentPageJobs();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            {/* Welcome message */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">
                Find your next opportunity,{" "}
                {user?.firstName || user?.name || "there"}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Briefcase className="w-4 h-4" />
                  <span>{filteredJobs.length} jobs available</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>{remainingApplications} applications remaining</span>
                </div>
              </div>
            </div>

            {/* Search bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="lg:w-80 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="City, state, or country"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                onClick={() => setShowFilterSidebar(!showFilterSidebar)}
                className="lg:hidden px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          {showFilterSidebar && (
            <div className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar filters={filters} onFiltersChange={setFilters} />
            </div>
          )}

          {/* Jobs List */}
          <div className="flex-1 min-w-0">
            <JobList
              jobs={currentPageJobs}
              loading={loading}
              error={error}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              selectedJobs={selectedJobs}
              onJobSelect={handleJobSelect}
              onSelectAll={handleSelectAll}
              onBulkApply={handleBulkApply}
              onBulkSave={handleBulkSave}
              onJobSave={handleJobSave}
              onJobApply={handleJobApply}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalCount={filteredJobs.length}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              hasNextPage={hasNextPage}
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedJobForApplication && (
        <ApplicationModal
          job={selectedJobForApplication}
          userTier={userTier}
          remainingApplications={remainingApplications}
          onClose={() => {
            setShowApplicationModal(false);
            setSelectedJobForApplication(null);
          }}
          onSubmit={handleApplicationSubmit}
        />
      )}
    </div>
  );
}
