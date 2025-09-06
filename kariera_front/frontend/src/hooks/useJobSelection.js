// src/hooks/useJobSelection.js - Enhanced selection management
import { useState, useCallback, useMemo } from "react";

export const useJobSelection = (jobs = []) => {
  const [selectedJobIds, setSelectedJobIds] = useState(new Set());
  const [lastSelectedId, setLastSelectedId] = useState(null);

  // Get selected jobs data
  const selectedJobs = useMemo(() => {
    return jobs.filter((job) => selectedJobIds.has(job.id));
  }, [jobs, selectedJobIds]);

  // Selection stats
  const selectionStats = useMemo(() => {
    const selected = selectedJobs;
    const totalSalary = selected.reduce((sum, job) => {
      const avgSalary = job.salary?.max
        ? (job.salary.min + job.salary.max) / 2
        : 0;
      return sum + avgSalary;
    }, 0);

    const companies = [...new Set(selected.map((job) => job.company))];
    const jobTypes = [...new Set(selected.map((job) => job.type))];
    const locations = [...new Set(selected.map((job) => job.location))];

    return {
      count: selected.length,
      averageSalary:
        selected.length > 0 ? Math.round(totalSalary / selected.length) : 0,
      companies: companies.length,
      uniqueCompanies: companies,
      jobTypes: jobTypes.length,
      uniqueJobTypes: jobTypes,
      locations: locations.length,
      uniqueLocations: locations,
      hasRemoteJobs: selected.some((job) => job.remote),
      hasOnsiteJobs: selected.some((job) => !job.remote),
    };
  }, [selectedJobs]);

  // Single job selection
  const toggleJobSelection = useCallback(
    (jobId, event = null) => {
      setSelectedJobIds((prev) => {
        const newSet = new Set(prev);

        // Handle shift+click for range selection
        if (event?.shiftKey && lastSelectedId && lastSelectedId !== jobId) {
          const currentIndex = jobs.findIndex((job) => job.id === jobId);
          const lastIndex = jobs.findIndex((job) => job.id === lastSelectedId);

          if (currentIndex !== -1 && lastIndex !== -1) {
            const start = Math.min(currentIndex, lastIndex);
            const end = Math.max(currentIndex, lastIndex);

            // Add all jobs in range
            for (let i = start; i <= end; i++) {
              newSet.add(jobs[i].id);
            }

            setLastSelectedId(jobId);
            return newSet;
          }
        }

        // Normal toggle
        if (newSet.has(jobId)) {
          newSet.delete(jobId);
        } else {
          newSet.add(jobId);
          setLastSelectedId(jobId);
        }

        return newSet;
      });
    },
    [jobs, lastSelectedId]
  );

  // Select all visible jobs
  const selectAllJobs = useCallback(
    (jobsToSelect = jobs) => {
      const newSelectedIds = new Set([...selectedJobIds]);
      jobsToSelect.forEach((job) => newSelectedIds.add(job.id));
      setSelectedJobIds(newSelectedIds);
    },
    [jobs, selectedJobIds]
  );

  // Deselect all jobs
  const clearSelection = useCallback(() => {
    setSelectedJobIds(new Set());
    setLastSelectedId(null);
  }, []);

  // Select by criteria
  const selectByFilter = useCallback(
    (filterFn) => {
      const filteredJobs = jobs.filter(filterFn);
      const newSelectedIds = new Set([...selectedJobIds]);
      filteredJobs.forEach((job) => newSelectedIds.add(job.id));
      setSelectedJobIds(newSelectedIds);
    },
    [jobs, selectedJobIds]
  );

  // Quick selection methods
  const selectRemoteJobs = useCallback(() => {
    selectByFilter((job) => job.remote);
  }, [selectByFilter]);

  const selectByCompany = useCallback(
    (companyName) => {
      selectByFilter((job) => job.company === companyName);
    },
    [selectByFilter]
  );

  const selectByJobType = useCallback(
    (jobType) => {
      selectByFilter((job) => job.type === jobType);
    },
    [selectByFilter]
  );

  const selectBySalaryRange = useCallback(
    (minSalary, maxSalary) => {
      selectByFilter((job) => {
        const avgSalary = job.salary?.max
          ? (job.salary.min + job.salary.max) / 2
          : 0;
        return avgSalary >= minSalary && avgSalary <= maxSalary;
      });
    },
    [selectByFilter]
  );

  // Check if job is selected
  const isJobSelected = useCallback(
    (jobId) => {
      return selectedJobIds.has(jobId);
    },
    [selectedJobIds]
  );

  // Check selection states
  const isAllSelected = useMemo(() => {
    return jobs.length > 0 && jobs.every((job) => selectedJobIds.has(job.id));
  }, [jobs, selectedJobIds]);

  const isPartiallySelected = useMemo(() => {
    return selectedJobIds.size > 0 && !isAllSelected;
  }, [selectedJobIds.size, isAllSelected]);

  return {
    selectedJobIds,
    selectedJobs,
    selectionStats,
    toggleJobSelection,
    selectAllJobs,
    clearSelection,
    selectByFilter,
    selectRemoteJobs,
    selectByCompany,
    selectByJobType,
    selectBySalaryRange,
    isJobSelected,
    isAllSelected,
    isPartiallySelected,
  };
};
