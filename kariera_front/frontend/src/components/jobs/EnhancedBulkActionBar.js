// DEBUG VERSION - useJobSelection.js
import { useState, useCallback, useMemo } from "react";

export const useJobSelection = (jobs = []) => {
  console.log("🔧 useJobSelection called with jobs:", jobs?.length || 0);

  const [selectedJobIds, setSelectedJobIds] = useState(new Set());
  const [lastSelectedId, setLastSelectedId] = useState(null);

  // Get selected jobs data
  const selectedJobs = useMemo(() => {
    const result = jobs.filter((job) => selectedJobIds.has(job.id));
    console.log("🔧 selectedJobs calculated:", result?.length || 0);
    return result;
  }, [jobs, selectedJobIds]);

  // DEBUGGING: Selection stats with extensive logging
  const selectionStats = useMemo(() => {
    console.log("🔧 ========== CALCULATING SELECTION STATS ==========");
    console.log("🔧 selectedJobs input:", selectedJobs);
    console.log("🔧 selectedJobs length:", selectedJobs?.length || 0);

    const selected = selectedJobs;

    // SAFETY CHECK: Return safe defaults if no jobs selected
    if (!selected || selected.length === 0) {
      console.log("🔧 No selected jobs, returning defaults");
      const defaults = {
        count: 0,
        averageSalary: 0,
        companies: 0,
        uniqueCompanies: [],
        jobTypes: 0,
        uniqueJobTypes: [],
        locations: 0,
        uniqueLocations: [],
        hasRemoteJobs: false,
        hasOnsiteJobs: false,
      };
      console.log("🔧 Returning defaults:", defaults);
      return defaults;
    }

    console.log("🔧 Processing selected jobs for salary calculation...");

    const totalSalary = selected.reduce((sum, job, index) => {
      console.log(`🔧 Processing job ${index}:`, job?.title || "Unknown");
      console.log(`🔧 Job salary:`, job?.salary);
      console.log(`🔧 Job salary type:`, typeof job?.salary);

      // Check if job and job.salary exist
      if (!job || !job.salary) {
        console.log(`🔧 Job ${index} has no salary, skipping`);
        return sum;
      }

      let avgSalary = 0;

      if (typeof job.salary === "number") {
        avgSalary = job.salary;
        console.log(`🔧 Job ${index} - number salary:`, avgSalary);
      } else if (typeof job.salary === "string") {
        // Handle string salaries
        const parsed = parseFloat(job.salary.replace(/[$,k]/g, ""));
        avgSalary = job.salary.includes("k") ? parsed * 1000 : parsed;
        console.log(`🔧 Job ${index} - string salary converted:`, avgSalary);
      } else if (typeof job.salary === "object" && job.salary !== null) {
        console.log(`🔧 Job ${index} - object salary:`, job.salary);
        if (job.salary.min && job.salary.max) {
          avgSalary = (job.salary.min + job.salary.max) / 2;
          console.log(`🔧 Job ${index} - calculated average:`, avgSalary);
        } else if (job.salary.min) {
          avgSalary = job.salary.min;
          console.log(`🔧 Job ${index} - using min:`, avgSalary);
        } else if (job.salary.max) {
          avgSalary = job.salary.max;
          console.log(`🔧 Job ${index} - using max:`, avgSalary);
        } else if (job.salary.amount) {
          avgSalary = job.salary.amount;
          console.log(`🔧 Job ${index} - using amount:`, avgSalary);
        }
      }

      console.log(`🔧 Job ${index} - final avgSalary:`, avgSalary);
      console.log(`🔧 Job ${index} - running sum:`, sum + avgSalary);

      return sum + (avgSalary || 0);
    }, 0);

    console.log("🔧 Total salary calculated:", totalSalary);

    const companies = [
      ...new Set(
        selected
          .map((job) => job?.company)
          .filter((company) => company && typeof company === "string")
      ),
    ];

    const jobTypes = [
      ...new Set(
        selected
          .map((job) => job?.type)
          .filter((type) => type && typeof type === "string")
      ),
    ];

    const locations = [
      ...new Set(
        selected
          .map((job) => job?.location)
          .filter((location) => location && typeof location === "string")
      ),
    ];

    // CRITICAL: Calculate average salary safely
    const calculatedAverageSalary =
      selected.length > 0 && totalSalary > 0
        ? Math.round(totalSalary / selected.length)
        : 0;

    console.log("🔧 Calculated average salary:", calculatedAverageSalary);
    console.log("🔧 Average salary type:", typeof calculatedAverageSalary);

    const result = {
      count: selected.length,
      averageSalary: calculatedAverageSalary,
      companies: companies.length,
      uniqueCompanies: companies,
      jobTypes: jobTypes.length,
      uniqueJobTypes: jobTypes,
      locations: locations.length,
      uniqueLocations: locations,
      hasRemoteJobs: selected.some((job) => job.remote),
      hasOnsiteJobs: selected.some((job) => !job.remote),
    };

    console.log("🔧 ========== FINAL SELECTION STATS ==========");
    console.log("🔧 Final result:", result);
    console.log("🔧 Final averageSalary:", result.averageSalary);
    console.log("🔧 Final averageSalary type:", typeof result.averageSalary);
    console.log("🔧 =======================================");

    // EXTRA SAFETY CHECK
    if (typeof result.averageSalary === "object") {
      console.error(
        "🚨 CRITICAL ERROR: averageSalary is an object!",
        result.averageSalary
      );
      result.averageSalary = 0; // Force to number
    }

    return result;
  }, [selectedJobs]);

  // Single job selection
  const toggleJobSelection = useCallback(
    (jobId, event = null) => {
      console.log("🔧 toggleJobSelection called for:", jobId);

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

        console.log("🔧 New selection size:", newSet.size);
        return newSet;
      });
    },
    [jobs, lastSelectedId]
  );

  // Select all visible jobs
  const selectAllJobs = useCallback(
    (jobsToSelect = jobs) => {
      console.log("🔧 selectAllJobs called with:", jobsToSelect?.length || 0);
      const newSelectedIds = new Set([...selectedJobIds]);
      jobsToSelect.forEach((job) => newSelectedIds.add(job.id));
      setSelectedJobIds(newSelectedIds);
    },
    [jobs, selectedJobIds]
  );

  // Deselect all jobs
  const clearSelection = useCallback(() => {
    console.log("🔧 clearSelection called");
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

  // DEBUGGING: Safe salary range selection
  const selectBySalaryRange = useCallback(
    (minSalary, maxSalary) => {
      selectByFilter((job) => {
        let avgSalary = 0;

        if (job.salary) {
          if (typeof job.salary === "number") {
            avgSalary = job.salary;
          } else if (typeof job.salary === "object" && job.salary.max) {
            avgSalary = (job.salary.min + job.salary.max) / 2;
          }
        }

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
