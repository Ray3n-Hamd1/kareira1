// src/components/jobs/FilterSidebar.js - Updated with consistent salary formatting
import React, { useState } from "react";
import {
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Building2,
  Users,
  Star,
  Filter,
  RotateCcw,
} from "lucide-react";
import { salaryUtils } from "../../utils/salaryUtils";

const FilterSection = ({ title, icon, children, expanded, onToggle }) => (
  <div className="border-b border-gray-700 last:border-b-0">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800 transition-colors"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium text-white">{title}</span>
      </div>
      {expanded ? (
        <ChevronUp className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      )}
    </button>
    {expanded && <div className="px-4 pb-4">{children}</div>}
  </div>
);

export default function FilterSidebar({
  filters,
  onFilterChange,
  onClose,
  onClearAll,
  isVisible = true,
  activeFilterCount = 0,
}) {
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    salary: true,
    jobType: false,
    experience: false,
    workSetting: false,
    company: false,
    benefits: false,
    skills: false,
  });

  const [salaryInputs, setSalaryInputs] = useState({
    min: filters.salaryRange?.min || 0,
    max: filters.salaryRange?.max || 200000,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateFilter = (filterType, value) => {
    onFilterChange(filterType, value);
  };

  const handleSalaryChange = (type, value) => {
    const numValue = parseInt(value) || 0;
    const newInputs = { ...salaryInputs, [type]: numValue };
    setSalaryInputs(newInputs);

    updateFilter("salaryRange", newInputs);
  };

  const formatSalaryForDisplay = (amount) => {
    return salaryUtils.formatForFilter(amount, { locale: "en-US" });
  };

  const getSalaryRangeDisplay = () => {
    const { min, max } = salaryInputs;

    if (min === 0 && max === 200000) {
      return "Any salary range";
    }

    const minText =
      min === 0
        ? "No min"
        : salaryUtils.formatAmount(min, { compactFormat: false });
    const maxText =
      max === 200000
        ? "No max"
        : salaryUtils.formatAmount(max, { compactFormat: false });

    return `${minText} - ${maxText}`;
  };

  if (!isVisible) return null;

  // Sample data for dropdowns - in a real app, these would come from props or API
  const locations = [
    "New York, NY",
    "San Francisco, CA",
    "Los Angeles, CA",
    "Chicago, IL",
    "Boston, MA",
    "Seattle, WA",
    "Austin, TX",
    "Denver, CO",
    "Remote",
  ];

  const companies = [
    "Google",
    "Apple",
    "Microsoft",
    "Amazon",
    "Meta",
    "Netflix",
    "Tesla",
    "Spotify",
    "Uber",
    "Airbnb",
  ];

  const skills = [
    "React",
    "JavaScript",
    "Python",
    "Java",
    "TypeScript",
    "Node.js",
    "AWS",
    "Docker",
    "Kubernetes",
    "GraphQL",
  ];

  const benefits = [
    "Health Insurance",
    "Dental Insurance",
    "Vision Insurance",
    "401(k) Matching",
    "Flexible PTO",
    "Remote Work",
    "Stock Options",
    "Professional Development",
    "Gym Membership",
    "Free Meals",
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:relative lg:bg-transparent lg:backdrop-blur-none">
      <div className="absolute inset-y-0 left-0 w-80 bg-gray-900 border-r border-gray-700 overflow-y-auto lg:relative lg:inset-auto lg:w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClearAll}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Clear all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Sections */}
        <div className="divide-y divide-gray-700">
          {/* Location */}
          <FilterSection
            title="Location"
            icon={<MapPin className="w-4 h-4" />}
            expanded={expandedSections.location}
            onToggle={() => toggleSection("location")}
          >
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Search locations..."
                value={filters.location || ""}
                onChange={(e) => updateFilter("location", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              <div className="max-h-40 overflow-y-auto space-y-1">
                {locations.map((location) => (
                  <label
                    key={location}
                    className="flex items-center gap-2 text-sm p-2 hover:bg-gray-800 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.locations?.includes(location) || false}
                      onChange={(e) => {
                        const currentLocations = filters.locations || [];
                        const newLocations = e.target.checked
                          ? [...currentLocations, location]
                          : currentLocations.filter((l) => l !== location);
                        updateFilter("locations", newLocations);
                      }}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="text-gray-300">{location}</span>
                  </label>
                ))}
              </div>
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
                  value={salaryInputs.min}
                  onChange={(e) => handleSalaryChange("min", e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value={0}>No minimum</option>
                  <option value={40000}>$40,000+</option>
                  <option value={60000}>$60,000+</option>
                  <option value={80000}>$80,000+</option>
                  <option value={100000}>$100,000+</option>
                  <option value={120000}>$120,000+</option>
                  <option value={150000}>$150,000+</option>
                  <option value={200000}>$200,000+</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Maximum</label>
                <select
                  value={salaryInputs.max}
                  onChange={(e) => handleSalaryChange("max", e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value={80000}>$80,000</option>
                  <option value={100000}>$100,000</option>
                  <option value={120000}>$120,000</option>
                  <option value={150000}>$150,000</option>
                  <option value={180000}>$180,000</option>
                  <option value={200000}>$200,000</option>
                  <option value={250000}>$250,000+</option>
                  <option value={300000}>$300,000+</option>
                  <option value={999999}>No maximum</option>
                </select>
              </div>

              {/* Salary Range Display */}
              <div className="text-sm text-center p-3 bg-gray-800 rounded border border-gray-700">
                <div className="text-gray-400 mb-1">Selected Range</div>
                <div className="text-green-400 font-medium">
                  {getSalaryRangeDisplay()}
                </div>
              </div>

              {/* Quick Salary Filters */}
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Quick Select:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSalaryChange("min", 100000)}
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 transition-colors"
                  >
                    $100k+
                  </button>
                  <button
                    onClick={() => handleSalaryChange("min", 150000)}
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 transition-colors"
                  >
                    $150k+
                  </button>
                  <button
                    onClick={() => {
                      setSalaryInputs({ min: 80000, max: 120000 });
                      updateFilter("salaryRange", { min: 80000, max: 120000 });
                    }}
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 transition-colors"
                  >
                    $80k-$120k
                  </button>
                  <button
                    onClick={() => {
                      setSalaryInputs({ min: 120000, max: 200000 });
                      updateFilter("salaryRange", { min: 120000, max: 200000 });
                    }}
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 transition-colors"
                  >
                    $120k-$200k
                  </button>
                </div>
              </div>
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
                { value: "freelance", label: "Freelance" },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={filters.jobTypes?.includes(option.value) || false}
                    onChange={(e) => {
                      const currentTypes = filters.jobTypes || [];
                      const newTypes = e.target.checked
                        ? [...currentTypes, option.value]
                        : currentTypes.filter((t) => t !== option.value);
                      updateFilter("jobTypes", newTypes);
                    }}
                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="text-gray-300">{option.label}</span>
                </label>
              ))}
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
                    checked={
                      filters.experienceLevel?.includes(option.value) || false
                    }
                    onChange={(e) => {
                      const currentLevels = filters.experienceLevel || [];
                      const newLevels = e.target.checked
                        ? [...currentLevels, option.value]
                        : currentLevels.filter((l) => l !== option.value);
                      updateFilter("experienceLevel", newLevels);
                    }}
                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
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
                    onChange={(e) =>
                      updateFilter("workSetting", e.target.value)
                    }
                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="text-gray-300">{option.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Company */}
          <FilterSection
            title="Company"
            icon={<Building2 className="w-4 h-4" />}
            expanded={expandedSections.company}
            onToggle={() => toggleSection("company")}
          >
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Search companies..."
                value={filters.companySearch || ""}
                onChange={(e) => updateFilter("companySearch", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <div className="max-h-40 overflow-y-auto space-y-1">
                {companies.map((company) => (
                  <label
                    key={company}
                    className="flex items-center gap-2 text-sm p-2 hover:bg-gray-800 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.companies?.includes(company) || false}
                      onChange={(e) => {
                        const currentCompanies = filters.companies || [];
                        const newCompanies = e.target.checked
                          ? [...currentCompanies, company]
                          : currentCompanies.filter((c) => c !== company);
                        updateFilter("companies", newCompanies);
                      }}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="text-gray-300">{company}</span>
                  </label>
                ))}
              </div>
            </div>
          </FilterSection>

          {/* Skills */}
          <FilterSection
            title="Skills"
            icon={<Star className="w-4 h-4" />}
            expanded={expandedSections.skills}
            onToggle={() => toggleSection("skills")}
          >
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Search skills..."
                value={filters.skillSearch || ""}
                onChange={(e) => updateFilter("skillSearch", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <div className="max-h-40 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => {
                        const currentSkills = filters.skills || [];
                        const newSkills = currentSkills.includes(skill)
                          ? currentSkills.filter((s) => s !== skill)
                          : [...currentSkills, skill];
                        updateFilter("skills", newSkills);
                      }}
                      className={`px-3 py-1 rounded-full text-xs transition-colors ${
                        filters.skills?.includes(skill)
                          ? "bg-purple-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </FilterSection>

          {/* Benefits */}
          <FilterSection
            title="Benefits"
            icon={<Users className="w-4 h-4" />}
            expanded={expandedSections.benefits}
            onToggle={() => toggleSection("benefits")}
          >
            <div className="space-y-2">
              {benefits.map((benefit) => (
                <label
                  key={benefit}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={filters.benefits?.includes(benefit) || false}
                    onChange={(e) => {
                      const currentBenefits = filters.benefits || [];
                      const newBenefits = e.target.checked
                        ? [...currentBenefits, benefit]
                        : currentBenefits.filter((b) => b !== benefit);
                      updateFilter("benefits", newBenefits);
                    }}
                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="text-gray-300">{benefit}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        </div>

        {/* Apply Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Apply Filters
            {activeFilterCount > 0 && ` (${activeFilterCount})`}
          </button>
        </div>
      </div>
    </div>
  );
}
