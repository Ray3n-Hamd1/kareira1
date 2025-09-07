// src/hooks/useJobSelection.js - Simple version for immediate use
import { useState, useEffect, useMemo } from "react";

export const useJobSelection = (jobs = []) => {
  const [selectedJobIds, setSelectedJobIds] = useState(new Set());

  // Clear selection when jobs change significantly
  useEffect(() => {
    if (jobs.length === 0) {
      setSelectedJobIds(new Set());
    }
  }, [jobs]);

  // Get selected job objects
  const selectedJobs = useMemo(() => {
    return jobs.filter((job) => selectedJobIds.has(job.id));
  }, [jobs, selectedJobIds]);

  // Calculate basic selection statistics
  const selectionStats = useMemo(() => {
    const selected = selectedJobs;
    const totalSalary = selected.reduce((sum, job) => {
      const salary =
        typeof job.salary === "string"
          ? parseInt(job.salary.replace(/[^\d]/g, "")) || 0
          : job.salary || 0;
      return sum + salary;
    }, 0);

    return {
      totalJobs: selected.length,
      totalSalary,
      averageSalary: selected.length > 0 ? totalSalary / selected.length : 0,
      estimatedApplicationCost: selected.length * 10, // $10 per application
    };
  }, [selectedJobs]);

  // Toggle individual job selection
  const toggleJobSelection = (jobId) => {
    setSelectedJobIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  // Select all jobs
  const selectAllJobs = () => {
    const allJobIds = new Set(jobs.map((job) => job.id));
    setSelectedJobIds(allJobIds);
  };

  // Clear all selections
  const clearSelection = () => {
    setSelectedJobIds(new Set());
  };

  // Check if all jobs are selected
  const isAllSelected = jobs.length > 0 && selectedJobIds.size === jobs.length;

  // Check if some jobs are selected
  const isSomeSelected =
    selectedJobIds.size > 0 && selectedJobIds.size < jobs.length;

  return {
    selectedJobIds,
    selectedJobs,
    selectionStats,
    isAllSelected,
    isSomeSelected,
    toggleJobSelection,
    selectAllJobs,
    clearSelection,
  };
};
