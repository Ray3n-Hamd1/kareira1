// src/components/jobs/EnhancedBulkActionBar.js - Updated with consistent salary formatting
import React, { useState } from "react";
import {
  Send,
  Bookmark,
  X,
  Check,
  AlertCircle,
  CreditCard,
  Zap,
  Users,
  FileText,
  Download,
  ChevronDown,
  Filter,
  DollarSign,
  MapPin,
  Building2,
  Clock,
  Share2,
  Archive,
  Trash2,
  BarChart3,
  Eye,
  Star,
  CheckSquare,
} from "lucide-react";
import { salaryUtils } from "../../utils/salaryUtils";

export default function EnhancedBulkActionBar({
  selectionStats,
  selectedJobs,
  onBulkApply,
  onBulkSave,
  onClearSelection,
  onGenerateCoverLetters,
  onExportSelection,
  onArchiveJobs,
  onDeleteJobs,
  onShareSelection,
  onQuickSelect,
  userTier = "free",
  remainingApplications = 0,
  maxFreeApplications = 5,
  isVisible = true,
}) {
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isVisible || selectionStats.count === 0) return null;

  const needsUpgrade =
    userTier === "free" && selectionStats.count > remainingApplications;
  const exceedsFreeTier =
    userTier === "free" && selectionStats.count > maxFreeApplications;

  const handleAction = async (actionFn, actionName) => {
    setIsProcessing(true);
    try {
      await actionFn?.();
    } catch (error) {
      console.error(`Error in ${actionName}:`, error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate average salary using centralized utility
  const getAverageSalary = () => {
    if (!selectedJobs || selectedJobs.length === 0) return "N/A";

    const salaries = selectedJobs.map((job) => job.salary).filter(Boolean);
    return salaryUtils.formatAverage(salaries, { compactFormat: true });
  };

  return (
    <div className="sticky top-0 z-40 bg-gray-900 border border-purple-500/50 rounded-lg shadow-2xl backdrop-blur-sm">
      {/* Main Action Bar */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Selection Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-white">
                  {selectionStats.count} job
                  {selectionStats.count !== 1 ? "s" : ""} selected
                </span>
                <span className="text-xs text-gray-400">
                  {selectionStats.companies} compan
                  {selectionStats.companies !== 1 ? "ies" : "y"} • Avg.{" "}
                  {getAverageSalary()}
                </span>
              </div>
            </div>

            {/* Quick Actions Toggle */}
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Quick Actions</span>
              <ChevronDown
                className={`w-4 h-4 transform transition-transform ${
                  showQuickActions ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Analytics Toggle */}
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm">Analytics</span>
              <ChevronDown
                className={`w-4 h-4 transform transition-transform ${
                  showAnalytics ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Main Actions */}
          <div className="flex items-center gap-3">
            {/* Save Button */}
            <button
              onClick={() => handleAction(onBulkSave, "bulk save")}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 rounded-lg transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              <span>Save All</span>
            </button>

            {/* Export Button */}
            <button
              onClick={() => handleAction(onExportSelection, "export")}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            {/* Apply Button */}
            <button
              onClick={() => handleAction(onBulkApply, "bulk apply")}
              disabled={isProcessing}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                needsUpgrade || exceedsFreeTier
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>
                {needsUpgrade || exceedsFreeTier
                  ? "Upgrade & Apply"
                  : `Apply to ${selectionStats.count}`}
              </span>
              {(needsUpgrade || exceedsFreeTier) && (
                <Zap className="w-4 h-4 text-yellow-400" />
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClearSelection}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Clear selection"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Dropdown */}
      {showQuickActions && (
        <div className="border-t border-gray-700 px-6 py-4 bg-gray-800/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() =>
                handleAction(onGenerateCoverLetters, "generate cover letters")
              }
              className="flex items-center gap-2 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-sm font-medium text-white">
                  Cover Letters
                </div>
                <div className="text-xs text-gray-400">Generate AI letters</div>
              </div>
            </button>

            <button
              onClick={() => handleAction(onShareSelection, "share")}
              className="flex items-center gap-2 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
            >
              <Share2 className="w-4 h-4 text-green-400" />
              <div>
                <div className="text-sm font-medium text-white">Share</div>
                <div className="text-xs text-gray-400">Share selection</div>
              </div>
            </button>

            <button
              onClick={() => handleAction(onArchiveJobs, "archive")}
              className="flex items-center gap-2 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
            >
              <Archive className="w-4 h-4 text-orange-400" />
              <div>
                <div className="text-sm font-medium text-white">Archive</div>
                <div className="text-xs text-gray-400">Archive jobs</div>
              </div>
            </button>

            <button
              onClick={() => handleAction(onDeleteJobs, "delete")}
              className="flex items-center gap-2 p-3 bg-gray-700 hover:bg-red-600 rounded-lg transition-colors text-left"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
              <div>
                <div className="text-sm font-medium text-white">Delete</div>
                <div className="text-xs text-gray-400">Remove from list</div>
              </div>
            </button>
          </div>

          {/* Quick Select Options */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-400 mb-2">Quick Select:</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onQuickSelect?.("remote")}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
              >
                All Remote
              </button>
              <button
                onClick={() => onQuickSelect?.("senior")}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
              >
                Senior Level
              </button>
              <button
                onClick={() => onQuickSelect?.("highSalary")}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
              >
                High Salary (100k+)
              </button>
              <button
                onClick={() => onQuickSelect?.("recent")}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
              >
                Posted Recently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Dropdown */}
      {showAnalytics && (
        <div className="border-t border-gray-700 px-6 py-4 bg-gray-800/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {getAverageSalary()}
              </div>
              <div className="text-gray-400">Avg. Salary</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {selectedJobs?.filter((job) => job.remote).length || 0}
              </div>
              <div className="text-gray-400">Remote Jobs</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {selectionStats.companies || 0}
              </div>
              <div className="text-gray-400">Companies</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {selectedJobs?.filter((job) => job.urgentHiring).length || 0}
              </div>
              <div className="text-gray-400">Urgent</div>
            </div>
          </div>

          {/* Salary Distribution */}
          {selectedJobs && selectedJobs.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="text-sm text-gray-400 mb-2">
                Salary Distribution:
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-400">
                    {(() => {
                      const salaries = selectedJobs
                        .map((job) => job.salary)
                        .filter(Boolean);
                      const amounts = salaries
                        .map((s) => s.min || s.amount || 0)
                        .filter((a) => a > 0);
                      const min = amounts.length > 0 ? Math.min(...amounts) : 0;
                      return salaryUtils.formatAmount(min, {
                        compactFormat: true,
                      });
                    })()}
                  </div>
                  <div className="text-gray-400">Minimum</div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-semibold text-purple-400">
                    {getAverageSalary()}
                  </div>
                  <div className="text-gray-400">Average</div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-400">
                    {(() => {
                      const salaries = selectedJobs
                        .map((job) => job.salary)
                        .filter(Boolean);
                      const amounts = salaries
                        .map((s) => s.max || s.amount || 0)
                        .filter((a) => a > 0);
                      const max = amounts.length > 0 ? Math.max(...amounts) : 0;
                      return salaryUtils.formatAmount(max, {
                        compactFormat: true,
                      });
                    })()}
                  </div>
                  <div className="text-gray-400">Maximum</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upgrade Notice */}
      {(needsUpgrade || exceedsFreeTier) && (
        <div className="border-t border-gray-700 px-6 py-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <div className="flex-1">
              <div className="text-sm font-medium text-white">
                {exceedsFreeTier
                  ? `Upgrade to apply to more than ${maxFreeApplications} jobs`
                  : `You have ${remainingApplications} applications remaining`}
              </div>
              <div className="text-xs text-gray-400">
                Get unlimited applications with Pro
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400 font-medium">
                $9.99/month
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
