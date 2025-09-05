import React, { useState } from "react";
import {
  Calendar,
  DollarSign,
  Briefcase,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

export default function FilterSidebar({ filters, onFiltersChange }) {
  const [expandedSections, setExpandedSections] = useState({
    datePosted: true,
    jobType: true,
    workSetting: true,
    salary: true,
    experience: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateFilter = (key, value) => {
    onFiltersChange((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleArrayFilter = (key, value) => {
    onFiltersChange((prev) => {
      const currentArray = prev[key] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];

      return {
        ...prev,
        [key]: newArray,
      };
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      datePosted: "any",
      jobType: [],
      workSetting: "any",
      salaryRange: { min: 0, max: 200000 },
      experienceLevel: [],
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.datePosted !== "any" ||
      filters.jobType.length > 0 ||
      filters.workSetting !== "any" ||
      filters.salaryRange.min > 0 ||
      filters.salaryRange.max < 200000 ||
      filters.experienceLevel.length > 0
    );
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Filters
        </h3>
        {hasActiveFilters() && (
          <button
            onClick={clearFilters}
            className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Date Posted */}
        <FilterSection
          title="Date Posted"
          icon={<Calendar className="w-4 h-4" />}
          expanded={expandedSections.datePosted}
          onToggle={() => toggleSection("datePosted")}
        >
          <div className="space-y-2">
            {[
              { value: "any", label: "Any time" },
              { value: "last-day", label: "Last 24 hours" },
              { value: "last-week", label: "Last week" },
              { value: "last-month", label: "Last month" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name="datePosted"
                  value={option.value}
                  checked={filters.datePosted === option.value}
                  onChange={(e) => updateFilter("datePosted", e.target.value)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Job Type */}
        <FilterSection
          title="Job Type"
          icon={<Briefcase className="w-4 h-4" />}
          expanded={expandedSections.jobType}
          onToggle={() => toggleSection("jobType")}
        >
          <div className="space-y-2">
            {[
              { value: "full-time", label: "Full-time" },
              { value: "part-time", label: "Part-time" },
              { value: "contract", label: "Contract" },
              { value: "internship", label: "Internship" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={filters.jobType.includes(option.value)}
                  onChange={() => toggleArrayFilter("jobType", option.value)}
                  className="text-purple-600 focus:ring-purple-500 rounded"
                />
                <span className="text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Work Setting */}
        <FilterSection
          title="Work Setting"
          icon={<MapPin className="w-4 h-4" />}
          expanded={expandedSections.workSetting}
          onToggle={() => toggleSection("workSetting")}
        >
          <div className="space-y-2">
            {[
              { value: "any", label: "Any" },
              { value: "remote", label: "Remote" },
              { value: "hybrid", label: "Hybrid" },
              { value: "on-site", label: "On-site" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name="workSetting"
                  value={option.value}
                  checked={filters.workSetting === option.value}
                  onChange={(e) => updateFilter("workSetting", e.target.value)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Salary Range */}
        <FilterSection
          title="Salary Range"
          icon={<DollarSign className="w-4 h-4" />}
          expanded={expandedSections.salary}
          onToggle={() => toggleSection("salary")}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Minimum</label>
              <select
                value={filters.salaryRange.min}
                onChange={(e) =>
                  updateFilter("salaryRange", {
                    ...filters.salaryRange,
                    min: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
              >
                <option value={0}>No minimum</option>
                <option value={40000}>$40,000+</option>
                <option value={60000}>$60,000+</option>
                <option value={80000}>$80,000+</option>
                <option value={100000}>$100,000+</option>
                <option value={120000}>$120,000+</option>
                <option value={150000}>$150,000+</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Maximum</label>
              <select
                value={filters.salaryRange.max}
                onChange={(e) =>
                  updateFilter("salaryRange", {
                    ...filters.salaryRange,
                    max: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
              >
                <option value={200000}>No maximum</option>
                <option value={80000}>$80,000</option>
                <option value={100000}>$100,000</option>
                <option value={120000}>$120,000</option>
                <option value={150000}>$150,000</option>
                <option value={180000}>$180,000</option>
              </select>
            </div>

            {/* Salary Range Display */}
            <div className="text-sm text-gray-400 text-center">
              {filters.salaryRange.min === 0
                ? "No min"
                : `$${filters.salaryRange.min.toLocaleString()}`}
              {" - "}
              {filters.salaryRange.max === 200000
                ? "No max"
                : `$${filters.salaryRange.max.toLocaleString()}`}
            </div>
          </div>
        </FilterSection>

        {/* Experience Level */}
        <FilterSection
          title="Experience Level"
          icon={<Clock className="w-4 h-4" />}
          expanded={expandedSections.experience}
          onToggle={() => toggleSection("experience")}
        >
          <div className="space-y-2">
            {[
              { value: "entry", label: "Entry level (0-1 years)" },
              { value: "mid", label: "Mid level (2-5 years)" },
              { value: "senior", label: "Senior level (5+ years)" },
              { value: "lead", label: "Lead/Principal (8+ years)" },
              { value: "executive", label: "Executive (10+ years)" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={filters.experienceLevel.includes(option.value)}
                  onChange={() =>
                    toggleArrayFilter("experienceLevel", option.value)
                  }
                  className="text-purple-600 focus:ring-purple-500 rounded"
                />
                <span className="text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Additional Filters */}
        <div className="pt-4 border-t border-gray-700">
          <h4 className="text-sm font-medium text-gray-400 mb-3">
            Additional Filters
          </h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="text-purple-600 focus:ring-purple-500 rounded"
              />
              <span className="text-gray-300">Easy Apply</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="text-purple-600 focus:ring-purple-500 rounded"
              />
              <span className="text-gray-300">Recently Posted</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="text-purple-600 focus:ring-purple-500 rounded"
              />
              <span className="text-gray-300">High Response Rate</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Filter Section Component
function FilterSection({ title, icon, children, expanded, onToggle }) {
  return (
    <div className="border-b border-gray-700 pb-4 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full mb-3 hover:text-purple-400 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-white">{title}</span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {expanded && <div className="ml-6">{children}</div>}
    </div>
  );
}
