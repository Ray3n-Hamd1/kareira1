// src/components/jobs/JobList.js - Enhanced job list with pagination and bulk selection
import React, { useState, useEffect, useCallback } from "react";
import {
  Grid3X3,
  List,
  ChevronDown,
  Filter,
  Search,
  MoreHorizontal,
  CheckSquare,
  Square,
  ArrowUpDown,
  Eye,
  Bookmark,
  Send,
} from "lucide-react";
import JobCard from "./JobCard";
import LoadingSkeleton from "./LoadingSkeleton";
import BulkActionBar from "./BulkActionBar";

const JOBS_PER_PAGE = 12;
const SORT_OPTIONS = [
  { value: "relevance", label: "Most Relevant" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "salary_high", label: "Highest Salary" },
  { value: "salary_low", label: "Lowest Salary" },
  { value: "company", label: "Company A-Z" },
];

export default function JobList({
  jobs = [],
  loading = false,
  error = null,
  viewMode = "grid",
  onViewModeChange,
  selectedJobs = new Set(),
  onJobSelect,
  onSelectAll,
  onBulkApply,
  onBulkSave,
  onJobSave,
  onJobApply,
  searchQuery = "",
  onSearchChange,
  sortBy = "relevance",
  onSortChange,
  showFilters = true,
  totalCount = 0,
  currentPage = 1,
  onPageChange,
  hasNextPage = false,
  filters = {},
  onFilterChange,
}) {
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [isSelectAllIndeterminate, setIsSelectAllIndeterminate] =
    useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Update select all state based on selection
  useEffect(() => {
    const totalSelectableJobs = jobs.length;
    const selectedCount = selectedJobs.size;

    if (selectedCount === 0) {
      setIsSelectAllChecked(false);
      setIsSelectAllIndeterminate(false);
    } else if (selectedCount === totalSelectableJobs) {
      setIsSelectAllChecked(true);
      setIsSelectAllIndeterminate(false);
    } else {
      setIsSelectAllChecked(false);
      setIsSelectAllIndeterminate(true);
    }
  }, [selectedJobs, jobs.length]);

  // Handle select all toggle
  const handleSelectAllToggle = useCallback(() => {
    const allJobIds = jobs.map((job) => job.id);

    if (
      isSelectAllChecked ||
      (selectedJobs.size > 0 && selectedJobs.size < jobs.length)
    ) {
      // Deselect all
      onSelectAll?.(false, []);
    } else {
      // Select all visible jobs
      onSelectAll?.(true, allJobIds);
    }
  }, [isSelectAllChecked, selectedJobs.size, jobs, onSelectAll]);

  // Handle individual job selection
  const handleJobSelect = useCallback(
    (jobId, selected) => {
      onJobSelect?.(jobId, selected);
    },
    [onJobSelect]
  );

  // Handle search input with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearchQuery !== searchQuery) {
        onSearchChange?.(localSearchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localSearchQuery, searchQuery, onSearchChange]);

  // Handle sort change
  const handleSortChange = (sortValue) => {
    onSortChange?.(sortValue);
  };

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * JOBS_PER_PAGE, totalCount);

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange?.(page);
    }
  };

  // Render pagination component
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-t border-gray-700">
        <div className="text-sm text-gray-400">
          Showing {startIndex}-{endIndex} of {totalCount} jobs
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
              >
                1
              </button>
              {startPage > 2 && <span className="text-gray-500">...</span>}
            </>
          )}

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 text-sm rounded-lg ${
                page === currentPage
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="text-gray-500">...</span>
              )}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  // Error state
  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg p-8 text-center">
        <div className="text-red-400 mb-4">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold">Error Loading Jobs</h3>
          <p className="text-sm text-gray-400 mt-2">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search and Filters */}
          <div className="flex-1 flex items-center gap-4">
            {/* Quick Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-4">
            {/* Select All */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectAllToggle}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
              >
                {isSelectAllIndeterminate ? (
                  <CheckSquare className="w-4 h-4 text-purple-500" />
                ) : isSelectAllChecked ? (
                  <CheckSquare className="w-4 h-4 text-purple-500" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                <span>Select All ({selectedJobs.size})</span>
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => onViewModeChange?.("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange?.("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <span>
            {totalCount > 0 ? `${totalCount} jobs found` : "No jobs found"}
          </span>
          {selectedJobs.size > 0 && (
            <span>{selectedJobs.size} jobs selected</span>
          )}
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedJobs.size > 0 && (
        <BulkActionBar
          selectedCount={selectedJobs.size}
          onBulkApply={onBulkApply}
          onBulkSave={onBulkSave}
          onClearSelection={() => onSelectAll?.(false, [])}
        />
      )}

      {/* Job List Content */}
      <div className="p-6">
        {loading ? (
          <LoadingSkeleton count={6} />
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold">No Jobs Found</h3>
              <p className="text-sm mt-2">
                Try adjusting your search criteria or filters to find more jobs.
              </p>
            </div>
            <button
              onClick={() => {
                setLocalSearchQuery("");
                onSearchChange?.("");
                onFilterChange?.({});
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 mt-4"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSelected={selectedJobs.has(job.id)}
                onSelect={handleJobSelect}
                onToggleSave={onJobSave}
                onApply={onJobApply}
                viewMode={viewMode}
                showSelection={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && jobs.length > 0 && renderPagination()}

      {/* Load More Button (alternative to pagination) */}
      {!loading && hasNextPage && totalPages <= 1 && (
        <div className="p-6 text-center border-t border-gray-700">
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            Load More Jobs
          </button>
        </div>
      )}
    </div>
  );
}
