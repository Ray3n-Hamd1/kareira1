import React from "react";
import LoadingSkeleton from "./LoadingSkeleton";

export default function JobsList({
  jobs,
  loading,
  viewMode,
  selectedJobs,
  selectAll,
  onJobSelect,
  onSelectAll,
  onApplyToJob,
}) {
  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="mr-2"
          />
          Select all ({jobs.length} jobs)
        </label>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-4"
        }
      >
        {jobs.map((job) => (
          <div key={job.id} className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedJobs.has(job.id)}
                onChange={(e) => onJobSelect(job.id, e.target.checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-white">{job.title}</h3>
                <p className="text-gray-400">{job.company}</p>
                <p className="text-sm text-gray-500">{job.location}</p>
                <p className="text-sm text-purple-400">
                  ${job.salary.min.toLocaleString()} - $
                  {job.salary.max.toLocaleString()}
                </p>
                <button
                  onClick={() => onApplyToJob(job)}
                  className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
