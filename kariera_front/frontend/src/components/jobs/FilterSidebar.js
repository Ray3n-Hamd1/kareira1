// src/components/jobs/FilterSidebar.js
import React, { useState } from "react";
import {
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Users,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function FilterSidebar({
  filters,
  onFiltersChange,
  onClearFilters,
  jobCount = 0,
}) {
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

  const updateFilters = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleArrayFilter = (key, value) => {
    const currentArray = filters[key] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];

    updateFilters(key, newArray);
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

  const FilterSection = ({
    title,
    icon: Icon,
    isExpanded,
    onToggle,
    children,
  }) => (
    <div className="border-b border-gray-700 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 px-1 text-left hover:text-purple-400 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span className="font-medium">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {isExpanded && <div className="pb-4 px-1">{children}</div>}
    </div>
  );

  const CheckboxOption = ({ label, value, checked, onChange }) => (
    <label className="flex items-center gap-3 py-2 cursor-pointer hover:text-purple-400 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
      />
      <span className="text-sm">{label}</span>
    </label>
  );

  const RadioOption = ({ label, value, checked, onChange }) => (
    <label className="flex items-center gap-3 py-2 cursor-pointer hover:text-purple-400 transition-colors">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500"
      />
      <span className="text-sm">{label}</span>
    </label>
  );

  return (
    <div className="bg-gray-800 rounded-xl p-6 h-fit sticky top-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        {hasActiveFilters() && (
          <button
            onClick={onClearFilters}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="mb-6 p-3 bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-300">
          <span className="font-semibold text-white">{jobCount}</span> jobs
          match your criteria
        </p>
      </div>

      {/* Date Posted Filter */}
      <FilterSection
        title="Date Posted"
        icon={Clock}
        isExpanded={expandedSections.datePosted}
        onToggle={() => toggleSection("datePosted")}
      >
        <div className="space-y-1">
          {[
            { label: "Any time", value: "any" },
            { label: "Past 24 hours", value: "1d" },
            { label: "Past week", value: "1w" },
            { label: "Past month", value: "1m" },
          ].map((option) => (
            <RadioOption
              key={option.value}
              label={option.label}
              value={option.value}
              checked={filters.datePosted === option.value}
              onChange={() => updateFilters("datePosted", option.value)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Job Type Filter */}
      <FilterSection
        title="Job Type"
        icon={Briefcase}
        isExpanded={expandedSections.jobType}
        onToggle={() => toggleSection("jobType")}
      >
        <div className="space-y-1">
          {[
            "Full-time",
            "Part-time",
            "Contract",
            "Internship",
            "Freelance",
          ].map((type) => (
            <CheckboxOption
              key={type}
              label={type}
              value={type}
              checked={filters.jobType.includes(type)}
              onChange={() => toggleArrayFilter("jobType", type)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Work Setting Filter */}
      <FilterSection
        title="Work Setting"
        icon={MapPin}
        isExpanded={expandedSections.workSetting}
        onToggle={() => toggleSection("workSetting")}
      >
        <div className="space-y-1">
          {[
            { label: "Any", value: "any" },
            { label: "Remote", value: "remote" },
            { label: "On-site", value: "onsite" },
            { label: "Hybrid", value: "hybrid" },
          ].map((option) => (
            <RadioOption
              key={option.value}
              label={option.label}
              value={option.value}
              checked={filters.workSetting === option.value}
              onChange={() => updateFilters("workSetting", option.value)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Salary Range Filter */}
      <FilterSection
        title="Salary Range"
        icon={DollarSign}
        isExpanded={expandedSections.salary}
        onToggle={() => toggleSection("salary")}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-1">Min</label>
              <input
                type="number"
                value={filters.salaryRange.min}
                onChange={(e) =>
                  updateFilters("salaryRange", {
                    ...filters.salaryRange,
                    min: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0"
              />
            </div>
            <div className="text-gray-400">-</div>
            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-1">Max</label>
              <input
                type="number"
                value={filters.salaryRange.max}
                onChange={(e) =>
                  updateFilters("salaryRange", {
                    ...filters.salaryRange,
                    max: parseInt(e.target.value) || 200000,
                  })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="200000"
              />
            </div>
          </div>

          {/* Quick salary ranges */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "$50k+", min: 50000, max: 200000 },
              { label: "$100k+", min: 100000, max: 200000 },
              { label: "$150k+", min: 150000, max: 200000 },
              { label: "$200k+", min: 200000, max: 500000 },
            ].map((range) => (
              <button
                key={range.label}
                onClick={() =>
                  updateFilters("salaryRange", {
                    min: range.min,
                    max: range.max,
                  })
                }
                className="px-3 py-2 text-xs bg-gray-700 hover:bg-purple-600 rounded-lg transition-colors"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Experience Level Filter */}
      <FilterSection
        title="Experience Level"
        icon={Users}
        isExpanded={expandedSections.experience}
        onToggle={() => toggleSection("experience")}
      >
        <div className="space-y-1">
          {[
            "Entry Level",
            "Junior",
            "Mid-level",
            "Senior",
            "Lead",
            "Executive",
          ].map((level) => (
            <CheckboxOption
              key={level}
              label={level}
              value={level}
              checked={filters.experienceLevel.includes(level)}
              onChange={() => toggleArrayFilter("experienceLevel", level)}
            />
          ))}
        </div>
      </FilterSection>
    </div>
  );
}
