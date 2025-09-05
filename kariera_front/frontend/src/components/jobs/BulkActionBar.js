// src/components/jobs/BulkActionBar.js - Enhanced bulk action bar with payment integration
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
} from "lucide-react";

export default function BulkActionBar({
  selectedCount = 0,
  onBulkApply,
  onBulkSave,
  onClearSelection,
  onGenerateCoverLetters,
  onExportSelection,
  userTier = "free", // 'free', 'premium', 'enterprise'
  remainingApplications = 0,
  maxFreeApplications = 5,
}) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionType, setActionType] = useState(null);

  // Check if user needs to upgrade for bulk apply
  const needsUpgrade =
    userTier === "free" && selectedCount > remainingApplications;
  const exceedsFreeTier =
    userTier === "free" && selectedCount > maxFreeApplications;

  const handleBulkApply = async () => {
    if (needsUpgrade || exceedsFreeTier) {
      setActionType("apply");
      setShowPaymentModal(true);
      return;
    }

    setIsProcessing(true);
    try {
      await onBulkApply?.();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkSave = async () => {
    setIsProcessing(true);
    try {
      await onBulkSave?.();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateCoverLetters = async () => {
    if (userTier === "free" && selectedCount > 3) {
      setActionType("cover-letters");
      setShowPaymentModal(true);
      return;
    }

    setIsProcessing(true);
    try {
      await onGenerateCoverLetters?.();
    } finally {
      setIsProcessing(false);
    }
  };

  const PaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Upgrade Required</h3>
          <button
            onClick={() => setShowPaymentModal(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {actionType === "apply" && (
            <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-white mb-1">
                    Bulk Application Limit Reached
                  </h4>
                  <p className="text-sm text-gray-300">
                    You're trying to apply to {selectedCount} jobs, but you have{" "}
                    {remainingApplications} applications remaining on the free
                    plan.
                  </p>
                </div>
              </div>
            </div>
          )}

          {actionType === "cover-letters" && (
            <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-white mb-1">
                    AI Cover Letter Limit
                  </h4>
                  <p className="text-sm text-gray-300">
                    Free users can generate up to 3 AI cover letters per day.
                    Upgrade to generate unlimited cover letters.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pricing tiers */}
          <div className="space-y-3">
            <div className="border border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">Premium Plan</h4>
                <span className="text-purple-400 font-bold">$19/month</span>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  50 job applications per month
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  Unlimited AI cover letters
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  Priority support
                </li>
              </ul>
              <button className="w-full mt-3 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 font-medium">
                Upgrade to Premium
              </button>
            </div>

            <div className="border border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">One-time Purchase</h4>
                <span className="text-green-400 font-bold">$4.99</span>
              </div>
              <p className="text-sm text-gray-300 mb-3">
                Apply to {selectedCount} selected jobs with AI-generated cover
                letters
              </p>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium">
                <CreditCard className="w-4 h-4 inline mr-2" />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-purple-900/20 border-l-4 border-purple-500 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="font-medium text-white">
                {selectedCount} job{selectedCount !== 1 ? "s" : ""} selected
              </span>
            </div>

            {/* Upgrade warning for free users */}
            {needsUpgrade && (
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">
                  {remainingApplications} applications remaining
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Action Buttons */}
            <button
              onClick={handleBulkSave}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              <span>Save All</span>
            </button>

            <button
              onClick={handleGenerateCoverLetters}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Cover Letters</span>
              {userTier === "free" && selectedCount > 3 && (
                <Zap className="w-4 h-4 text-yellow-400" />
              )}
            </button>

            <button
              onClick={onExportSelection}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <button
              onClick={handleBulkApply}
              disabled={isProcessing}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
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
                  : "Apply to All"}
              </span>
              {(needsUpgrade || exceedsFreeTier) && (
                <Zap className="w-4 h-4 text-yellow-400" />
              )}
            </button>

            <button
              onClick={onClearSelection}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Clear selection"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Additional info for free users */}
        {userTier === "free" && (
          <div className="mt-3 pt-3 border-t border-purple-500/30">
            <div className="flex items-center justify-between text-sm">
              <div className="text-purple-200">
                Free plan: {remainingApplications} of {maxFreeApplications}{" "}
                applications remaining this month
              </div>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="text-purple-300 hover:text-white underline"
              >
                Upgrade for unlimited applications
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && <PaymentModal />}
    </>
  );
}
