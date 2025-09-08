// DEBUG VERSION - EnhancedJobsDashboard.js
import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  MapPin,
  Filter,
  Briefcase,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Enhanced components
import { useJobSelection } from "../hooks/useJobSelection";
import EnhancedBulkActionBar from "../components/jobs/EnhancedBulkActionBar";
import SelectionSummaryModal from "../components/jobs/SelectionSummaryModal";

// Existing components
import FilterSidebar from "../components/jobs/FilterSidebar";
import JobList from "../components/jobs/JobList";
import ApplicationModal from "../components/jobs/ApplicationModal";

// Mock job service
import {
  generateMockJobs,
  applyFiltersToJobs,
} from "../services/mockJobService";

// DEBUG: Global error boundary to catch object rendering
const ObjectDetectionBoundary = ({ children }) => {
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (args[0]?.includes?.("Objects are not valid as a React child")) {
        console.log("🚨 ========== OBJECT RENDERING ERROR DETECTED ==========");
        console.log("🚨 Error arguments:", args);
        console.log("🚨 Stack trace:");
        console.trace();
        console.log("🚨 ================================================");
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return children;
};

export default function EnhancedJobsDashboard() {
  console.log("🔧 ========== ENHANCED JOBS DASHBOARD RENDER ==========");

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
  const [showSmartSuggestions, setShowSmartSuggestions] = useState(true);
  const jobsPerPage = 12;

  // DEBUG: Log what we're passing to useJobSelection
  console.log("🔧 Dashboard - About to call useJobSelection with:");
  console.log("🔧 Dashboard - loading:", loading);
  console.log("🔧 Dashboard - filteredJobs:", filteredJobs?.length || 0);
  console.log("🔧 Dashboard - filteredJobs sample:", filteredJobs?.slice(0, 2));

  // Enhanced selection state using our custom hook
  const jobSelectionResult = useJobSelection(loading ? [] : filteredJobs || []);

  console.log("🔧 Dashboard - useJobSelection returned:");
  console.log(
    "🔧 Dashboard - selectedJobIds:",
    jobSelectionResult.selectedJobIds
  );
  console.log(
    "🔧 Dashboard - selectedJobs:",
    jobSelectionResult.selectedJobs?.length || 0
  );
  console.log(
    "🔧 Dashboard - selectionStats:",
    jobSelectionResult.selectionStats
  );
  console.log(
    "🔧 Dashboard - selectionStats type:",
    typeof jobSelectionResult.selectionStats
  );

  // DEBUG: Specifically check averageSalary
  if (jobSelectionResult.selectionStats?.averageSalary) {
    console.log(
      "🔧 Dashboard - averageSalary:",
      jobSelectionResult.selectionStats.averageSalary
    );
    console.log(
      "🔧 Dashboard - averageSalary type:",
      typeof jobSelectionResult.selectionStats.averageSalary
    );

    if (typeof jobSelectionResult.selectionStats.averageSalary === "object") {
      console.error(
        "🚨 DASHBOARD CRITICAL: averageSalary is an object!",
        jobSelectionResult.selectionStats.averageSalary
      );
      console.error("🚨 This will cause the React error!");
    }
  }

  const {
    selectedJobIds,
    selectedJobs,
    selectionStats,
    toggleJobSelection,
    selectAllJobs,
    clearSelection,
    selectByFilter,
    selectRemoteJobs,
    selectByCompany,
    selectByJobType,
    selectBySalaryRange,
    isJobSelected,
    isAllSelected,
    isPartiallySelected,
  } = jobSelectionResult;

  // Modal state
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showSelectionSummary, setShowSelectionSummary] = useState(false);
  const [selectedJobForApplication, setSelectedJobForApplication] =
    useState(null);
  const [summaryActionType, setSummaryActionType] = useState("apply");

  // User tier state (mock data)
  const [userTier, setUserTier] = useState("free");
  const [remainingApplications, setRemainingApplications] = useState(3);

  // Load initial jobs
  useEffect(() => {
    console.log("🔧 Dashboard - Loading jobs...");

    const loadJobs = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const jobs = generateMockJobs(100);
        console.log("🔧 Dashboard - Generated jobs:", jobs?.length || 0);
        console.log("🔧 Dashboard - Sample job:", jobs?.[0]);

        setAllJobs(jobs);
        setError(null);
      } catch (err) {
        console.error("🔧 Dashboard - Error loading jobs:", err);
        setError("Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Apply filters and search
  useEffect(() => {
    console.log("🔧 Dashboard - Applying filters...");
    console.log("🔧 Dashboard - allJobs:", allJobs?.length || 0);
    console.log("🔧 Dashboard - searchQuery:", searchQuery);
    console.log("🔧 Dashboard - filters:", filters);

    if (allJobs.length > 0) {
      const filtered = applyFiltersToJobs(allJobs, {
        searchQuery,
        locationQuery,
        filters,
        sortBy,
      });

      console.log("🔧 Dashboard - Filtered jobs:", filtered?.length || 0);
      setFilteredJobs(filtered);
      setCurrentPage(1);
    }
  }, [allJobs, searchQuery, locationQuery, filters, sortBy]);

  // Enhanced bulk operations
  const handleBulkApply = useCallback(async () => {
    console.log("🔧 Dashboard - handleBulkApply called");
    console.log("🔧 Dashboard - selectedJobs for bulk apply:", selectedJobs);

    if (userTier === "free" && selectedJobs.length > remainingApplications) {
      setSummaryActionType("apply");
      setShowSelectionSummary(true);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setAllJobs((prev) =>
        prev.map((job) =>
          selectedJobIds.has(job.id) ? { ...job, applied: true } : job
        )
      );

      setRemainingApplications((prev) =>
        Math.max(0, prev - selectedJobs.length)
      );
      clearSelection();

      alert(`Successfully applied to ${selectedJobs.length} jobs!`);
    } catch (error) {
      console.error("Error in bulk apply:", error);
      alert("Failed to apply to jobs. Please try again.");
    }
  }, [
    selectedJobs,
    selectedJobIds,
    userTier,
    remainingApplications,
    clearSelection,
  ]);

  const handleBulkSave = useCallback(async () => {
    console.log("🔧 Dashboard - handleBulkSave called");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAllJobs((prev) =>
        prev.map((job) =>
          selectedJobIds.has(job.id) ? { ...job, saved: true } : job
        )
      );

      alert(`Successfully saved ${selectedJobs.length} jobs!`);
    } catch (error) {
      console.error("Error in bulk save:", error);
      alert("Failed to save jobs. Please try again.");
    }
  }, [selectedJobs, selectedJobIds]);

  const handleGenerateCoverLetters = useCallback(async () => {
    console.log("🔧 Dashboard - handleGenerateCoverLetters called");
    setSummaryActionType("generate_letters");
    setShowSelectionSummary(true);
  }, []);

  const handleExportSelection = useCallback(async () => {
    console.log("🔧 Dashboard - handleExportSelection called");
    setSummaryActionType("export");
    setShowSelectionSummary(true);
  }, []);

  const handleQuickSelect = useCallback(
    (type) => {
      console.log("🔧 Dashboard - handleQuickSelect called with:", type);

      switch (type) {
        case "remote":
          selectRemoteJobs();
          break;
        case "senior":
          selectByFilter((job) =>
            job.experienceLevel?.toLowerCase().includes("senior")
          );
          break;
        case "highSalary":
          selectBySalaryRange(100000, Infinity);
          break;
        case "recent":
          selectByFilter((job) => {
            const posted = new Date(job.posted);
            const now = new Date();
            const daysAgo = (now - posted) / (1000 * 60 * 60 * 24);
            return daysAgo <= 7;
          });
          break;
        default:
          break;
      }
    },
    [selectRemoteJobs, selectByFilter, selectBySalaryRange]
  );

  // Get current page jobs
  const getCurrentPageJobs = useCallback(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    return filteredJobs.slice(startIndex, endIndex);
  }, [filteredJobs, currentPage, jobsPerPage]);

  const currentPageJobs = getCurrentPageJobs();

  // DEBUG: Check if we're about to render anything problematic
  console.log("🔧 Dashboard - About to render with:");
  console.log("🔧 Dashboard - loading:", loading);
  console.log("🔧 Dashboard - error:", error);
  console.log("🔧 Dashboard - selectionStats:", selectionStats);
  console.log("🔧 Dashboard - selectedJobs:", selectedJobs?.length || 0);

  // Loading state
  if (loading) {
    console.log("🔧 Dashboard - Rendering loading state");
    return (
      <ObjectDetectionBoundary>
        <div className="min-h-screen bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="space-y-6">
                  <div className="h-64 bg-gray-700 rounded"></div>
                </div>
                <div className="lg:col-span-3 space-y-6">
                  <div className="h-12 bg-gray-700 rounded"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-64 bg-gray-700 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ObjectDetectionBoundary>
    );
  }

  // Error state
  if (error) {
    console.log("🔧 Dashboard - Rendering error state");
    return (
      <ObjectDetectionBoundary>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-400">
              Error Loading Jobs
            </h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Retry
            </button>
          </div>
        </div>
      </ObjectDetectionBoundary>
    );
  }

  console.log("🔧 Dashboard - Rendering main dashboard");

  // Main dashboard
  return (
    <ObjectDetectionBoundary>
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Enhanced Jobs Dashboard
              </h1>
              <p className="text-gray-400 mt-2">
                Find and apply to jobs with powerful selection tools
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                {filteredJobs.length} jobs • {selectedJobs.length} selected
              </div>
            </div>
          </div>

          {/* Search and filters */}
          <div className="bg-gray-900 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location"
                  className="pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilterSidebar(!showFilterSidebar)}
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            {showFilterSidebar && (
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  <FilterSidebar
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </div>
              </div>
            )}

            {/* Main content */}
            <div
              className={`${
                showFilterSidebar ? "lg:col-span-3" : "lg:col-span-4"
              }`}
            >
              {/* Enhanced Bulk Action Bar */}
              <div className="mb-6">
                <EnhancedBulkActionBar
                  selectionStats={selectionStats}
                  selectedJobs={selectedJobs}
                  onBulkApply={handleBulkApply}
                  onBulkSave={handleBulkSave}
                  onClearSelection={clearSelection}
                  onGenerateCoverLetters={handleGenerateCoverLetters}
                  onExportSelection={handleExportSelection}
                  onQuickSelect={handleQuickSelect}
                  userTier={userTier}
                  remainingApplications={remainingApplications}
                  maxFreeApplications={5}
                  isVisible={selectedJobs.length > 0}
                />
              </div>

              {/* Job List */}
              <JobList
                jobs={currentPageJobs}
                loading={loading}
                error={error}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                selectedJobs={selectedJobIds}
                onJobSelect={(jobId, selected) => {
                  console.log(
                    "🔧 Dashboard - Job selection changed:",
                    jobId,
                    selected
                  );
                  toggleJobSelection(jobId);
                }}
                onSelectAll={(selected) => {
                  console.log("🔧 Dashboard - Select all changed:", selected);
                  if (selected) {
                    selectAllJobs(currentPageJobs);
                  } else {
                    clearSelection();
                  }
                }}
                onBulkApply={handleBulkApply}
                onBulkSave={handleBulkSave}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                totalCount={filteredJobs.length}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                hasNextPage={currentPage * jobsPerPage < filteredJobs.length}
              />
            </div>
          </div>
        </div>

        {/* Selection Summary Modal */}
        {showSelectionSummary && (
          <SelectionSummaryModal
            selectedJobs={selectedJobs}
            selectionStats={selectionStats}
            onClose={() => setShowSelectionSummary(false)}
            onProceedWithAction={(actionType) => {
              console.log("🔧 Dashboard - Proceeding with action:", actionType);
              setShowSelectionSummary(false);

              switch (actionType) {
                case "apply":
                  handleBulkApply();
                  break;
                case "save":
                  handleBulkSave();
                  break;
                case "export":
                  alert("Export functionality will be implemented soon!");
                  break;
                case "generate_letters":
                  alert("Cover letter generation will be implemented soon!");
                  break;
                default:
                  break;
              }
            }}
            actionType={summaryActionType}
            userTier={userTier}
            estimatedCost={selectedJobs.length * 2.99}
            showCostBreakdown={
              userTier === "free" && selectedJobs.length > remainingApplications
            }
          />
        )}

        {/* Application Modal */}
        {showApplicationModal && selectedJobForApplication && (
          <ApplicationModal
            job={selectedJobForApplication}
            onClose={() => {
              setShowApplicationModal(false);
              setSelectedJobForApplication(null);
            }}
            onSubmit={async (applicationData) => {
              console.log(
                "🔧 Dashboard - Application submitted:",
                applicationData
              );

              // Simulate API call
              await new Promise((resolve) => setTimeout(resolve, 2000));

              // Update job status
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
            }}
            userTier={userTier}
            remainingApplications={remainingApplications}
          />
        )}
      </div>
    </ObjectDetectionBoundary>
  );
}
