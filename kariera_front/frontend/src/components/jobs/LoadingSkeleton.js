// src/components/jobs/LoadingSkeleton.js - Enhanced loading skeleton for job cards
import React from "react";

const SkeletonCard = ({ viewMode = "grid" }) => {
  if (viewMode === "list") {
    return (
      <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
        <div className="flex items-start gap-4">
          {/* Checkbox skeleton */}
          <div className="w-5 h-5 bg-gray-700 rounded mt-1"></div>

          {/* Company logo skeleton */}
          <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>

          {/* Content skeleton */}
          <div className="flex-grow space-y-3">
            {/* Title and company */}
            <div className="space-y-2">
              <div className="h-5 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>

            {/* Job details */}
            <div className="flex gap-4">
              <div className="h-4 bg-gray-700 rounded w-24"></div>
              <div className="h-4 bg-gray-700 rounded w-20"></div>
              <div className="h-4 bg-gray-700 rounded w-28"></div>
              <div className="h-4 bg-gray-700 rounded w-20"></div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>

            {/* Skills */}
            <div className="flex gap-2">
              <div className="h-6 bg-gray-700 rounded-full w-16"></div>
              <div className="h-6 bg-gray-700 rounded-full w-20"></div>
              <div className="h-6 bg-gray-700 rounded-full w-18"></div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-2">
              <div className="h-3 bg-gray-700 rounded w-24"></div>
              <div className="h-8 bg-gray-700 rounded w-20"></div>
            </div>
          </div>

          {/* Action buttons skeleton */}
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-gray-700 rounded"></div>
            <div className="w-20 h-8 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view skeleton
  return (
    <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-grow">
          {/* Checkbox skeleton */}
          <div className="w-5 h-5 bg-gray-700 rounded mt-1"></div>

          {/* Company logo skeleton */}
          <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>

          {/* Title and company skeleton */}
          <div className="space-y-2 flex-grow">
            <div className="h-5 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>

        {/* Save button skeleton */}
        <div className="w-8 h-8 bg-gray-700 rounded"></div>
      </div>

      {/* Badges skeleton */}
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-700 rounded-full w-16"></div>
        <div className="h-6 bg-gray-700 rounded-full w-12"></div>
      </div>

      {/* Location and salary skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>

      {/* Description skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>

      {/* Skills skeleton */}
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-700 rounded-full w-16"></div>
        <div className="h-6 bg-gray-700 rounded-full w-20"></div>
        <div className="h-6 bg-gray-700 rounded-full w-14"></div>
      </div>

      {/* Footer skeleton */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex gap-4">
          <div className="h-3 bg-gray-700 rounded w-16"></div>
          <div className="h-3 bg-gray-700 rounded w-20"></div>
        </div>
        <div className="h-8 bg-gray-700 rounded w-16"></div>
      </div>
    </div>
  );
};

export default function LoadingSkeleton({ count = 6, viewMode = "grid" }) {
  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          : "space-y-4"
      }
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} viewMode={viewMode} />
      ))}
    </div>
  );
}
