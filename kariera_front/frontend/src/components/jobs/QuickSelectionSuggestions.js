// src/components/jobs/QuickSelectionSuggestions.js - Smart job selection suggestions
import React, { useState } from "react";
import {
  Zap,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Wifi,
  X,
  ChevronRight,
  Lightbulb,
} from "lucide-react";

const QuickSelectionSuggestions = ({
  suggestions,
  onSelectSuggestion,
  onDismiss,
  selectedCount = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!suggestions || suggestions.length === 0) return null;

  const getIconForType = (type) => {
    switch (type) {
      case "company":
        return Building2;
      case "location":
        return MapPin;
      case "recent":
        return Calendar;
      case "salaryRange":
        return DollarSign;
      case "remote":
        return Wifi;
      default:
        return Zap;
    }
  };

  const getColorForType = (type) => {
    switch (type) {
      case "company":
        return "from-blue-500 to-blue-600";
      case "location":
        return "from-green-500 to-green-600";
      case "recent":
        return "from-purple-500 to-purple-600";
      case "salaryRange":
        return "from-yellow-500 to-yellow-600";
      case "remote":
        return "from-indigo-500 to-indigo-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const displayedSuggestions = isExpanded
    ? suggestions
    : suggestions.slice(0, 3);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <h3 className="text-white font-medium">Smart Selection</h3>
          {selectedCount > 0 && (
            <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
              {selectedCount} selected
            </span>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-gray-400 text-sm mb-4">
        Quickly select jobs that match common criteria
      </p>

      <div className="space-y-2">
        {displayedSuggestions.map((suggestion, index) => {
          const Icon = getIconForType(suggestion.type);
          const colorClass = getColorForType(suggestion.type);

          return (
            <button
              key={index}
              onClick={() => onSelectSuggestion(suggestion)}
              className="w-full flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 bg-gradient-to-r ${colorClass} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-white font-medium text-sm">
                    {suggestion.label}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {suggestion.count} jobs
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            </button>
          );
        })}
      </div>

      {suggestions.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-3 py-2 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
        >
          {isExpanded
            ? "Show less"
            : `Show ${suggestions.length - 3} more suggestions`}
        </button>
      )}
    </div>
  );
};

// Selection Summary Component - shows stats about current selection
const SelectionSummary = ({ stats, onClearSelection, onBulkAction }) => {
  if (stats.totalJobs === 0) return null;

  return (
    <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-medium flex items-center gap-2">
          <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs">
            {stats.totalJobs}
          </span>
          Jobs Selected
        </h3>
        <button
          onClick={onClearSelection}
          className="text-purple-400 hover:text-purple-300 text-sm"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-gray-400 text-xs">Total Estimated Salary</div>
          <div className="text-white font-semibold">
            ${stats.totalSalary.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-gray-400 text-xs">Companies</div>
          <div className="text-white font-semibold">{stats.companiesCount}</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs">Application Cost</div>
          <div className="text-white font-semibold">
            ${stats.estimatedApplicationCost}
          </div>
        </div>
        <div>
          <div className="text-gray-400 text-xs">Avg. Salary</div>
          <div className="text-white font-semibold">
            ${Math.round(stats.averageSalary).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Job Types Breakdown */}
      {Object.keys(stats.jobTypes).length > 0 && (
        <div className="mb-4">
          <div className="text-gray-400 text-xs mb-2">Job Types</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.jobTypes).map(([type, count]) => (
              <span
                key={type}
                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
              >
                {type}: {count}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onBulkAction("apply")}
          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          Apply to All ({stats.totalJobs})
        </button>
        <button
          onClick={() => onBulkAction("save")}
          className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
        >
          Save All
        </button>
      </div>
    </div>
  );
};

// Smart Filter Suggestions - suggests filters based on current selection
const SmartFilterSuggestions = ({ jobs, onApplyFilter }) => {
  const [suggestions, setSuggestions] = useState([]);

  React.useEffect(() => {
    if (!jobs || jobs.length === 0) return;

    const newSuggestions = [];

    // Analyze job data to suggest relevant filters
    const companies = [...new Set(jobs.map((job) => job.company))];
    const locations = [...new Set(jobs.map((job) => job.location))];
    const remoteJobs = jobs.filter((job) => job.isRemote);

    // Suggest company filter if there are multiple companies
    if (companies.length > 1 && companies.length <= 5) {
      companies.forEach((company) => {
        const companyJobs = jobs.filter((job) => job.company === company);
        if (companyJobs.length >= 2) {
          newSuggestions.push({
            type: "company",
            value: company,
            label: `Filter by ${company}`,
            count: companyJobs.length,
          });
        }
      });
    }

    // Suggest location filter
    if (locations.length > 1 && locations.length <= 5) {
      locations.forEach((location) => {
        const locationJobs = jobs.filter((job) => job.location === location);
        if (locationJobs.length >= 2) {
          newSuggestions.push({
            type: "location",
            value: location,
            label: `Filter by ${location}`,
            count: locationJobs.length,
          });
        }
      });
    }

    // Suggest remote filter
    if (remoteJobs.length >= 2) {
      newSuggestions.push({
        type: "remote",
        value: true,
        label: "Show only remote jobs",
        count: remoteJobs.length,
      });
    }

    setSuggestions(newSuggestions.slice(0, 4));
  }, [jobs]);

  if (suggestions.length === 0) return null;

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
      <h3 className="text-white font-medium mb-3 flex items-center gap-2">
        <Filter className="w-4 h-4" />
        Suggested Filters
      </h3>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onApplyFilter(suggestion)}
            className="px-3 py-2 bg-gray-700 hover:bg-purple-600 text-gray-300 hover:text-white text-sm rounded-lg transition-colors"
          >
            {suggestion.label} ({suggestion.count})
          </button>
        ))}
      </div>
    </div>
  );
};

export { QuickSelectionSuggestions, SelectionSummary, SmartFilterSuggestions };
