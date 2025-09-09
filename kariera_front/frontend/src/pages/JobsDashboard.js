// src/pages/JobsDashboard.js - FIXED VERSION
import React, { useState, useEffect, useCallback } from "react";
import { Search, MapPin, Filter, Briefcase, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Enhanced components
import FilterSidebar from "../components/jobs/FilterSidebar";
import JobList from "../components/jobs/JobList";
import ApplicationModal from "../components/jobs/ApplicationModal";

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

  // ✅ FIXED: Mock job generator function
  const generateMockJobs = (count = 20) => {
    const companies = [
      "Meta",
      "Google",
      "Apple",
      "Microsoft",
      "Amazon",
      "Netflix",
      "Spotify",
      "Stripe",
    ];
    const positions = [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "UI/UX Designer",
      "Data Scientist",
      "Product Manager",
    ];
    const locations = [
      "San Francisco, CA",
      "New York, NY",
      "Seattle, WA",
      "Austin, TX",
      "Remote",
    ];
    const skills = [
      ["React", "JavaScript", "TypeScript", "CSS"],
      ["Node.js", "Python", "PostgreSQL", "AWS"],
      ["Figma", "Sketch", "Adobe XD", "Prototyping"],
      ["Python", "Machine Learning", "SQL", "TensorFlow"],
    ];

    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      title: positions[index % positions.length],
      company: companies[index % companies.length],
      location: locations[index % locations.length],
      type: "Full-time",
      remote: Math.random() > 0.5,
      salary: {
        min: 80000 + index * 5000,
        max: 120000 + index * 8000,
      },
      posted: `${Math.floor(Math.random() * 7) + 1} days ago`,
      description: `Join our team as a ${
        positions[index % positions.length]
      } and work on exciting projects with cutting-edge technology.`,
      skills: skills[index % skills.length],
      experienceLevel:
        index % 3 === 0 ? "Senior" : index % 3 === 1 ? "Mid-level" : "Junior",
      companySize: "1,000-5,000",
      rating: 4,
      applicants: Math.floor(Math.random() * 300) + 50,
      featured: index % 5 === 0,
      urgentHiring: index % 8 === 0,
      applied: false,
      saved: false,
    }));
  };

  // ✅ FIXED: Apply filters function
  const applyFiltersToJobs = (
    jobs,
    { searchQuery, locationQuery, filters, sortBy }
  ) => {
    let filtered = [...jobs];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.skills.some((skill) => skill.toLowerCase().includes(query)) ||
          job.location.toLowerCase().includes(query)
      );
    }

    // Apply location filter
    if (locationQuery.trim()) {
      const location = locationQuery.toLowerCase();
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(location)
      );
    }

    // Apply job type filters
    if (filters.jobType && filters.jobType.length > 0) {
      filtered = filtered.filter((job) => filters.jobType.includes(job.type));
    }

    // Apply work setting filter
    if (filters.workSetting === "remote") {
      filtered = filtered.filter((job) => job.remote);
    } else if (filters.workSetting === "onsite") {
      filtered = filtered.filter((job) => !job.remote);
    }

    // Apply salary range filter
    if (filters.salaryRange) {
      filtered = filtered.filter((job) => {
        const jobMaxSalary = job.salary?.max || 0;
        return (
          jobMaxSalary >= filters.salaryRange.min &&
          jobMaxSalary <= filters.salaryRange.max
        );
      });
    }

    // Apply experience level filter
    if (filters.experienceLevel && filters.experienceLevel.length > 0) {
      filtered = filtered.filter((job) =>
        filters.experienceLevel.includes(job.experienceLevel)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.posted) - new Date(a.posted);
        case "oldest":
          return new Date(a.posted) - new Date(b.posted);
        case "salary_high":
          return (b.salary?.max || 0) - (a.salary?.max || 0);
        case "salary_low":
          return (a.salary?.max || 0) - (b.salary?.max || 0);
        case "company":
          return a.company.localeCompare(b.company);
        default: // relevance
          return b.featured ? 1 : -1;
      }
    });

    return filtered;
  };

  // ✅ FIXED: Load initial jobs with proper error handling
  useEffect(() => {
    const loadJobs = async () => {
      console.log("🔄 Loading jobs...");
      setLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("📝 Generating mock jobs...");
        const jobs = generateMockJobs(50); // Generate 50 mock jobs

        console.log("✅ Jobs loaded successfully:", jobs.length);
        setAllJobs(jobs);
      } catch (err) {
        console.error("❌ Error loading jobs:", err);
        setError("Failed to load jobs. Please try again.");
      } finally {
        // ✅ CRITICAL FIX: Always set loading to false
        console.log("🏁 Loading complete");
        setLoading(false);
      }
    };

    loadJobs();
  }, []); // ✅ Empty dependency array - only run once

  // ✅ FIXED: Apply filters and search with proper dependencies
  useEffect(() => {
    console.log("🔍 Applying filters...");

    if (allJobs.length === 0) {
      setFilteredJobs([]);
      return;
    }

    try {
      const filtered = applyFiltersToJobs(allJobs, {
        searchQuery,
        locationQuery,
        filters,
        sortBy,
      });

      console.log("✅ Filtered jobs:", filtered.length);
      setFilteredJobs(filtered);
      setCurrentPage(1); // Reset to first page when filters change
    } catch (err) {
      console.error("❌ Error applying filters:", err);
      setFilteredJobs(allJobs); // Fallback to all jobs
    }
  }, [allJobs, searchQuery, locationQuery, filters, sortBy]); // ✅ Proper dependencies

  // ✅ FIXED: Handle job selection with useCallback
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

  // ✅ FIXED: Handle select all with useCallback
  const handleSelectAll = useCallback(
    (selected, jobIds = []) => {
      if (selected) {
        const currentPageJobs = filteredJobs.slice(
          (currentPage - 1) * jobsPerPage,
          currentPage * jobsPerPage
        );
        const allJobIds =
          jobIds.length > 0 ? jobIds : currentPageJobs.map((job) => job.id);
        setSelectedJobs(new Set(allJobIds));
      } else {
        setSelectedJobs(new Set());
      }
    },
    [filteredJobs, currentPage, jobsPerPage]
  );

  // ✅ FIXED: Handle bulk apply with proper async handling
  const handleBulkApply = useCallback(async () => {
    if (selectedJobs.size === 0) return;

    console.log("📤 Bulk applying to jobs:", selectedJobs.size);

    try {
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

      console.log("✅ Bulk apply completed");
      // You can replace this with a toast notification
      alert(`Successfully applied to ${selectedJobs.size} jobs!`);
    } catch (err) {
      console.error("❌ Error in bulk apply:", err);
      alert("Failed to apply to jobs. Please try again.");
    }
  }, [selectedJobs]);

  // ✅ FIXED: Handle bulk save
  const handleBulkSave = useCallback(async () => {
    if (selectedJobs.size === 0) return;

    console.log("💾 Bulk saving jobs:", selectedJobs.size);

    try {
      // Update saved status for selected jobs
      setAllJobs((prev) =>
        prev.map((job) =>
          selectedJobs.has(job.id) ? { ...job, saved: true } : job
        )
      );

      console.log("✅ Bulk save completed");
      alert(`Successfully saved ${selectedJobs.size} jobs!`);
    } catch (err) {
      console.error("❌ Error in bulk save:", err);
      alert("Failed to save jobs. Please try again.");
    }
  }, [selectedJobs]);

  // ✅ FIXED: Handle individual job save
  const handleJobSave = useCallback((jobId) => {
    setAllJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, saved: !job.saved } : job
      )
    );
  }, []);

  // ✅ FIXED: Handle individual job apply
  const handleJobApply = useCallback(
    (jobId) => {
      if (remainingApplications <= 0) {
        alert(
          "You have reached your application limit. Please upgrade your plan."
        );
        return;
      }

      setAllJobs((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, applied: true } : job))
      );

      setRemainingApplications((prev) => prev - 1);
    },
    [remainingApplications]
  );

  // Get current page jobs
  const getCurrentPageJobs = () => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    return filteredJobs.slice(startIndex, endIndex);
  };

  const currentPageJobs = getCurrentPageJobs();
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const hasNextPage = currentPage < totalPages;

  // ✅ FIXED: Loading state with proper feedback
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-xl">Loading jobs...</div>
          <div className="text-gray-400 mt-2">
            This should only take a moment
          </div>
        </div>
      </div>
    );
  }

  // ✅ FIXED: Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
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

            {/* Search Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Location"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="relevance">Most Relevant</option>
                <option value="newest">Newest First</option>
                <option value="salary_high">Highest Salary</option>
                <option value="company">Company A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* ✅ RESTORED: Filter Sidebar */}
          {showFilterSidebar && (
            <div className="w-80 flex-shrink-0">
              <FilterSidebar
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={() =>
                  setFilters({
                    datePosted: "any",
                    jobType: [],
                    workSetting: "any",
                    salaryRange: { min: 0, max: 200000 },
                    experienceLevel: [],
                  })
                }
                jobCount={filteredJobs.length}
              />
            </div>
          )}

          {/* Jobs List */}
          <div className="flex-1 min-w-0">
            {/* Toggle Sidebar Button */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowFilterSidebar(!showFilterSidebar)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                {showFilterSidebar ? "Hide Filters" : "Show Filters"}
              </button>

              <div className="text-sm text-gray-400">
                Showing {currentPageJobs.length} of {filteredJobs.length} jobs
              </div>
            </div>

            <JobList
              jobs={currentPageJobs}
              loading={false}
              error={null}
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
              showFilters={true}
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
          onClose={() => {
            setShowApplicationModal(false);
            setSelectedJobForApplication(null);
          }}
          onSubmit={(applicationData) => {
            console.log("Application submitted:", applicationData);
            handleJobApply(selectedJobForApplication.id);
            setShowApplicationModal(false);
            setSelectedJobForApplication(null);
          }}
        />
      )}
    </div>
  );
}
