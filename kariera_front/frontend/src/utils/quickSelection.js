// src/utils/quickSelection.js - Smart selection utilities
export const quickSelectionUtils = {
  // Quick selection filters
  remoteJobs: (jobs) => jobs.filter((job) => job.remote),

  onsiteJobs: (jobs) => jobs.filter((job) => !job.remote),

  highSalaryJobs: (jobs, threshold = 100000) =>
    jobs.filter((job) => {
      const maxSalary = job.salary?.max || 0;
      return maxSalary >= threshold;
    }),

  recentJobs: (jobs, daysAgo = 7) =>
    jobs.filter((job) => {
      const posted = new Date(job.posted);
      const now = new Date();
      const diffTime = now - posted;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays <= daysAgo;
    }),

  featuredJobs: (jobs) => jobs.filter((job) => job.featured),

  urgentJobs: (jobs) => jobs.filter((job) => job.urgentHiring),

  jobsByCompany: (jobs, companyName) =>
    jobs.filter(
      (job) => job.company.toLowerCase() === companyName.toLowerCase()
    ),

  jobsByType: (jobs, jobType) =>
    jobs.filter((job) => job.type.toLowerCase() === jobType.toLowerCase()),

  jobsByExperienceLevel: (jobs, level) =>
    jobs.filter(
      (job) => job.experienceLevel.toLowerCase() === level.toLowerCase()
    ),

  jobsByLocation: (jobs, location) =>
    jobs.filter((job) =>
      job.location.toLowerCase().includes(location.toLowerCase())
    ),

  jobsBySalaryRange: (jobs, minSalary, maxSalary) =>
    jobs.filter((job) => {
      if (!job.salary?.min || !job.salary?.max) return false;
      const avgSalary = (job.salary.min + job.salary.max) / 2;
      return avgSalary >= minSalary && avgSalary <= maxSalary;
    }),

  // Smart selection suggestions
  getSelectionSuggestions: (jobs, currentSelection = []) => {
    const suggestions = [];

    // If user has selected jobs from same company, suggest more from that company
    if (currentSelection.length > 0) {
      const companies = [
        ...new Set(currentSelection.map((job) => job.company)),
      ];
      companies.forEach((company) => {
        const moreFromCompany = jobs.filter(
          (job) =>
            job.company === company &&
            !currentSelection.find((selected) => selected.id === job.id)
        );

        if (moreFromCompany.length > 0) {
          suggestions.push({
            type: "company",
            title: `More jobs at ${company}`,
            description: `Add ${moreFromCompany.length} more jobs from ${company}`,
            jobs: moreFromCompany,
            priority: 1,
          });
        }
      });
    }

    // Suggest remote jobs if user seems to prefer them
    const remoteSelected = currentSelection.filter((job) => job.remote).length;
    const totalSelected = currentSelection.length;

    if (totalSelected > 0 && remoteSelected / totalSelected > 0.5) {
      const moreRemote = jobs.filter(
        (job) =>
          job.remote &&
          !currentSelection.find((selected) => selected.id === job.id)
      );

      if (moreRemote.length > 0) {
        suggestions.push({
          type: "remote",
          title: "More remote jobs",
          description: `Add ${moreRemote.length} remote jobs similar to your selection`,
          jobs: moreRemote.slice(0, 10),
          priority: 2,
        });
      }
    }

    // Suggest high-paying jobs
    const highPayJobs = quickSelectionUtils
      .highSalaryJobs(jobs)
      .filter(
        (job) => !currentSelection.find((selected) => selected.id === job.id)
      );

    if (highPayJobs.length > 0) {
      suggestions.push({
        type: "high-salary",
        title: "High-paying opportunities",
        description: `${highPayJobs.length} jobs with $100k+ salaries`,
        jobs: highPayJobs.slice(0, 8),
        priority: 3,
      });
    }

    // Suggest recently posted jobs
    const recentJobs = quickSelectionUtils
      .recentJobs(jobs)
      .filter(
        (job) => !currentSelection.find((selected) => selected.id === job.id)
      );

    if (recentJobs.length > 0) {
      suggestions.push({
        type: "recent",
        title: "Recently posted",
        description: `${recentJobs.length} jobs posted in the last week`,
        jobs: recentJobs.slice(0, 6),
        priority: 4,
      });
    }

    // Suggest featured jobs
    const featured = quickSelectionUtils
      .featuredJobs(jobs)
      .filter(
        (job) => !currentSelection.find((selected) => selected.id === job.id)
      );

    if (featured.length > 0) {
      suggestions.push({
        type: "featured",
        title: "Featured opportunities",
        description: `${featured.length} premium job listings`,
        jobs: featured,
        priority: 5,
      });
    }

    return suggestions.sort((a, b) => a.priority - b.priority);
  },

  // Get optimal selection based on criteria
  getOptimalSelection: (jobs, criteria = {}) => {
    const {
      maxJobs = 10,
      preferRemote = false,
      minSalary = 0,
      maxSalary = Infinity,
      preferredCompanies = [],
      excludeApplied = true,
      experienceLevel = null,
      includeUrgent = true,
    } = criteria;

    let filtered = [...jobs];

    // Filter out already applied jobs
    if (excludeApplied) {
      filtered = filtered.filter((job) => !job.applied);
    }

    // Filter by salary range
    if (minSalary > 0 || maxSalary < Infinity) {
      filtered = quickSelectionUtils.jobsBySalaryRange(
        filtered,
        minSalary,
        maxSalary
      );
    }

    // Filter by experience level
    if (experienceLevel) {
      filtered = quickSelectionUtils.jobsByExperienceLevel(
        filtered,
        experienceLevel
      );
    }

    // Score jobs based on criteria
    const scoredJobs = filtered.map((job) => {
      let score = 0;

      // Base score
      score += 10;

      // Prefer remote if specified
      if (preferRemote && job.remote) score += 20;

      // Prefer companies in list
      if (preferredCompanies.includes(job.company)) score += 15;

      // Boost featured jobs
      if (job.featured) score += 10;

      // Boost urgent jobs if enabled
      if (includeUrgent && job.urgentHiring) score += 8;

      // Boost higher salaries
      const avgSalary = job.salary?.max
        ? (job.salary.min + job.salary.max) / 2
        : 0;
      score += Math.min(avgSalary / 10000, 20); // Max 20 points for salary

      // Boost recent jobs
      const posted = new Date(job.posted);
      const now = new Date();
      const daysAgo = (now - posted) / (1000 * 60 * 60 * 24);
      if (daysAgo <= 3) score += 5;
      else if (daysAgo <= 7) score += 3;

      return { ...job, score };
    });

    // Sort by score and return top jobs
    return scoredJobs.sort((a, b) => b.score - a.score).slice(0, maxJobs);
  },

  // Get similar jobs to a given job
  getSimilarJobs: (targetJob, allJobs, maxResults = 5) => {
    const similar = allJobs
      .filter((job) => job.id !== targetJob.id)
      .map((job) => {
        let similarity = 0;

        // Same company
        if (job.company === targetJob.company) similarity += 30;

        // Similar job type
        if (job.type === targetJob.type) similarity += 20;

        // Similar experience level
        if (job.experienceLevel === targetJob.experienceLevel) similarity += 15;

        // Similar remote/onsite preference
        if (job.remote === targetJob.remote) similarity += 10;

        // Similar location (if not remote)
        if (!job.remote && !targetJob.remote) {
          const jobCity = job.location.split(",")[0].trim();
          const targetCity = targetJob.location.split(",")[0].trim();
          if (jobCity === targetCity) similarity += 15;
        }

        // Similar salary range
        if (job.salary?.max && targetJob.salary?.max) {
          const jobAvg = (job.salary.min + job.salary.max) / 2;
          const targetAvg = (targetJob.salary.min + targetJob.salary.max) / 2;
          const salaryDiff = Math.abs(jobAvg - targetAvg) / targetAvg;
          if (salaryDiff < 0.2) similarity += 10; // Within 20%
        }

        // Shared skills
        const sharedSkills =
          job.skills?.filter((skill) => targetJob.skills?.includes(skill)) ||
          [];
        similarity += sharedSkills.length * 3;

        return { ...job, similarity };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, maxResults);

    return similar;
  },
};

// React component for quick selection suggestions
export const QuickSelectionSuggestions = ({
  jobs,
  currentSelection,
  onApplySuggestion,
  className = "",
}) => {
  const suggestions = quickSelectionUtils.getSelectionSuggestions(
    jobs,
    currentSelection
  );

  if (suggestions.length === 0) return null;

  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
      <h4 className="font-medium text-white mb-3">
        Quick Selection Suggestions
      </h4>
      <div className="space-y-2">
        {suggestions.slice(0, 3).map((suggestion, index) => (
          <button
            key={`${suggestion.type}-${index}`}
            onClick={() => onApplySuggestion(suggestion.jobs)}
            className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <div className="font-medium text-white text-sm">
              {suggestion.title}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {suggestion.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
