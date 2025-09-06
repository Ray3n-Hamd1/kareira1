// src/components/jobs/EnhancedBulkActionBar.js
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

  const formatSalary = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`;
    return `$${amount}`;
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
                  {formatSalary(selectionStats.averageSalary)}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span>{selectionStats.companies} companies</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{selectionStats.locations} locations</span>
              </div>
              {selectionStats.hasRemoteJobs && (
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Remote jobs</span>
                </div>
              )}
            </div>

            {/* Upgrade Warning */}
            {needsUpgrade && (
              <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">
                  {remainingApplications} applications remaining
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Quick Actions Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Quick Select</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showQuickActions && (
                <div className="absolute top-full mt-2 right-0 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                  <div className="p-3">
                    <div className="text-sm font-medium text-white mb-2">
                      Quick Selection
                    </div>
                    <div className="space-y-1">
                      <button
                        onClick={() => onQuickSelect?.("remote")}
                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded"
                      >
                        Remote jobs only
                      </button>
                      <button
                        onClick={() => onQuickSelect?.("high-salary")}
                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded"
                      >
                        High salary jobs (${formatSalary(100000)}+)
                      </button>
                      <button
                        onClick={() => onQuickSelect?.("recent")}
                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded"
                      >
                        Posted this week
                      </button>
                      <button
                        onClick={() => onQuickSelect?.("featured")}
                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded"
                      >
                        Featured jobs
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Analytics Button */}
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </button>

            {/* Secondary Actions */}
            <button
              onClick={() => handleAction(onBulkSave, "bulk save")}
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Save All</span>
            </button>

            <button
              onClick={() =>
                handleAction(onGenerateCoverLetters, "generate cover letters")
              }
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Cover Letters</span>
              {userTier === "free" && selectionStats.count > 3 && (
                <Zap className="w-4 h-4 text-yellow-400" />
              )}
            </button>

            {/* Primary Apply Button */}
            <button
              onClick={() => handleAction(onBulkApply, "bulk apply")}
              disabled={isProcessing}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50 ${
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

      {/* Analytics Dropdown */}
      {showAnalytics && (
        <div className="border-t border-gray-700 px-6 py-4 bg-gray-800/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {formatSalary(selectionStats.averageSalary)}
              </div>
              <div className="text-gray-400">Avg. Salary</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {selectionStats.companies}
              </div>
              <div className="text-gray-400">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {selectionStats.jobTypes}
              </div>
              <div className="text-gray-400">Job Types</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {selectionStats.locations}
              </div>
              <div className="text-gray-400">Locations</div>
            </div>
          </div>

          {/* Company Breakdown */}
          <div className="mt-4">
            <div className="text-sm font-medium text-white mb-2">
              Selected Companies:
            </div>
            <div className="flex flex-wrap gap-2">
              {selectionStats.uniqueCompanies
                .slice(0, 5)
                .map((company, index) => {
                  const count = selectedJobs.filter(
                    (job) => job.company === company
                  ).length;
                  return (
                    <span
                      key={company}
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs"
                    >
                      {company} ({count})
                    </span>
                  );
                })}
              {selectionStats.uniqueCompanies.length > 5 && (
                <span className="px-2 py-1 bg-gray-600/20 text-gray-400 rounded-full text-xs">
                  +{selectionStats.uniqueCompanies.length - 5} more
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Usage Stats for Free Users */}
      {userTier === "free" && (
        <div className="border-t border-gray-700 px-6 py-3 bg-gray-800/30">
          <div className="flex items-center justify-between text-sm">
            <div className="text-purple-200">
              Free plan: {remainingApplications} of {maxFreeApplications}{" "}
              applications remaining
            </div>
            <button className="text-purple-300 hover:text-white underline">
              Upgrade for unlimited applications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
