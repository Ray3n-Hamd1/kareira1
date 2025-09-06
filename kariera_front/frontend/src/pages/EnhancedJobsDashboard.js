// src/pages/EnhancedJobsDashboard.js - Complete integration example
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

// Enhanced components for Step 6
import { useJobSelection } from "../hooks/useJobSelection";
import EnhancedBulkActionBar from "../components/jobs/EnhancedBulkActionBar";
import SelectionSummaryModal from "../components/jobs/SelectionSummaryModal";
import {
  quickSelectionUtils,
  QuickSelectionSuggestions,
} from "../utils/quickSelection";

// Existing components
import FilterSidebar from "../components/jobs/FilterSidebar";
import JobList from "../components/jobs/JobList";
import ApplicationModal from "../components/jobs/ApplicationModal";

// Mock job service
import {
  generateMockJobs,
  applyFiltersToJobs,
} from "../services/mockJobService";

export default function EnhancedJobsDashboard() {
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

  // Enhanced selection state using our custom hook
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
  } = useJobSelection(filteredJobs);

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
    const loadJobs = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const jobs = generateMockJobs(100);
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
    setCurrentPage(1);
  }, [allJobs, searchQuery, locationQuery, filters, sortBy]);

  // Handle bulk apply with summary modal
  const handleBulkApply = useCallback(() => {
    if (selectedJobs.length === 0) return;

    setSummaryActionType("apply");
    setShowSelectionSummary(true);
  }, [selectedJobs.length]);

  // Handle bulk save
  const handleBulkSave = useCallback(() => {
    if (selectedJobs.length === 0) return;

    setSummaryActionType("save");
    setShowSelectionSummary(true);
  }, [selectedJobs.length]);

  // Handle cover letter generation
  const handleGenerateCoverLetters = useCallback(() => {
    if (selectedJobs.length === 0) return;

    setSummaryActionType("generate_letters");
    setShowSelectionSummary(true);
  }, [selectedJobs.length]);

  // Handle export selection
  const handleExportSelection = useCallback(() => {
    if (selectedJobs.length === 0) return;

    setSummaryActionType("export");
    setShowSelectionSummary(true);
  }, [selectedJobs.length]);

  // Process action from summary modal
  const handleProceedWithAction = useCallback(
    async (jobsToProcess) => {
      console.log(
        `Processing ${summaryActionType} for ${jobsToProcess.length} jobs:`,
        jobsToProcess
      );

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      switch (summaryActionType) {
        case "apply":
          // Update applied status for selected jobs
          setAllJobs((prev) =>
            prev.map((job) =>
              jobsToProcess.some((selected) => selected.id === job.id)
                ? { ...job, applied: true }
                : job
            )
          );
          setRemainingApplications((prev) =>
            Math.max(0, prev - jobsToProcess.length)
          );
          break;

        case "save":
          // Update saved status for selected jobs
          setAllJobs((prev) =>
            prev.map((job) =>
              jobsToProcess.some((selected) => selected.id === job.id)
                ? { ...job, saved: true }
                : job
            )
          );
          break;

        case "export":
          // Trigger download (mock)
          console.log("Downloading job report...");
          break;

        case "generate_letters":
          // Generate cover letters (mock)
          console.log("Generating cover letters...");
          break;
      }

      setShowSelectionSummary(false);
      clearSelection();

      // Show success message
      const actionMessages = {
        apply: `Successfully applied to ${jobsToProcess.length} jobs!`,
        save: `Successfully saved ${jobsToProcess.length} jobs!`,
        export: "Job report downloaded successfully!",
        generate_letters: `Generated ${jobsToProcess.length} cover letters!`,
      };

      alert(actionMessages[summaryActionType]);
    },
    [summaryActionType, clearSelection]
  );

  // Handle individual job actions
  const handleJobSave = useCallback((jobId) => {
    setAllJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, saved: !job.saved } : job
      )
    );
  }, []);

  const handleJobApply = useCallback((job) => {
    setSelectedJobForApplication(job);
    setShowApplicationModal(true);
  }, []);

  // Handle application submission
  const handleApplicationSubmit = useCallback(
    async (applicationData) => {
      console.log("Submitting application:", applicationData);

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

  // Quick selection handlers
  const handleQuickSelect = useCallback(
    (type) => {
      switch (type) {
        case "remote":
          selectByFilter((job) => job.remote);
          break;
        case "high-salary":
          selectBySalaryRange(100000, Infinity);
          break;
        case "recent":
          selectByFilter((job) => {
            const posted = new Date(job.posted);
            const now = new Date();
            const diffDays = (now - posted) / (1000 * 60 * 60 * 24);
            return diffDays <= 7;
          });
          break;
        case "featured":
          selectByFilter((job) => job.featured);
          break;
      }
    },
    [selectByFilter, selectBySalaryRange]
  );

  // Apply smart suggestions
  const handleApplySuggestion = useCallback(
    (suggestionJobs) => {
      suggestionJobs.forEach((job) => {
        if (!isJobSelected(job.id)) {
          toggleJobSelection(job.id);
        }
      });
    },
    [isJobSelected, toggleJobSelection]
  );

  // Remove job from selection (from summary modal)
  const handleRemoveJobFromSelection = useCallback(
    (jobId) => {
      if (isJobSelected(jobId)) {
        toggleJobSelection(jobId);
      }
    },
    [isJobSelected, toggleJobSelection]
  );

  // Get current page jobs
  const getCurrentPageJobs = useCallback(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    return filteredJobs.slice(startIndex, endIndex);
  }, [filteredJobs, currentPage, jobsPerPage]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const hasNextPage = currentPage < totalPages;
  const currentPageJobs = getCurrentPageJobs();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Enhanced Bulk Action Bar */}
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
        isVisible={selectedJobs.length > 0}
      />

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
                {selectedJobs.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-purple-400">
                    <span>{selectedJobs.length} jobs selected</span>
                  </div>
                )}
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
            <div className="hidden lg:block w-80 flex-shrink-0 space-y-6">
              <FilterSidebar filters={filters} onFiltersChange={setFilters} />

              {/* Smart Selection Suggestions */}
              {showSmartSuggestions && (
                <QuickSelectionSuggestions
                  jobs={filteredJobs}
                  currentSelection={selectedJobs}
                  onApplySuggestion={handleApplySuggestion}
                />
              )}
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
              selectedJobs={selectedJobIds}
              onJobSelect={(jobId, selected, event) =>
                toggleJobSelection(jobId, event)
              }
              onSelectAll={(selected) =>
                selected ? selectAllJobs() : clearSelection()
              }
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

      {/* Selection Summary Modal */}
      {showSelectionSummary && (
        <SelectionSummaryModal
          selectedJobs={selectedJobs}
          selectionStats={selectionStats}
          onClose={() => setShowSelectionSummary(false)}
          onProceedWithAction={handleProceedWithAction}
          onRemoveJob={handleRemoveJobFromSelection}
          actionType={summaryActionType}
          userTier={userTier}
          estimatedCost={
            summaryActionType === "apply" ? selectedJobs.length * 0.99 : 0
          }
          showCostBreakdown={
            userTier === "free" && selectedJobs.length > remainingApplications
          }
        />
      )}

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
