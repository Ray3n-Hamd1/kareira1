import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { Search, MapPin, Filter, Briefcase, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useJobs } from "../context/JobsContext";

export default function JobsDashboard() {
  const { user } = useAuth();
  const { availableJobs, loading, loadAvailableJobs, toggleSaveJob } =
    useJobs();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Search and filters
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
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

  // Update search query when URL changes
  useEffect(() => {
    const urlSearchQuery = searchParams.get("search");
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [searchParams]);

  // Load jobs when search/filters change
  useEffect(() => {
    const searchFilters = {
      search: searchQuery,
      location: locationQuery,
      ...filters,
      page: currentPage,
      limit: jobsPerPage,
    };

    loadAvailableJobs(searchFilters);
  }, [searchQuery, locationQuery, filters, currentPage, loadAvailableJobs]);

  // Handle search form submission
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();

      // Update URL with search params
      const newSearchParams = new URLSearchParams(searchParams);
      if (searchQuery.trim()) {
        newSearchParams.set("search", searchQuery.trim());
      } else {
        newSearchParams.delete("search");
      }
      setSearchParams(newSearchParams);

      // Reset to first page when searching
      setCurrentPage(1);
    },
    [searchQuery, searchParams, setSearchParams]
  );

  // Handle job bookmark toggle
  const handleBookmarkToggle = useCallback(
    async (jobId) => {
      try {
        await toggleSaveJob(jobId);
      } catch (error) {
        console.error("Error toggling bookmark:", error);
      }
    },
    [toggleSaveJob]
  );

  // Handle bulk selection
  const handleJobSelection = useCallback((jobId) => {
    setSelectedJobs((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(jobId)) {
        newSelection.delete(jobId);
      } else {
        newSelection.add(jobId);
      }
      return newSelection;
    });
  }, []);

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedJobs(new Set());
  }, []);

  // Calculate pagination
  const totalJobs = availableJobs?.length || 0;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentPageJobs = availableJobs?.slice(startIndex, endIndex) || [];

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
                  <span>{totalJobs} jobs available</span>
                </div>
                {searchQuery && (
                  <div className="flex items-center gap-2 text-sm text-blue-400">
                    <Search className="w-4 h-4" />
                    <span>Results for "{searchQuery}"</span>
                  </div>
                )}
              </div>
            </div>

            {/* Search bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <form onSubmit={handleSearch} className="flex gap-4 flex-1">
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
                  type="submit"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2 font-medium transition-colors"
                >
                  <Search className="w-5 h-5" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </form>

              <button
                onClick={() => setShowFilterSidebar(!showFilterSidebar)}
                className="lg:hidden px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>

            {/* Results summary and controls */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {Math.min(startIndex + 1, totalJobs)}-
                {Math.min(endIndex, totalJobs)} of {totalJobs} jobs
                {searchQuery && ` for "${searchQuery}"`}
              </div>

              <div className="flex items-center gap-4">
                {selectedJobs.size > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-blue-400">
                      {selectedJobs.size} selected
                    </span>
                    <button
                      onClick={clearSelection}
                      className="text-sm text-gray-400 hover:text-white"
                    >
                      Clear
                    </button>
                  </div>
                )}

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="date">Most Recent</option>
                  <option value="salary">Highest Salary</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          {showFilterSidebar && (
            <div className="w-64 flex-shrink-0">
              <div className="bg-gray-900 rounded-lg p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Filters
                </h3>

                {/* Date Posted */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Date Posted
                  </h4>
                  <select
                    value={filters.datePosted}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        datePosted: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                  >
                    <option value="any">Any time</option>
                    <option value="today">Today</option>
                    <option value="3days">Last 3 days</option>
                    <option value="week">Last week</option>
                    <option value="month">Last month</option>
                  </select>
                </div>

                {/* Job Type */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Job Type
                  </h4>
                  <div className="space-y-2">
                    {[
                      "Full-time",
                      "Part-time",
                      "Contract",
                      "Freelance",
                      "Internship",
                    ].map((type) => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.jobType.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters((prev) => ({
                                ...prev,
                                jobType: [...prev.jobType, type],
                              }));
                            } else {
                              setFilters((prev) => ({
                                ...prev,
                                jobType: prev.jobType.filter((t) => t !== type),
                              }));
                            }
                          }}
                          className="rounded border-gray-600 bg-gray-800 text-purple-600"
                        />
                        <span className="text-sm text-gray-300">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Work Setting */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Work Setting
                  </h4>
                  <select
                    value={filters.workSetting}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        workSetting: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                  >
                    <option value="any">Any</option>
                    <option value="remote">Remote</option>
                    <option value="onsite">On-site</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setFilters({
                      datePosted: "any",
                      jobType: [],
                      workSetting: "any",
                      salaryRange: { min: 0, max: 200000 },
                      experienceLevel: [],
                    });
                    setSearchQuery("");
                    setLocationQuery("");
                    setSearchParams({});
                  }}
                  className="w-full py-2 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Jobs List */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading jobs...</p>
              </div>
            ) : currentPageJobs.length > 0 ? (
              <div className="space-y-4">
                {currentPageJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Selection checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedJobs.has(job.id)}
                        onChange={() => handleJobSelection(job.id)}
                        className="mt-1 rounded border-gray-600 bg-gray-800 text-purple-600"
                      />

                      {/* Company logo */}
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
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

                      {/* Job details */}
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

                            {job.description && (
                              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                                {job.description.length > 150
                                  ? `${job.description.substring(0, 150)}...`
                                  : job.description}
                              </p>
                            )}
                          </div>

                          {/* Bookmark button */}
                          <button
                            onClick={() => handleBookmarkToggle(job.id)}
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
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-2 rounded-lg ${
                          currentPage === i + 1
                            ? "bg-purple-600 text-white"
                            : "bg-gray-800 border border-gray-700 text-white hover:bg-gray-700"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-400 mb-4">
                  {searchQuery
                    ? `No results found for "${searchQuery}". Try adjusting your search terms or filters.`
                    : "No jobs available at the moment. Check back later for new opportunities."}
                </p>
                {(searchQuery || filters.jobType.length > 0) && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setLocationQuery("");
                      setFilters({
                        datePosted: "any",
                        jobType: [],
                        workSetting: "any",
                        salaryRange: { min: 0, max: 200000 },
                        experienceLevel: [],
                      });
                      setSearchParams({});
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
                  >
                    Clear search and filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
