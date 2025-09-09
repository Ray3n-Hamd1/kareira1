import { useState, useCallback, useEffect } from "react";
import jobsApiService from "../services/jobsApiService";

export const useJobsApi = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load all jobs on mount
  const loadJobs = useCallback(async (searchParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await jobsApiService.getAllJobs(searchParams);

      if (result.success) {
        setJobs(result.jobs);
        setTotalCount(result.totalCount);
        setCurrentPage(result.currentPage);
        setTotalPages(result.totalPages);
        setError(null);

        console.log(`Successfully loaded ${result.jobs.length} jobs`);
      } else {
        setError(result.error);
        setJobs([]);
        setTotalCount(0);
      }
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      setJobs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search jobs
  const searchJobs = useCallback(async (query, filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await jobsApiService.searchJobs(query, filters);

      if (result.success) {
        setJobs(result.jobs);
        setTotalCount(result.totalCount);
        setError(null);
      } else {
        setError(result.error);
        setJobs([]);
        setTotalCount(0);
      }
    } catch (err) {
      const errorMessage = err.message || "Search failed";
      setError(errorMessage);
      setJobs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get job recommendations based on resume
  const getJobRecommendations = useCallback(
    async (resumeFile, options = {}) => {
      setLoading(true);
      setError(null);

      try {
        const validation = jobsApiService.validateResumeFile(resumeFile);
        if (!validation.isValid) {
          setError(validation.errors.join(", "));
          setLoading(false);
          return { success: false, error: validation.errors.join(", ") };
        }

        console.log("Getting job recommendations for file:", resumeFile.name);

        const result = await jobsApiService.getJobRecommendations(
          resumeFile,
          options
        );

        if (result.success) {
          setJobs(result.jobs);
          setTotalCount(result.totalCount);
          setError(null);

          console.log(
            `Successfully loaded ${result.jobs.length} job recommendations`
          );
        } else {
          setError(result.error);
          setJobs([]);
          setTotalCount(0);
        }

        setLoading(false);
        return result;
      } catch (err) {
        const errorMessage = err.message || "An unexpected error occurred";
        setError(errorMessage);
        setJobs([]);
        setTotalCount(0);
        setLoading(false);

        return { success: false, error: errorMessage };
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearJobs = useCallback(() => {
    setJobs([]);
    setTotalCount(0);
    setError(null);
    setLoading(false);
  }, []);

  // Auto-load jobs on mount
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  return {
    jobs,
    loading,
    error,
    totalCount,
    currentPage,
    totalPages,
    loadJobs,
    searchJobs,
    getJobRecommendations,
    clearError,
    clearJobs,
  };
};

export default useJobsApi;
