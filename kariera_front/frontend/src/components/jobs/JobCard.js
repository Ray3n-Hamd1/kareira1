import React from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  ExternalLink,
  Bookmark,
  Building2,
  Eye,
} from "lucide-react";

const JobCard = ({
  job,
  onApply,
  onSave,
  onViewDetails,
  isSelected = false,
  onSelect,
  viewMode = "grid",
}) => {
  const handleApplyClick = (e) => {
    e.stopPropagation();
    onApply?.(job);
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    onSave?.(job.id);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    onViewDetails?.(job);
  };

  const handleCardClick = () => {
    // If there's a selection handler, use it; otherwise show details
    if (onSelect) {
      onSelect(job.id, !isSelected);
    } else {
      onViewDetails?.(job);
    }
  };

  if (viewMode === "list") {
    return (
      <div
        className={`bg-white border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
          isSelected
            ? "border-blue-500 ring-2 ring-blue-200"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  {job.title}
                </h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <Building2 className="w-4 h-4 mr-1" />
                  <span>{job.company}</span>
                </div>
              </div>
              <button
                onClick={handleSaveClick}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Save job"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {job.location}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {job.posted}
              </div>
              {job.salary && (
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {job.salary}
                </div>
              )}
            </div>

            <p className="text-gray-700 text-sm line-clamp-2 mb-3">
              {job.description}
            </p>

            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {job.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{job.skills.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="ml-4 flex flex-col space-y-2">
            <button
              onClick={handleViewDetails}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </button>
            <button
              onClick={handleApplyClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div
      className={`bg-white border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer ${
        isSelected
          ? "border-blue-500 ring-2 ring-blue-200"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-1">
            {job.title}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <Building2 className="w-4 h-4 mr-1" />
            <span>{job.company}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            {job.location}
          </div>
        </div>
        <button
          onClick={handleSaveClick}
          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          title="Save job"
        >
          <Bookmark className="w-4 h-4" />
        </button>
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
        {job.description}
      </p>

      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {job.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{job.skills.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          {job.posted}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleViewDetails}
            className="flex items-center text-gray-600 hover:text-gray-800 text-sm px-2 py-1 rounded"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </button>
          <button
            onClick={handleApplyClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
