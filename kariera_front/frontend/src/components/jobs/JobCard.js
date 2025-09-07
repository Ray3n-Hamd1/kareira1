// src/components/jobs/JobCard.js - Enhanced job card with consistent salary formatting
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
import { salaryUtils } from "../../utils/salaryUtils";

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

  // Use centralized salary formatting
  const formatSalary = () => {
    return salaryUtils.formatRange(salary, {
      showRange: true,
      separator: " - ",
      fallbackText: "Salary not specified",
    });
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
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
              />
            </div>
          )}

          {/* Company Logo */}
          <div className="flex-shrink-0">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={`${company} logo`}
                className="w-12 h-12 rounded object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center text-white font-bold">
                {company.charAt(0)}
              </div>
            )}
          </div>

          {/* Job Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-white truncate pr-4">
                  {title}
                  {featured && (
                    <Star className="inline w-4 h-4 text-yellow-400 ml-2" />
                  )}
                </h3>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Building2 className="w-4 h-4" />
                  <span>{company}</span>
                  {rating && (
                    <>
                      <span className="text-gray-500">•</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{rating}</span>
                      </div>
                    </>
                  )}
                  {companySize && (
                    <>
                      <span className="text-gray-500">•</span>
                      <Users className="w-3 h-3" />
                      <span>{companySize}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave?.(id);
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    saved
                      ? "text-purple-400 bg-purple-400/10"
                      : "text-gray-400 hover:text-purple-400 hover:bg-gray-700"
                  }`}
                  title={saved ? "Remove from saved" : "Save job"}
                >
                  <BookmarkIcon
                    className={`w-4 h-4 ${saved ? "fill-current" : ""}`}
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`/jobs/${id}`, "_blank");
                  }}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Job Details */}
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
                {remote && (
                  <span className="bg-green-400/10 text-green-400 px-2 py-1 rounded text-xs ml-2">
                    Remote
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium text-green-400">
                  {formatSalary()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                <span>{type}</span>
              </div>
              {posted && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatPostedTime()}</span>
                </div>
              )}
            </div>

            {/* Description Preview */}
            {description && (
              <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                {description}
              </p>
            )}

            {/* Skills and Benefits */}
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="text-gray-400 text-xs px-2 py-1">
                  +{skills.length - 3} more
                </span>
              )}
            </div>

            {/* Status and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {applied && (
                  <span className="bg-blue-400/10 text-blue-400 px-2 py-1 rounded text-xs flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Applied
                  </span>
                )}
                {urgentHiring && (
                  <span className="bg-red-400/10 text-red-400 px-2 py-1 rounded text-xs">
                    Urgent
                  </span>
                )}
                {experienceLevel && (
                  <span className="text-gray-400 text-xs">
                    {experienceLevel} level
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {applicationCount > 0 && (
                  <span className="text-gray-400 text-xs">
                    {applicationCount} applicants
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onApply?.(id);
                  }}
                  disabled={applied}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    applied
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  {applied ? "Applied" : "Apply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (original card format)
  return (
    <div
      className={`bg-gray-800 rounded-lg p-6 transition-all duration-200 hover:bg-gray-750 border cursor-pointer ${
        isSelected
          ? "border-purple-500 bg-gray-750"
          : "border-gray-700 hover:border-gray-600"
      } ${featured ? "ring-2 ring-purple-500 ring-opacity-30" : ""}`}
      onClick={handleCardClick}
    >
      {/* Selection Checkbox */}
      {showSelection && (
        <div className="flex justify-end mb-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect?.(id, e.target.checked);
            }}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
          />
        </div>
      )}

      {/* Company Info */}
      <div className="flex items-center gap-3 mb-4">
        {companyLogo ? (
          <img
            src={companyLogo}
            alt={`${company} logo`}
            className="w-10 h-10 rounded object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center text-white font-bold text-sm">
            {company.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-white">{company}</h3>
          {rating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-gray-300">{rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Job Title */}
      <h4 className="text-lg font-semibold text-white mb-2 line-clamp-2">
        {title}
        {featured && <Star className="inline w-4 h-4 text-yellow-400 ml-2" />}
      </h4>

      {/* Job Details */}
      <div className="space-y-2 text-sm text-gray-300 mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{location}</span>
          {remote && (
            <span className="bg-green-400/10 text-green-400 px-2 py-1 rounded text-xs">
              Remote
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-green-400">{formatSalary()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-gray-400" />
          <span>{type}</span>
          {experienceLevel && (
            <>
              <span className="text-gray-500">•</span>
              <span>{experienceLevel}</span>
            </>
          )}
        </div>
        {posted && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{formatPostedTime()}</span>
          </div>
        )}
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
            >
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="text-gray-400 text-xs px-2 py-1">
              +{skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {applied && (
          <span className="bg-blue-400/10 text-blue-400 px-2 py-1 rounded text-xs flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Applied
          </span>
        )}
        {urgentHiring && (
          <span className="bg-red-400/10 text-red-400 px-2 py-1 rounded text-xs">
            Urgent Hiring
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave?.(id);
            }}
            className={`p-2 rounded-full transition-colors ${
              saved
                ? "text-purple-400 bg-purple-400/10"
                : "text-gray-400 hover:text-purple-400 hover:bg-gray-700"
            }`}
            title={saved ? "Remove from saved" : "Save job"}
          >
            <BookmarkIcon
              className={`w-4 h-4 ${saved ? "fill-current" : ""}`}
            />
          </button>
          {applicationCount > 0 && (
            <span className="text-gray-400 text-xs">
              {applicationCount} applicants
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onApply?.(id);
          }}
          disabled={applied}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            applied
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          {applied ? "Applied" : "Apply"}
        </button>
      </div>
    </div>
  );
}
