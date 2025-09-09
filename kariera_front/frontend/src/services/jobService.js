// src/services/jobService.js - Updated to use real backend APIs
import api from "./api";

// Get all available jobs from scraped data
export const getAllJobs = async () => {
  try {
    console.log("Fetching all jobs from API...");
    const response = await api.get("/jobs/all");
    return response.data;
  } catch (error) {
    console.error("Error getting all jobs:", error);
    throw error;
  }
};

// Search for jobs based on criteria
export const searchJobs = async (searchParams = {}) => {
  try {
    console.log("Searching jobs with params:", searchParams);
    const response = await api.get("/jobs/search", { params: searchParams });
    return response.data;
  } catch (error) {
    console.error("Error searching jobs:", error);
    throw error;
  }
};

// Get job recommendations based on resume upload (existing)
export const getJobRecommendations = async (formData) => {
  try {
    const response = await api.post("/jobs/recommendations", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting job recommendations:", error);
    throw error;
  }
};

// Save a job to user favorites
export const saveJob = async (jobId) => {
  try {
    const response = await api.post("/jobs/save", { jobId });
    return response.data;
  } catch (error) {
    console.error("Error saving job:", error);
    throw error;
  }
};

// Get saved jobs for current user
export const getSavedJobs = async () => {
  try {
    const response = await api.get("/jobs/saved");
    return response.data;
  } catch (error) {
    console.error("Error getting saved jobs:", error);
    throw error;
  }
};

// Get job details by ID
export const getJobDetails = async (jobId) => {
  try {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting job details:", error);
    throw error;
  }
};

// Trigger job scraping manually
export const scrapeJobs = async () => {
  try {
    console.log("Triggering job scraping...");
    const response = await api.post("/jobs/scrape");
    return response.data;
  } catch (error) {
    console.error("Error scraping jobs:", error);
    throw error;
  }
};

// Apply to multiple jobs at once
export const applyToJobs = async (jobIds) => {
  try {
    const response = await api.post("/jobs/apply-bulk", { jobIds });
    return response.data;
  } catch (error) {
    console.error("Error applying to jobs:", error);
    throw error;
  }
};

// Get application status for jobs
export const getApplicationStatus = async () => {
  try {
    const response = await api.get("/jobs/applications");
    return response.data;
  } catch (error) {
    console.error("Error getting application status:", error);
    throw error;
  }
};

// Get job statistics
export const getJobStats = async () => {
  try {
    const response = await api.get("/jobs/stats");
    return response.data;
  } catch (error) {
    console.error("Error getting job stats:", error);
    throw error;
  }
};
