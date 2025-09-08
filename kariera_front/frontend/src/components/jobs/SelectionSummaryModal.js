// DEBUG VERSION - SelectionSummaryModal.js
import React, { useState, useMemo, useEffect } from "react";
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

// DEBUG: Safe rendering wrapper for this component
const SafeRender = ({ children, label, value }) => {
  useEffect(() => {
    console.log(`🚨 Modal SafeRender [${label}]:`, value);
    console.log(`🚨 Modal SafeRender [${label}] type:`, typeof value);

    if (value && typeof value === "object" && !React.isValidElement(value)) {
      console.error(`🚨 MODAL OBJECT DETECTED in ${label}:`, value);
      console.error(`🚨 This will cause React error!`);
    }
  }, [value, label]);

  if (value && typeof value === "object" && !React.isValidElement(value)) {
    console.error(`🚨 MODAL PREVENTING OBJECT RENDER in ${label}:`, value);
    return (
      <span style={{ color: "red" }}>ERROR: Object detected in {label}</span>
    );
  }

  return children;
};

// DEBUG: Safe formatSalary function
const formatSalary = (amount, context = "unknown") => {
  console.log(`💰 Modal formatSalary called from ${context}:`, amount);
  console.log(`💰 Modal formatSalary type:`, typeof amount);

  if (!amount && amount !== 0) {
    console.log(`💰 Modal formatSalary: amount is falsy, returning $0`);
    return "$0";
  }

  if (typeof amount === "object") {
    console.error(`💰 Modal formatSalary: OBJECT DETECTED!`, amount);
    return "$0 (object detected)";
  }

  if (isNaN(amount)) {
    console.log(`💰 Modal formatSalary: amount is NaN, returning $0`);
    return "$0";
  }

  let result;
  if (amount >= 1000000) {
    result = `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    result = `$${(amount / 1000).toFixed(0)}k`;
  } else {
    result = `$${Math.round(amount)}`;
  }

  console.log(`💰 Modal formatSalary result:`, result);
  return result;
};

export default function SelectionSummaryModal({
  selectedJobs = [],
  selectionStats,
  onClose,
  onProceedWithAction,
  onRemoveJob,
  onToggleJobVisibility,
  actionType = "apply",
  userTier = "free",
  estimatedCost = 0,
  showCostBreakdown = false,
}) {
  console.log("🔧 ========== SELECTION SUMMARY MODAL RENDER ==========");
  console.log("🔧 Modal Props received:");
  console.log("🔧 - selectedJobs:", selectedJobs?.length || 0);
  console.log("🔧 - selectionStats:", selectionStats);
  console.log("🔧 - selectionStats type:", typeof selectionStats);
  console.log("🔧 - actionType:", actionType);

  // DEBUG: Check averageSalary specifically in modal
  if (selectionStats?.averageSalary) {
    console.log(
      "🔧 Modal - selectionStats.averageSalary:",
      selectionStats.averageSalary
    );
    console.log(
      "🔧 Modal - selectionStats.averageSalary type:",
      typeof selectionStats.averageSalary
    );

    if (typeof selectionStats.averageSalary === "object") {
      console.error(
        "🚨 MODAL CRITICAL: averageSalary is an object!",
        selectionStats.averageSalary
      );
    }
  }

  const [viewMode, setViewMode] = useState("summary");
  const [sortBy, setSortBy] = useState("company");
  const [showHiddenJobs, setShowHiddenJobs] = useState(true);
  const [hiddenJobIds, setHiddenJobIds] = useState(new Set());

  // Sort jobs based on selected criteria
  const sortedJobs = useMemo(() => {
    console.log("🔧 Modal calculating sortedJobs...");

    const visibleJobs = showHiddenJobs
      ? selectedJobs
      : selectedJobs.filter((job) => !hiddenJobIds.has(job.id));

    return [...visibleJobs].sort((a, b) => {
      switch (sortBy) {
        case "company":
          return a.company.localeCompare(b.company);
        case "salary":
          const aSalary = a.salary?.max || a.salary?.amount || 0;
          const bSalary = b.salary?.max || b.salary?.amount || 0;
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

  // Group jobs by company for analytics - WITH DEBUGGING
  const jobsByCompany = useMemo(() => {
    console.log("🔧 Modal calculating jobsByCompany...");

    const grouped = selectedJobs.reduce((acc, job) => {
      if (!acc[job.company]) {
        acc[job.company] = [];
      }
      acc[job.company].push(job);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([company, jobs]) => {
        console.log(
          `🔧 Modal processing company ${company} with ${jobs.length} jobs`
        );

        // SAFE calculation of average salary
        const salarySum = jobs.reduce((sum, job) => {
          console.log(`🔧 Modal - job salary for ${company}:`, job.salary);

          if (!job.salary) return sum;

          let amount = 0;
          if (typeof job.salary === "number") {
            amount = job.salary;
          } else if (typeof job.salary === "object") {
            if (job.salary.min && job.salary.max) {
              amount = (job.salary.min + job.salary.max) / 2;
            } else if (job.salary.amount) {
              amount = job.salary.amount;
            }
          }

          console.log(`🔧 Modal - calculated amount for ${company}:`, amount);
          return sum + amount;
        }, 0);

        const avgSalary =
          jobs.length > 0 ? Math.round(salarySum / jobs.length) : 0;
        console.log(`🔧 Modal - final avgSalary for ${company}:`, avgSalary);

        return {
          company,
          jobs,
          count: jobs.length,
          avgSalary: avgSalary, // This should always be a number now
          hasRemote: jobs.some((job) => job.remote),
          locations: [...new Set(jobs.map((job) => job.location))],
        };
      })
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
        return `Submit applications to ${selectionStats.count} selected jobs. Your profile and resume will be automatically customized for each application.`;
      case "save":
        return `Add ${selectionStats.count} jobs to your saved jobs list for future reference.`;
      case "export":
        return `Download a detailed report of ${selectionStats.count} selected jobs in PDF format.`;
      case "generate_letters":
        return `Create personalized cover letters for ${selectionStats.count} jobs using AI.`;
      default:
        return `Process ${selectionStats.count} selected jobs.`;
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

  const getOverallSalaryStats = () => {
    console.log("🔧 Modal calculating overall salary stats...");

    const salaries = selectedJobs.map((job) => job.salary).filter(Boolean);
    console.log("🔧 Modal - filtered salaries:", salaries);

    if (salaries.length === 0) {
      console.log("🔧 Modal - no salaries found");
      return {
        average: "N/A",
        min: "N/A",
        max: "N/A",
        range: "N/A",
      };
    }

    const amounts = salaries
      .map((s) => {
        if (s.min && s.max) return (s.min + s.max) / 2;
        return s.amount || s.max || s.min || 0;
      })
      .filter((a) => a > 0);

    const minAmounts = salaries
      .map((s) => s.min || s.amount || 0)
      .filter((a) => a > 0);
    const maxAmounts = salaries
      .map((s) => s.max || s.amount || 0)
      .filter((a) => a > 0);

    const avgAmount =
      amounts.length > 0
        ? amounts.reduce((a, b) => a + b, 0) / amounts.length
        : 0;

    const result = {
      average: Math.round(avgAmount),
      min: minAmounts.length > 0 ? Math.min(...minAmounts) : 0,
      max: maxAmounts.length > 0 ? Math.max(...maxAmounts) : 0,
      range:
        amounts.length > 0
          ? `${Math.min(...amounts)} - ${Math.max(...amounts)}`
          : "N/A",
    };

    console.log("🔧 Modal - salary stats calculated:", result);
    return result;
  };

  const salaryStats = getOverallSalaryStats();

  // SAFE VALUES for rendering
  const safeAverageSalary = (() => {
    const value = selectionStats?.averageSalary || 0;
    if (typeof value === "object") {
      console.error("🚨 Modal forcing averageSalary object to 0");
      return 0;
    }
    return Number(value) || 0;
  })();

  const safeSalaryStatsAverage = (() => {
    const value = salaryStats.average;
    if (typeof value === "object") {
      console.error("🚨 Modal forcing salaryStats.average object to 0");
      return 0;
    }
    return Number(value) || 0;
  })();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {getActionTitle()}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {getActionDescription()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center gap-1 mt-4 bg-gray-800 rounded-lg p-1">
            {["summary", "list", "analytics"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                  viewMode === mode
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {viewMode === "summary" && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    <SafeRender
                      label="modal-summary-count"
                      value={selectionStats.count}
                    >
                      {selectionStats.count}
                    </SafeRender>
                  </div>
                  <div className="text-sm text-gray-400">Jobs Selected</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    <SafeRender
                      label="modal-summary-avg-salary"
                      value={safeSalaryStatsAverage}
                    >
                      {formatSalary(
                        safeSalaryStatsAverage,
                        "modal-summary-average"
                      )}
                    </SafeRender>
                  </div>
                  <div className="text-sm text-gray-400">Avg. Salary</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    <SafeRender
                      label="modal-summary-companies"
                      value={selectionStats.companies}
                    >
                      {selectionStats.companies}
                    </SafeRender>
                  </div>
                  <div className="text-sm text-gray-400">Companies</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    <SafeRender
                      label="modal-summary-remote"
                      value={selectedJobs.filter((job) => job.remote).length}
                    >
                      {selectedJobs.filter((job) => job.remote).length}
                    </SafeRender>
                  </div>
                  <div className="text-sm text-gray-400">Remote Jobs</div>
                </div>
              </div>

              {/* Salary Analysis */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Salary Analysis
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-400">
                      <SafeRender
                        label="modal-salary-min"
                        value={salaryStats.min}
                      >
                        {typeof salaryStats.min === "number"
                          ? formatSalary(salaryStats.min, "modal-salary-min")
                          : salaryStats.min}
                      </SafeRender>
                    </div>
                    <div className="text-sm text-gray-400">Minimum</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-400">
                      <SafeRender
                        label="modal-salary-avg"
                        value={safeSalaryStatsAverage}
                      >
                        {formatSalary(
                          safeSalaryStatsAverage,
                          "modal-salary-average"
                        )}
                      </SafeRender>
                    </div>
                    <div className="text-sm text-gray-400">Average</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-400">
                      <SafeRender
                        label="modal-salary-max"
                        value={salaryStats.max}
                      >
                        {typeof salaryStats.max === "number"
                          ? formatSalary(salaryStats.max, "modal-salary-max")
                          : salaryStats.max}
                      </SafeRender>
                    </div>
                    <div className="text-sm text-gray-400">Maximum</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-orange-400">
                      <SafeRender
                        label="modal-salary-range"
                        value={salaryStats.range}
                      >
                        {salaryStats.range}
                      </SafeRender>
                    </div>
                    <div className="text-sm text-gray-400">Full Range</div>
                  </div>
                </div>
              </div>

              {/* Top Companies */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  Top Companies
                </h3>
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
                          <SafeRender
                            label={`modal-company-count-${company.company}`}
                            value={company.count}
                          >
                            {company.count} jobs
                          </SafeRender>
                        </div>
                        <div className="text-sm text-green-400">
                          <SafeRender
                            label={`modal-company-avg-${company.company}`}
                            value={company.avgSalary}
                          >
                            Avg.{" "}
                            {formatSalary(
                              company.avgSalary || 0,
                              `modal-company-${company.company}`
                            )}
                          </SafeRender>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {viewMode === "list" && (
            <div className="space-y-4">
              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white text-sm"
                    >
                      <option value="company">Sort by Company</option>
                      <option value="salary">Sort by Salary</option>
                      <option value="date">Sort by Date</option>
                      <option value="title">Sort by Title</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={showHiddenJobs}
                      onChange={(e) => setShowHiddenJobs(e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    Show hidden jobs
                  </label>
                </div>
                <div className="text-sm text-gray-400">
                  {sortedJobs.length} of {selectedJobs.length} jobs
                </div>
              </div>

              {/* Job List */}
              <div className="space-y-3">
                {sortedJobs.map((job) => (
                  <div
                    key={job.id}
                    className={`bg-gray-800 rounded-lg p-4 ${
                      hiddenJobIds.has(job.id) ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-white">
                            {job.title}
                          </h4>
                          {job.remote && (
                            <span className="bg-green-400/10 text-green-400 px-2 py-1 rounded text-xs">
                              Remote
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-300 mb-2">
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            <span>{job.company}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-medium text-green-400">
                              <SafeRender
                                label={`modal-job-salary-${job.id}`}
                                value={job.salary}
                              >
                                {job.salary
                                  ? typeof job.salary === "object"
                                    ? `${formatSalary(
                                        job.salary.min || 0,
                                        `modal-job-${job.id}-min`
                                      )} - ${formatSalary(
                                        job.salary.max || 0,
                                        `modal-job-${job.id}-max`
                                      )}`
                                    : formatSalary(
                                        job.salary,
                                        `modal-job-${job.id}`
                                      )
                                  : "Salary not specified"}
                              </SafeRender>
                            </span>
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === "analytics" && (
            <div className="space-y-6">
              {/* Salary Distribution Chart Placeholder */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Salary Distribution
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      <SafeRender
                        label="modal-analytics-under-80k"
                        value={
                          selectedJobs.filter((job) => {
                            const salary =
                              job.salary?.max || job.salary?.amount || 0;
                            return salary < 80000;
                          }).length
                        }
                      >
                        {
                          selectedJobs.filter((job) => {
                            const salary =
                              job.salary?.max || job.salary?.amount || 0;
                            return salary < 80000;
                          }).length
                        }
                      </SafeRender>
                    </div>
                    <div className="text-sm text-gray-400">Under $80k</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">
                      <SafeRender
                        label="modal-analytics-80k-120k"
                        value={
                          selectedJobs.filter((job) => {
                            const salary =
                              job.salary?.max || job.salary?.amount || 0;
                            return salary >= 80000 && salary < 120000;
                          }).length
                        }
                      >
                        {
                          selectedJobs.filter((job) => {
                            const salary =
                              job.salary?.max || job.salary?.amount || 0;
                            return salary >= 80000 && salary < 120000;
                          }).length
                        }
                      </SafeRender>
                    </div>
                    <div className="text-sm text-gray-400">$80k - $120k</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">
                      <SafeRender
                        label="modal-analytics-over-120k"
                        value={
                          selectedJobs.filter((job) => {
                            const salary =
                              job.salary?.max || job.salary?.amount || 0;
                            return salary >= 120000;
                          }).length
                        }
                      >
                        {
                          selectedJobs.filter((job) => {
                            const salary =
                              job.salary?.max || job.salary?.amount || 0;
                            return salary >= 120000;
                          }).length
                        }
                      </SafeRender>
                    </div>
                    <div className="text-sm text-gray-400">$120k+</div>
                  </div>
                </div>
              </div>

              {/* Company Analysis */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Company Analysis
                </h3>
                <div className="space-y-4">
                  {jobsByCompany.map((company) => (
                    <div
                      key={company.company}
                      className="border-l-4 border-purple-500 pl-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-white">
                            {company.company}
                          </h4>
                          <p className="text-sm text-gray-400">
                            <SafeRender
                              label={`modal-analytics-company-count-${company.company}`}
                              value={company.count}
                            >
                              {company.count} jobs
                            </SafeRender>
                            {" • "}
                            {company.locations.join(", ")}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-400">
                            <SafeRender
                              label={`modal-analytics-company-avg-${company.company}`}
                              value={company.avgSalary}
                            >
                              {formatSalary(
                                company.avgSalary || 0,
                                `modal-analytics-company-${company.company}`
                              )}
                            </SafeRender>
                          </div>
                          <div className="text-sm text-gray-400">Average</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <div className="flex items-center gap-4">
            {showCostBreakdown && estimatedCost > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">
                  Estimated cost: ${estimatedCost}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onProceedWithAction?.(actionType)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              {actionType === "apply" && <Send className="w-4 h-4" />}
              {actionType === "save" && <Bookmark className="w-4 h-4" />}
              {actionType === "export" && <Download className="w-4 h-4" />}
              {actionType === "generate_letters" && (
                <FileText className="w-4 h-4" />
              )}
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
