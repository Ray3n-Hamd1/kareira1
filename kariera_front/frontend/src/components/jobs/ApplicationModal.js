import React from "react";

export default function ApplicationModal({ job, onClose, onSubmit }) {
  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Apply to {job.title}</h2>
        <p className="text-gray-400 mb-4">at {job.company}</p>
        <p className="text-sm text-gray-500 mb-6">
          Application modal will be implemented in Step 7
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onSubmit({})}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
          >
            Submit Application
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
