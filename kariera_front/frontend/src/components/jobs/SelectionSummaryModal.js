// src/components/jobs/SelectionSummaryModal.js - FIXED VERSION
import React, { useState, useMemo } from "react";
import {
  X,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  MapPin,
  Building2,
  Briefcase,
  Clock,
  Users,
  Star,
  FileText,
  CreditCard,
  Zap,
  Download,
  Share2,
  BarChart3,
  Filter,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";

export default function SelectionSummaryModal({
  selectedJobs = [],
  selectionStats,
  onClose,
  onProceedWithAction,
  onRemoveJob,
  onToggleJobVisibility,
  actionType = "apply", // 'apply', 'save', 'export', 'generate_letters'
  userTier = "free",
  estimatedCost = 0,
  showCostBreakdown = false,
}) {
  const [viewMode, setViewMode] = useState("summary"); // 'summary', 'list', 'analytics'
  const [sortBy, setSortBy] = useState("company"); // 'company', 'salary', 'date', 'title'
  const [showHiddenJobs, setShowHiddenJobs] = useState(true);
  const [hiddenJobIds, setHiddenJobIds] = useState(new Set());

  // FIXED: Enhanced formatSalary function to handle different salary structures
  const formatSalary = (salaryData) => {
    if (!salaryData) return "$0";

    // If it's a number, format normally
    if (typeof salaryData === "number") {
      if (salaryData >= 1000000)
        return `$${(salaryData / 1000000).toFixed(1)}M`;
      if (salaryData >= 1000) return `$${(salaryData / 1000).toFixed(0)}k`;
      return `$${Math.round(salaryData)}`;
    }

    // If it's an object with min, max, currency
    if (typeof salaryData === "object") {
      let amount = 0;
      if (salaryData.min && salaryData.max) {
        amount = (salaryData.min + salaryData.max) / 2;
      } else if (salaryData.max) {
        amount = salaryData.max;
      } else if (salaryData.min) {
        amount = salaryData.min;
      } else if (salaryData.amount) {
        amount = salaryData.amount;
      }

      if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
      if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`;
      return `$${Math.round(amount)}`;
    }

    return "$0";
  };

  // FIXED: Safe salary range rendering
  const renderSalaryRange = (salary) => {
    if (!salary) return "Salary not specified";

    if (typeof salary === "object") {
      if (salary.min && salary.max) {
        return `${formatSalary(salary.min)} - ${formatSalary(salary.max)}`;
      } else if (salary.amount) {
        return formatSalary(salary.amount);
      }
    }

    if (typeof salary === "number") {
      return formatSalary(salary);
    }

    return "Salary not specified";
  };

  // FIXED: Safe salary extraction for calculations
  const getSalaryValue = (salary) => {
    if (!salary) return 0;

    if (typeof salary === "number") return salary;

    if (typeof salary === "object") {
      if (salary.min && salary.max) {
        return (salary.min + salary.max) / 2;
      } else if (salary.max) {
        return salary.max;
      } else if (salary.min) {
        return salary.min;
      } else if (salary.amount) {
        return salary.amount;
      }
    }

    return 0;
  };

  // Sort jobs based on selected criteria
  const sortedJobs = useMemo(() => {
    const visibleJobs = showHiddenJobs
      ? selectedJobs
      : selectedJobs.filter((job) => !hiddenJobIds.has(job.id));

    return [...visibleJobs].sort((a, b) => {
      switch (sortBy) {
        case "company":
          return a.company.localeCompare(b.company);
        case "salary":
          const aSalary = getSalaryValue(a.salary);
          const bSalary = getSalaryValue(b.salary);
          return bSalary - aSalary;
        case "date":
          return new Date(b.posted) - new Date(a.posted);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [selectedJobs, sortBy, showHiddenJobs, hiddenJobIds]);

  // FIXED: Group jobs by company for analytics with safe salary calculation
  const jobsByCompany = useMemo(() => {
    const grouped = selectedJobs.reduce((acc, job) => {
      if (!acc[job.company]) {
        acc[job.company] = [];
      }
      acc[job.company].push(job);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([company, jobs]) => ({
        company,
        jobs,
        count: jobs.length,
        avgSalary:
          jobs.length > 0
            ? jobs.reduce((sum, job) => {
                return sum + getSalaryValue(job.salary);
              }, 0) / jobs.length
            : 0,
        hasRemote: jobs.some((job) => job.remote),
        locations: [...new Set(jobs.map((job) => job.location))],
      }))
      .sort((a, b) => b.count - a.count);
  }, [selectedJobs]);

  const getActionTitle = () => {
    switch (actionType) {
      case "apply":
        return "Apply to Selected Jobs";
      case "save":
        return "Save Selected Jobs";
      case "export":
        return "Export Job List";
      case "generate_letters":
        return "Generate Cover Letters";
      default:
        return "Process Selected Jobs";
    }
  };

  const getActionDescription = () => {
    switch (actionType) {
      case "apply":
        return `Submit applications to ${
          selectionStats?.count || 0
        } selected jobs. Your profile and resume will be automatically customized for each application.`;
      case "save":
        return `Add ${
          selectionStats?.count || 0
        } jobs to your saved jobs list for future reference.`;
      case "export":
        return `Download a detailed report of ${
          selectionStats?.count || 0
        } selected jobs in PDF format.`;
      case "generate_letters":
        return `Create personalized cover letters for ${
          selectionStats?.count || 0
        } jobs using AI.`;
      default:
        return `Process ${selectionStats?.count || 0} selected jobs.`;
    }
  };

  const toggleJobVisibility = (jobId) => {
    setHiddenJobIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
    onToggleJobVisibility?.(jobId);
  };

  const removeJob = (jobId) => {
    onRemoveJob?.(jobId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">{getActionTitle()}</h2>
            <p className="text-gray-400 text-sm mt-1">
              {getActionDescription()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-700 px-6">
          <nav className="flex space-x-8">
            {[
              { id: "summary", label: "Summary", icon: CheckCircle },
              {
                id: "list",
                label: `Jobs (${sortedJobs.length})`,
                icon: FileText,
              },
              { id: "analytics", label: "Analytics", icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id)}
                className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${
                  viewMode === tab.id
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {viewMode === "summary" && (
            <div className="p-6 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {selectionStats?.count || 0}
                  </div>
                  <div className="text-sm text-gray-400">Jobs Selected</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {formatSalary(selectionStats?.averageSalary || 0)}
                  </div>
                  <div className="text-sm text-gray-400">Avg. Salary</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {selectionStats?.companies || 0}
                  </div>
                  <div className="text-sm text-gray-400">Companies</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    {selectionStats?.locations || 0}
                  </div>
                  <div className="text-sm text-gray-400">Locations</div>
                </div>
              </div>

              {/* Action-specific info */}
              {actionType === "apply" && (
                <div className="bg-purple-900/20 border border-purple-500 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-white mb-1">
                        Application Process
                      </h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>
                          • Your resume will be automatically tailored for each
                          job
                        </li>
                        <li>• Cover letters will be generated using AI</li>
                        <li>
                          • Applications will be submitted within 24 hours
                        </li>
                        <li>
                          • You'll receive email notifications for each
                          submission
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Cost Breakdown for Premium Features */}
              {showCostBreakdown && estimatedCost > 0 && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-3">
                    Cost Breakdown
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        {selectionStats?.count || 0} job applications
                      </span>
                      <span className="text-white">
                        ${estimatedCost.toFixed(2)}
                      </span>
                    </div>
                    {actionType === "apply" && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">AI cover letters</span>
                        <span className="text-green-400">Included</span>
                      </div>
                    )}
                    <div className="border-t border-gray-600 pt-2 flex justify-between font-medium">
                      <span className="text-white">Total</span>
                      <span className="text-white">
                        ${estimatedCost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Company Preview */}
              <div>
                <h4 className="font-medium text-white mb-3">
                  Companies Included
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(selectionStats?.uniqueCompanies || [])
                    .slice(0, 8)
                    .map((company) => (
                      <span
                        key={company}
                        className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm"
                      >
                        {company}
                      </span>
                    ))}
                  {(selectionStats?.uniqueCompanies?.length || 0) > 8 && (
                    <span className="px-3 py-1 bg-gray-600/20 text-gray-400 rounded-full text-sm">
                      +{(selectionStats?.uniqueCompanies?.length || 0) - 8} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {viewMode === "list" && (
            <div className="p-6">
              {/* List Controls */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  >
                    <option value="company">Sort by Company</option>
                    <option value="salary">Sort by Salary</option>
                    <option value="date">Sort by Date</option>
                    <option value="title">Sort by Title</option>
                  </select>
                  <label className="flex items-center gap-2 text-sm text-gray-400">
                    <input
                      type="checkbox"
                      checked={showHiddenJobs}
                      onChange={(e) => setShowHiddenJobs(e.target.checked)}
                      className="rounded"
                    />
                    Show hidden jobs
                  </label>
                </div>
                <div className="text-sm text-gray-400">
                  {sortedJobs.length} of {selectedJobs.length} jobs
                </div>
              </div>

              {/* Job List */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {sortedJobs.map((job) => (
                  <div
                    key={job.id}
                    className={`flex items-center justify-between p-4 bg-gray-700 rounded-lg ${
                      hiddenJobIds.has(job.id) ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {job.company.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">
                          {job.title}
                        </div>
                        <div className="text-sm text-gray-400">
                          {job.company} • {job.location}
                        </div>
                        <div className="text-sm text-green-400">
                          {renderSalaryRange(job.salary)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleJobVisibility(job.id)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title={
                          hiddenJobIds.has(job.id) ? "Show job" : "Hide job"
                        }
                      >
                        {hiddenJobIds.has(job.id) ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => removeJob(job.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="Remove from selection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === "analytics" && (
            <div className="p-6 space-y-6">
              {/* Company Breakdown */}
              <div>
                <h4 className="font-medium text-white mb-4">Jobs by Company</h4>
                <div className="space-y-3">
                  {jobsByCompany.slice(0, 5).map((company) => (
                    <div
                      key={company.company}
                      className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center text-white font-bold text-sm">
                          {company.company.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {company.company}
                          </div>
                          <div className="text-sm text-gray-400">
                            {company.locations.join(", ")}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">
                          {company.count} jobs
                        </div>
                        <div className="text-sm text-green-400">
                          Avg. {formatSalary(company.avgSalary)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Job Type Distribution */}
              <div>
                <h4 className="font-medium text-white mb-4">Distribution</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-2">
                      Remote vs On-site
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white">Remote</span>
                        <span className="text-green-400">
                          {selectedJobs.filter((job) => job.remote).length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white">On-site</span>
                        <span className="text-blue-400">
                          {selectedJobs.filter((job) => !job.remote).length}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-2">
                      Experience Level
                    </div>
                    <div className="space-y-2">
                      {[
                        ...new Set(
                          selectedJobs
                            .map((job) => job.experienceLevel)
                            .filter(Boolean)
                        ),
                      ].map((level) => (
                        <div
                          key={level}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-white">{level}</span>
                          <span className="text-purple-400">
                            {
                              selectedJobs.filter(
                                (job) => job.experienceLevel === level
                              ).length
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <div className="text-sm text-gray-400">
            {selectionStats?.count || 0} jobs selected
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onProceedWithAction}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {actionType === "apply" ? "Apply to Jobs" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
