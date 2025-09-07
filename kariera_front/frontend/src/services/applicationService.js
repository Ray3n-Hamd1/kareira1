// src/services/applicationService.js
import axios from "axios";

/**
 * Service for managing job applications
 */
export const applicationService = {
  /**
   * Submit a job application
   * @param {Object} jobData - The job details
   * @param {Object} applicationData - The application form data
   * @returns {Promise<Object>} - The response data
   */
  async submitApplication(jobData, applicationData) {
    try {
      // For development without API
      if (process.env.REACT_APP_USE_MOCK_API === "true") {
        return await this.submitMockApplication(jobData, applicationData);
      }

      // Prepare form data for file upload
      const formData = new FormData();
      formData.append("job", JSON.stringify(jobData));

      // Add all application data fields
      Object.keys(applicationData).forEach((key) => {
        if (key === "resumeFile" && applicationData.resumeFile) {
          formData.append("resume", applicationData.resumeFile);
        } else if (key === "customQuestions") {
          formData.append(
            "customQuestions",
            JSON.stringify(applicationData.customQuestions)
          );
        } else {
          formData.append(key, applicationData[key]);
        }
      });

      const response = await axios.post("/api/applications/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error submitting application:", error);
      throw new Error("Failed to submit application. Please try again.");
    }
  },

  /**
   * Submit a mock application for development/testing
   * @param {Object} jobData - The job details
   * @param {Object} applicationData - The application form data
   * @returns {Promise<Object>} - The response data
   */
  async submitMockApplication(jobData, applicationData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Mock response
    return {
      success: true,
      applicationId: "app_" + Math.random().toString(36).substr(2, 9),
      message: "Application submitted successfully!",
      job: jobData,
      applicationDate: new Date().toISOString(),
      status: "pending",
    };
  },

  /**
   * Submit multiple applications (bulk apply)
   * @param {Array} jobs - Array of job objects
   * @param {Object} commonData - Common application data to use for all jobs
   * @returns {Promise<Object>} - The response data
   */
  async submitBulkApplications(jobs, commonData) {
    try {
      // For development without API
      if (process.env.REACT_APP_USE_MOCK_API === "true") {
        return await this.submitMockBulkApplications(jobs, commonData);
      }

      const response = await axios.post("/api/applications/bulk-submit", {
        jobs,
        applicationData: commonData,
      });

      return response.data;
    } catch (error) {
      console.error("Error submitting bulk applications:", error);
      throw new Error("Failed to submit bulk applications. Please try again.");
    }
  },

  /**
   * Submit mock bulk applications for development/testing
   * @param {Array} jobs - Array of job objects
   * @param {Object} commonData - Common application data to use for all jobs
   * @returns {Promise<Object>} - The response data
   */
  async submitMockBulkApplications(jobs, commonData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Generate mock results for each job
    const results = jobs.map((job) => ({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      success: true,
      applicationId: "app_" + Math.random().toString(36).substr(2, 9),
      status: "pending",
    }));

    // Mock response
    return {
      success: true,
      message: `Successfully submitted ${jobs.length} applications`,
      results,
      completedAt: new Date().toISOString(),
    };
  },

  /**
   * Get the user's application history
   * @param {string} status - Filter by status (optional)
   * @param {number} limit - Maximum number of results to return
   * @returns {Promise<Array>} - Array of application objects
   */
  async getApplicationHistory(status = null, limit = 10) {
    try {
      // For development without API
      if (process.env.REACT_APP_USE_MOCK_API === "true") {
        return await this.getMockApplicationHistory(status, limit);
      }

      const params = {};
      if (status) params.status = status;
      if (limit) params.limit = limit;

      const response = await axios.get("/api/applications/history", { params });
      return response.data.applications;
    } catch (error) {
      console.error("Error fetching application history:", error);
      throw new Error("Failed to fetch application history. Please try again.");
    }
  },

  /**
   * Get mock application history for development/testing
   * @param {string} status - Filter by status (optional)
   * @param {number} limit - Maximum number of results to return
   * @returns {Promise<Array>} - Array of application objects
   */
  async getMockApplicationHistory(status = null, limit = 10) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create mock application data
    const mockApplications = [
      {
        id: "app_1",
        jobId: "job_1",
        jobTitle: "Senior Frontend Developer",
        company: "Google",
        location: "San Francisco, CA",
        appliedDate: "2023-05-15T10:30:00Z",
        status: "pending",
        coverLetterUrl: "/api/applications/app_1/cover-letter",
        resumeUrl: "/api/applications/app_1/resume",
      },
      {
        id: "app_2",
        jobId: "job_2",
        jobTitle: "UX Designer",
        company: "Netflix",
        location: "Los Angeles, CA",
        appliedDate: "2023-05-10T14:20:00Z",
        status: "reviewed",
        coverLetterUrl: "/api/applications/app_2/cover-letter",
        resumeUrl: "/api/applications/app_2/resume",
      },
      {
        id: "app_3",
        jobId: "job_3",
        jobTitle: "Data Scientist",
        company: "Amazon",
        location: "Seattle, WA",
        appliedDate: "2023-05-05T09:45:00Z",
        status: "interview_scheduled",
        interviewDate: "2023-05-20T13:00:00Z",
        coverLetterUrl: "/api/applications/app_3/cover-letter",
        resumeUrl: "/api/applications/app_3/resume",
      },
      {
        id: "app_4",
        jobId: "job_4",
        jobTitle: "Product Manager",
        company: "Apple",
        location: "Cupertino, CA",
        appliedDate: "2023-04-28T11:15:00Z",
        status: "rejected",
        coverLetterUrl: "/api/applications/app_4/cover-letter",
        resumeUrl: "/api/applications/app_4/resume",
      },
      {
        id: "app_5",
        jobId: "job_5",
        jobTitle: "Full Stack Developer",
        company: "Microsoft",
        location: "Redmond, WA",
        appliedDate: "2023-04-20T08:30:00Z",
        status: "offer",
        offerDetails: {
          salary: "$130,000/year",
          startDate: "2023-06-15",
          deadline: "2023-05-25",
        },
        coverLetterUrl: "/api/applications/app_5/cover-letter",
        resumeUrl: "/api/applications/app_5/resume",
      },
    ];

    // Filter by status if provided
    let filteredApplications = mockApplications;
    if (status) {
      filteredApplications = mockApplications.filter(
        (app) => app.status === status
      );
    }

    // Apply limit
    return filteredApplications.slice(0, limit);
  },
};

export default applicationService;
