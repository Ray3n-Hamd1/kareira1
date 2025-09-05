import React, { useState, useEffect } from "react";
import { Search, MapPin, Filter, Grid3X3, List } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// We'll create these components in the next steps
import FilterSidebar from "../components/jobs/FilterSidebar.js";
import JobsList from "../components/jobs/JobsList";
import BulkActionBar from "../components/jobs/BulkActionBar";
import ApplicationModal from "../components/jobs/ApplicationModal";

export default function JobsDashboard() {
  const { user } = useAuth();

  // Main state management
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [filters, setFilters] = useState({
    datePosted: "any",
    jobType: [],
    workSetting: "any",
    salaryRange: { min: 0, max: 200000 },
    experienceLevel: [],
  });

  // Selection and bulk actions
  const [selectedJobs, setSelectedJobs] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Modal states
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJobForApplication, setSelectedJobForApplication] =
    useState(null);
  const [showFilterSidebar, setShowFilterSidebar] = useState(true);

  // Mock data for development - will be replaced with API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockJobs = generateMockJobs();
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter jobs based on search and filters
  useEffect(() => {
    let filtered = jobs.filter((job) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase());

      // Location filter
      const matchesLocation =
        !locationQuery ||
        job.location.toLowerCase().includes(locationQuery.toLowerCase());

      // Date filter
      const matchesDate =
        filters.datePosted === "any" ||
        checkDateFilter(job.posted, filters.datePosted);

      // Job type filter
      const matchesType =
        filters.jobType.length === 0 || filters.jobType.includes(job.type);

      // Work setting filter
      const matchesWorkSetting =
        filters.workSetting === "any" ||
        (filters.workSetting === "remote" && job.remote) ||
        (filters.workSetting === "on-site" && !job.remote);

      // Salary filter
      const matchesSalary =
        job.salary.max >= filters.salaryRange.min &&
        job.salary.min <= filters.salaryRange.max;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesDate &&
        matchesType &&
        matchesWorkSetting &&
        matchesSalary
      );
    });

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, locationQuery, filters]);

  const handleJobSelect = (jobId, selected) => {
    const newSelected = new Set(selectedJobs);
    if (selected) {
      newSelected.add(jobId);
    } else {
      newSelected.delete(jobId);
    }
    setSelectedJobs(newSelected);
    setSelectAll(newSelected.size === filteredJobs.length);
  };

  const handleSelectAll = (selected) => {
    if (selected) {
      const allJobIds = new Set(filteredJobs.map((job) => job.id));
      setSelectedJobs(allJobIds);
    } else {
      setSelectedJobs(new Set());
    }
    setSelectAll(selected);
  };

  const handleApplyToJob = (job) => {
    setSelectedJobForApplication(job);
    setShowApplicationModal(true);
  };

  const handleBulkApply = () => {
    const selectedJobsList = filteredJobs.filter((job) =>
      selectedJobs.has(job.id)
    );
    console.log("Bulk apply to:", selectedJobsList);
    // Will implement bulk application flow
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
                Find your next opportunity
              </h1>
              <p className="text-gray-400">
                {filteredJobs.length} jobs available
              </p>
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

            {/* View controls and results count */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${
                    viewMode === "grid"
                      ? "bg-purple-600"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${
                    viewMode === "list"
                      ? "bg-purple-600"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {selectedJobs.size > 0 && (
                <div className="text-sm text-gray-400">
                  {selectedJobs.size} job{selectedJobs.size !== 1 ? "s" : ""}{" "}
                  selected
                </div>
              )}
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
            {/* Bulk actions bar */}
            {selectedJobs.size > 0 && (
              <BulkActionBar
                selectedCount={selectedJobs.size}
                onBulkApply={handleBulkApply}
                onClearSelection={() => {
                  setSelectedJobs(new Set());
                  setSelectAll(false);
                }}
              />
            )}

            {/* Jobs list */}
            <JobsList
              jobs={filteredJobs}
              loading={loading}
              viewMode={viewMode}
              selectedJobs={selectedJobs}
              selectAll={selectAll}
              onJobSelect={handleJobSelect}
              onSelectAll={handleSelectAll}
              onApplyToJob={handleApplyToJob}
            />
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <ApplicationModal
          job={selectedJobForApplication}
          onClose={() => {
            setShowApplicationModal(false);
            setSelectedJobForApplication(null);
          }}
          onSubmit={(applicationData) => {
            console.log("Application submitted:", applicationData);
            setShowApplicationModal(false);
            setSelectedJobForApplication(null);
          }}
        />
      )}
    </div>
  );
}

// Helper functions
function generateMockJobs() {
  const companies = [
    "Google",
    "Microsoft",
    "Apple",
    "Amazon",
    "Meta",
    "Netflix",
    "Tesla",
    "Spotify",
  ];
  const titles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "Product Manager",
    "UX Designer",
    "DevOps Engineer",
  ];
  const locations = [
    "San Francisco, CA",
    "New York, NY",
    "Seattle, WA",
    "Austin, TX",
    "Remote",
    "London, UK",
    "Toronto, CA",
  ];
  const types = ["full-time", "part-time", "contract", "internship"];

  return Array.from({ length: 50 }, (_, i) => ({
    id: `job-${i + 1}`,
    title: titles[Math.floor(Math.random() * titles.length)],
    company: companies[Math.floor(Math.random() * companies.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    salary: {
      min: 80000 + Math.floor(Math.random() * 50000),
      max: 120000 + Math.floor(Math.random() * 100000),
      currency: "USD",
    },
    type: types[Math.floor(Math.random() * types.length)],
    remote: Math.random() > 0.6,
    description:
      "We are looking for a talented professional to join our team...",
    requirements: [
      "Bachelor's degree",
      "3+ years experience",
      "Strong problem-solving skills",
    ],
    posted: new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    ),
    applicationCount: Math.floor(Math.random() * 200),
    companyLogo: `https://logo.clearbit.com/${companies[
      Math.floor(Math.random() * companies.length)
    ].toLowerCase()}.com`,
    saved: Math.random() > 0.8,
    applied: Math.random() > 0.9,
  }));
}

function checkDateFilter(postedDate, filter) {
  const now = new Date();
  const posted = new Date(postedDate);

  switch (filter) {
    case "last-day":
      return now - posted <= 24 * 60 * 60 * 1000;
    case "last-week":
      return now - posted <= 7 * 24 * 60 * 60 * 1000;
    case "last-month":
      return now - posted <= 30 * 24 * 60 * 60 * 1000;
    default:
      return true;
  }
}
