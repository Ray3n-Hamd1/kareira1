// src/components/jobs/JobCard.js - Enhanced job card with selection and rich data
import React from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  BookmarkIcon,
  Building2,
  Users,
  CheckCircle,
  Star,
  ExternalLink,
} from "lucide-react";

export default function JobCard({
  job,
  isSelected = false,
  onSelect,
  onToggleSave,
  onApply,
  viewMode = "grid", // 'grid' or 'list'
  showSelection = true,
}) {
  const {
    id,
    title,
    company,
    location,
    salary,
    type,
    remote,
    description,
    requirements = [],
    posted,
    applicationCount = 0,
    companyLogo,
    saved = false,
    applied = false,
    featured = false,
    urgentHiring = false,
    benefits = [],
    skills = [],
    experienceLevel,
    companySize,
    rating,
  } = job;

  // Format salary display
  const formatSalary = () => {
    if (salary?.min && salary?.max) {
      return `$${(salary.min / 1000).toFixed(0)}k - $${(
        salary.max / 1000
      ).toFixed(0)}k`;
    }
    if (salary?.amount) {
      return `$${(salary.amount / 1000).toFixed(0)}k`;
    }
    return "Salary not specified";
  };

  // Format posting time
  const formatPostedTime = () => {
    if (!posted) return "";
    const now = new Date();
    const postedDate = new Date(posted);
    const diffTime = Math.abs(now - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  // Handle card click (not on interactive elements)
  const handleCardClick = (e) => {
    // Don't trigger if clicking on interactive elements
    if (e.target.closest("button, input, a")) return;
    // Navigate to job detail page
    window.location.href = `/jobs/${id}`;
  };

  if (viewMode === "list") {
    return (
      <div
        className={`bg-gray-800 rounded-lg p-6 transition-all duration-200 hover:bg-gray-750 border cursor-pointer ${
          isSelected
            ? "border-purple-500 bg-gray-750"
            : "border-gray-700 hover:border-gray-600"
        } ${featured ? "ring-2 ring-purple-500 ring-opacity-30" : ""}`}
        onClick={handleCardClick}
      >
        <div className="flex items-start gap-4">
          {/* Selection Checkbox */}
          {showSelection && (
            <div className="flex-shrink-0 mt-1">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelect?.(id, e.target.checked);
                }}
                className="w-5 h-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
              />
            </div>
          )}

          {/* Company Logo */}
          <div className="flex-shrink-0">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={`${company} logo`}
                className="w-12 h-12 rounded-lg object-cover bg-gray-700"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg ${
                companyLogo ? "hidden" : "flex"
              }`}
            >
              {company.charAt(0)}
            </div>
          </div>

          {/* Job Info */}
          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0 flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {title}
                  </h3>
                  {featured && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                  )}
                  {urgentHiring && (
                    <span className="px-2 py-1 text-xs bg-red-600 text-white rounded-full flex-shrink-0">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-gray-300 font-medium">{company}</p>
                {rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-400">{rating}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave?.(id);
                  }}
                  className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                  title={saved ? "Remove from saved" : "Save job"}
                >
                  <BookmarkIcon
                    className={`w-5 h-5 ${
                      saved ? "fill-yellow-500 text-yellow-500" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onApply?.(job);
                  }}
                  disabled={applied}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    applied
                      ? "bg-green-600 text-white cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
                >
                  {applied ? (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Applied
                    </div>
                  ) : (
                    "Apply Now"
                  )}
                </button>
              </div>
            </div>

            {/* Job Details */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
                {remote && (
                  <span className="px-2 py-1 bg-green-600 text-white rounded-full text-xs ml-1">
                    Remote
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                <span>{type}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{formatSalary()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatPostedTime()}</span>
              </div>
              {companySize && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{companySize}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
              {description}
            </p>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.slice(0, 5).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 5 && (
                  <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded-full text-xs">
                    +{skills.length - 5} more
                  </span>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{applicationCount} applicants</span>
              {experienceLevel && <span>{experienceLevel} level</span>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div
      className={`bg-gray-800 rounded-lg p-6 transition-all duration-200 hover:bg-gray-750 border cursor-pointer ${
        isSelected
          ? "border-purple-500 bg-gray-750"
          : "border-gray-700 hover:border-gray-600"
      } ${featured ? "ring-2 ring-purple-500 ring-opacity-30" : ""}`}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-grow min-w-0">
          {showSelection && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                onSelect?.(id, e.target.checked);
              }}
              className="w-5 h-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2 mt-1"
            />
          )}

          {/* Company Logo */}
          <div className="flex-shrink-0">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={`${company} logo`}
                className="w-12 h-12 rounded-lg object-cover bg-gray-700"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg ${
                companyLogo ? "hidden" : "flex"
              }`}
            >
              {company.charAt(0)}
            </div>
          </div>

          {/* Basic Info */}
          <div className="min-w-0 flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-white truncate">
                {title}
              </h3>
              {featured && (
                <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
              )}
            </div>
            <p className="text-gray-300 font-medium truncate">{company}</p>
            {rating && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-400">{rating}</span>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave?.(id);
          }}
          className="p-2 text-gray-400 hover:text-yellow-500 transition-colors flex-shrink-0"
          title={saved ? "Remove from saved" : "Save job"}
        >
          <BookmarkIcon
            className={`w-5 h-5 ${
              saved ? "fill-yellow-500 text-yellow-500" : ""
            }`}
          />
        </button>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {urgentHiring && (
          <span className="px-2 py-1 text-xs bg-red-600 text-white rounded-full">
            Urgent Hiring
          </span>
        )}
        {remote && (
          <span className="px-2 py-1 text-xs bg-green-600 text-white rounded-full">
            Remote
          </span>
        )}
        {type && (
          <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
            {type}
          </span>
        )}
      </div>

      {/* Location and Salary */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <DollarSign className="w-4 h-4" />
          <span className="font-medium text-green-400">{formatSalary()}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-3">{description}</p>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs"
            >
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded-full text-xs">
              +{skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatPostedTime()}</span>
          </div>
          <span>{applicationCount} applicants</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onApply?.(job);
          }}
          disabled={applied}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            applied
              ? "bg-green-600 text-white cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          {applied ? (
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Applied
            </div>
          ) : (
            "Apply"
          )}
        </button>
      </div>
    </div>
  );
}
