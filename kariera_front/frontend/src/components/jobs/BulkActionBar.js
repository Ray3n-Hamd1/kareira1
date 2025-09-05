import React from "react";

export default function BulkActionBar({
  selectedCount,
  onBulkApply,
  onClearSelection,
}) {
  return (
    <div className="bg-purple-900 rounded-lg p-4 mb-4 flex items-center justify-between">
      <span className="text-white">
        {selectedCount} job{selectedCount !== 1 ? "s" : ""} selected
      </span>
      <div className="flex gap-2">
        <button
          onClick={onBulkApply}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
        >
          Apply to Selected
        </button>
        <button
          onClick={onClearSelection}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
        >
          Clear Selection
        </button>
      </div>
    </div>
  );
}
