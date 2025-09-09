import api from "./api";

export const jobsApiService = {
  // Get all jobs with search and filters
  getAllJobs: async (searchParams = {}) => {
    try {
      const params = new URLSearchParams();

      // Add search parameters
      Object.keys(searchParams).forEach((key) => {
        if (
          searchParams[key] !== undefined &&
          searchParams[key] !== null &&
          searchParams[key] !== ""
        ) {
          if (Array.isArray(searchParams[key])) {
            searchParams[key].forEach((value) => params.append(key, value));
          } else {
            params.append(key, searchParams[key]);
          }
        }
      });

      console.log("Fetching all jobs with params:", searchParams);

      const response = await api.get(`/jobs/all?${params.toString()}`);

      return {
        success: true,
        jobs: response.data.jobs || response.data || [],
        totalCount: response.data.totalCount || response.data.total || 0,
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
      };
    } catch (error) {
      console.error("Error getting all jobs:", error);

      // If endpoint doesn't exist, return empty array (backend needs this endpoint)
      if (error.response?.status === 404) {
        return {
          success: true,
          jobs: [],
          totalCount: 0,
          message: "Jobs endpoint not implemented yet",
        };
      }

      return {
        success: false,
        jobs: [],
        totalCount: 0,
        error: error.response?.data?.message || "Failed to fetch jobs",
      };
    }
  },

  // Get job recommendations based on resume upload
  getJobRecommendations: async (resumeFile, options = {}) => {
    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("country", options.country || "usa");
      formData.append("jobTitle", options.jobTitle || "internship");
      formData.append("numberOfJobs", (options.numberOfJobs || 10).toString());

      console.log("Sending job recommendations request...");

      const response = await api.post("/jobs/recommendations", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      });

      console.log("Job recommendations received:", response.data);

      return {
        success: true,
        jobs: response.data.jobs || [],
        totalCount: response.data.jobs?.length || 0,
        message:
          response.data.message || "Job recommendations retrieved successfully",
      };
    } catch (error) {
      console.error("Error getting job recommendations:", error);

      return {
        success: false,
        jobs: [],
        totalCount: 0,
        error:
          error.response?.data?.message || "Failed to get job recommendations",
      };
    }
  },

  // Get job details by ID
  getJobById: async (jobId) => {
    try {
      const response = await api.get(`/jobs/${jobId}`);

      return {
        success: true,
        job: response.data.job || response.data,
      };
    } catch (error) {
      console.error("Error getting job details:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get job details",
      };
    }
  },

  // Save/bookmark a job
  saveJob: async (jobId) => {
    try {
      const response = await api.post(`/jobs/${jobId}/save`);

      return {
        success: true,
        data: response.data,
        message: response.data.message || "Job saved successfully",
      };
    } catch (error) {
      console.error("Save job error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to save job",
      };
    }
  },

  // Search jobs with text query
  searchJobs: async (query, filters = {}) => {
    try {
      const searchParams = {
        q: query,
        ...filters,
      };

      return await this.getAllJobs(searchParams);
    } catch (error) {
      console.error("Error searching jobs:", error);
      return {
        success: false,
        jobs: [],
        error: "Failed to search jobs",
      };
    }
  },

  validateResumeFile: (file) => {
    const errors = [];

    if (!file) {
      errors.push("Please select a resume file");
      return { isValid: false, errors };
    }

    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      errors.push("Please upload a PDF file");
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      errors.push("File size must be less than 10MB");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

export default jobsApiService;
