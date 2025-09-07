// src/components/jobs/EnhancedBulkActionBar.js - Enhanced bulk action bar matching screenshots
import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  Send,
  Bookmark,
  Trash2,
  Download,
  Share2,
  Eye,
  Calendar,
  DollarSign,
  Building2,
  MapPin,
  Clock,
  Zap,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const EnhancedBulkActionBar = ({
  selectedCount = 0,
  selectedJobs = [],
  selectionStats = {},
  onAction,
  onClearSelection,
  userTier = "free",
  remainingApplications = 0,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUpgradeWarning, setShowUpgradeWarning] = useState(false);

  // Check if user can apply to all selected jobs
  const canApplyToAll =
    userTier === "premium" || remainingApplications >= selectedCount;
  const applicationsNeeded = Math.max(0, selectedCount - remainingApplications);

  useEffect(() => {
    if (selectedCount > remainingApplications && userTier === "free") {
      setShowUpgradeWarning(true);
    } else {
      setShowUpgradeWarning(false);
    }
  }, [selectedCount, remainingApplications, userTier]);

  if (selectedCount === 0) return null;

  const handleAction = (actionType) => {
    if (actionType === "apply" && !canApplyToAll) {
      onAction("showUpgrade");
      return;
    }
    onAction(actionType);
  };

  const getEstimatedCost = () => {
    const applicationCost = 10; // $10 per application
    return selectedCount * applicationCost;
  };

  const formatSalaryRange = () => {
    if (!selectedJobs.length) return "N/A";

    const salaries = selectedJobs
      .map((job) => {
        const salary =
          typeof job.salary === "string"
            ? parseInt(job.salary.replace(/[^\d]/g, "")) || 0
            : job.salary || 0;
        return salary;
      })
      .filter((salary) => salary > 0);

    if (salaries.length === 0) return "N/A";

    const min = Math.min(...salaries);
    const max = Math.max(...salaries);

    if (min === max) {
      return `$${min.toLocaleString()}`;
    }
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const getUniqueCompanies = () => {
    return [...new Set(selectedJobs.map((job) => job.company))];
  };

  const getUniqueLocations = () => {
    return [...new Set(selectedJobs.map((job) => job.location))];
  };

  return (
    <>
      {/* Main Action Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 shadow-lg z-40 ${className}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Selection Info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {selectedCount}
                </div>
                <div>
                  <div className="text-white font-medium">
                    {selectedCount} job{selectedCount !== 1 ? "s" : ""} selected
                  </div>
                  <div className="text-gray-400 text-sm">
                    Please select an action
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1 text-gray-400">
                  <Building2 className="w-4 h-4" />
                  <span>{getUniqueCompanies().length} companies</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <DollarSign className="w-4 h-4" />
                  <span>{formatSalaryRange()}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{getUniqueLocations().length} locations</span>
                </div>
              </div>

              {/* Expand/Collapse Button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-3">
              {/* Free Tier Warning */}
              {showUpgradeWarning && (
                <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-200 text-sm">
                    Need {applicationsNeeded} more applications
                  </span>
                </div>
              )}

              {/* Secondary Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAction("save")}
                  className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 hover:text-white transition-colors"
                  title="Save selected jobs"
                >
                  <Bookmark className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleAction("export")}
                  className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 hover:text-white transition-colors"
                  title="Export selected jobs"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleAction("share")}
                  className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 hover:text-white transition-colors"
                  title="Share selected jobs"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Primary Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onClearSelection}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 hover:text-white transition-colors"
                >
                  Cancel selection
                </button>

                <button
                  onClick={() => handleAction("apply")}
                  disabled={!canApplyToAll}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    canApplyToAll
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {canApplyToAll ? (
                    <>
                      <Send className="w-4 h-4 inline mr-2" />
                      Apply to all
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 inline mr-2" />
                      Upgrade to apply
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleAction("subscribe")}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Selection Summary */}
                <div className="space-y-3">
                  <h4 className="text-white font-medium text-sm">
                    Selection Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Jobs:</span>
                      <span className="text-white">{selectedCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Est. Cost:</span>
                      <span className="text-white">${getEstimatedCost()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Companies:</span>
                      <span className="text-white">
                        {getUniqueCompanies().length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Top Companies */}
                <div className="space-y-3">
                  <h4 className="text-white font-medium text-sm">
                    Top Companies
                  </h4>
                  <div className="space-y-1">
                    {getUniqueCompanies()
                      .slice(0, 3)
                      .map((company, index) => {
                        const count = selectedJobs.filter(
                          (job) => job.company === company
                        ).length;
                        return (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-400 truncate">
                              {company}
                            </span>
                            <span className="text-white">{count}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Salary Insights */}
                <div className="space-y-3">
                  <h4 className="text-white font-medium text-sm">
                    Salary Range
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Range:</span>
                      <span className="text-white">{formatSalaryRange()}</span>
                    </div>
                    {selectionStats.averageSalary > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Average:</span>
                        <span className="text-white">
                          $
                          {Math.round(
                            selectionStats.averageSalary
                          ).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <h4 className="text-white font-medium text-sm">
                    Quick Actions
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAction("viewAll")}
                      className="p-2 bg-gray-700 text-gray-300 rounded text-xs hover:bg-gray-600 hover:text-white transition-colors"
                    >
                      <Eye className="w-3 h-3 inline mr-1" />
                      View All
                    </button>
                    <button
                      onClick={() => handleAction("schedule")}
                      className="p-2 bg-gray-700 text-gray-300 rounded text-xs hover:bg-gray-600 hover:text-white transition-colors"
                    >
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Schedule
                    </button>
                    <button
                      onClick={() => handleAction("compare")}
                      className="p-2 bg-gray-700 text-gray-300 rounded text-xs hover:bg-gray-600 hover:text-white transition-colors"
                    >
                      <DollarSign className="w-3 h-3 inline mr-1" />
                      Compare
                    </button>
                    <button
                      onClick={() => handleAction("notes")}
                      className="p-2 bg-gray-700 text-gray-300 rounded text-xs hover:bg-gray-600 hover:text-white transition-colors"
                    >
                      <Edit className="w-3 h-3 inline mr-1" />
                      Notes
                    </button>
                  </div>
                </div>
              </div>

              {/* Application Limits Info */}
              {userTier === "free" && (
                <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-yellow-200 font-medium text-sm">
                      Free Plan Limits
                    </span>
                  </div>
                  <div className="text-yellow-200 text-sm">
                    You have {remainingApplications} applications remaining.
                    {applicationsNeeded > 0 && (
                      <span className="ml-1">
                        Upgrade to apply to all {selectedCount} selected jobs.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind the fixed bar */}
      <div className={`h-20 ${isExpanded ? "md:h-64" : ""}`} />
    </>
  );
};

export default EnhancedBulkActionBar;
