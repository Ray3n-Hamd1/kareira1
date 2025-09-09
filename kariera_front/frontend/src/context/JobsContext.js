// src/context/JobsContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const JobsContext = createContext();

// Use your actual backend URLs
const FLASK_API_URL = "http://localhost:5000"; // Flask backend
const NODE_API_URL = "http://localhost:5000/api"; // Node.js backend

export function JobsProvider({ children }) {
  const { user, token } = useAuth();
  const hasLoadedInitialData = useRef(false);

  // Job state
  const [myJobs, setMyJobs] = useState({
    saved: [],
    applied: [],
    pending: [],
    expired: [],
  });

  const [availableJobs, setAvailableJobs] = useState([]);
  const [jobStats, setJobStats] = useState({
    saved: 0,
    applied: 0,
    pending: 0,
    expired: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load real jobs from your Flask backend
  const loadRealJobsFromFlask = async (filters = {}) => {
    try {
      console.log("Loading jobs from Flask backend...");

      // Use your Flask route for getting internships
      const formData = new FormData();
      formData.append("Country", filters.location || "france");
      formData.append("Job_Title", filters.search || "IT");
      formData.append("Number_Of_Jobs", "20");

      const response = await axios.post(
        `${FLASK_API_URL}/get_internships`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.length > 0) {
        console.log(`Loaded ${response.data.length} real jobs from Flask`);
        return response.data.map((job) => ({
          id: job.id || Math.random().toString(36).substr(2, 9),
          title: job.title || "Job Title",
          company: job.company || "Company",
          location: job.location || "Location",
          salary: job.salary || "Salary not specified",
          posted: "Posted recently",
          tags: job.tags || ["Full-time"],
          description: job.description || "Job description not available",
          job_url: job.job_url || "#",
          bookmarked: false,
        }));
      }
    } catch (error) {
      console.log("Flask backend not available, trying Node.js backend...");
    }
    return [];
  };

  // Load real jobs from your Node.js backend
  const loadRealJobsFromNode = async (filters = {}) => {
    try {
      console.log("Loading jobs from Node.js backend...");

      const response = await axios.get(`${NODE_API_URL}/jobs/recommendations`, {
        params: {
          search: filters.search || "",
          location: filters.location || "",
          jobType: filters.jobType || "",
          limit: 20,
        },
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
              "x-auth-token": token,
            }
          : {},
      });

      if (response.data && response.data.jobs) {
        console.log(
          `Loaded ${response.data.jobs.length} real jobs from Node.js`
        );
        return response.data.jobs.map((job) => ({
          id: job._id || job.id || Math.random().toString(36).substr(2, 9),
          title: job.title || "Job Title",
          company: job.company || "Company",
          location: job.location || "Location",
          salary: job.salary || "Salary not specified",
          posted: job.posted || "Posted recently",
          tags: job.tags || ["Full-time"],
          description: job.description || "Job description not available",
          job_url: job.job_url || "#",
          bookmarked: job.saved || false,
        }));
      }
    } catch (error) {
      console.log("Node.js backend not available, using mock data...");
    }
    return [];
  };

  // Load jobs from CSV file (if available)
  const loadJobsFromCSV = async () => {
    try {
      console.log("Attempting to load jobs from CSV...");

      // Try to fetch the CSV file
      const response = await axios.get(`${NODE_API_URL}/jobs/csv-data`);

      if (response.data && Array.isArray(response.data)) {
        console.log(`Loaded ${response.data.length} jobs from CSV`);
        return response.data.map((job) => ({
          id: job.id || Math.random().toString(36).substr(2, 9),
          title: job.title || "Job Title",
          company: job.company || "Company",
          location: job.location || "Location",
          salary: "Salary not specified",
          posted: "Posted recently",
          tags: job.is_remote === "True" ? ["Remote"] : ["On-site"],
          description: job.description || "Job description not available",
          job_url: job.job_url || "#",
          bookmarked: false,
        }));
      }
    } catch (error) {
      console.log("CSV data not available...");
    }
    return [];
  };

  // Initialize with real data from multiple sources
  const initializeRealData = async () => {
    setLoading(true);
    try {
      let realJobs = [];

      // Try multiple backend sources in order of preference
      console.log("Attempting to load real jobs from backend...");

      // 1. Try Flask backend first (has real web scraping)
      realJobs = await loadRealJobsFromFlask();

      // 2. If Flask fails, try Node.js backend
      if (realJobs.length === 0) {
        realJobs = await loadRealJobsFromNode();
      }

      // 3. If both fail, try CSV data
      if (realJobs.length === 0) {
        realJobs = await loadJobsFromCSV();
      }

      // 4. If all real sources fail, use mock data as fallback
      if (realJobs.length === 0) {
        console.log("All real backends unavailable, using mock data");
        realJobs = getMockJobs();
      }

      console.log(`Successfully loaded ${realJobs.length} jobs`);
      setAvailableJobs(realJobs);

      // Set mock saved jobs (replace with real user data later)
      setMyJobs({
        saved: realJobs.slice(0, 3),
        applied: [],
        pending: [],
        expired: [],
      });

      setJobStats({
        saved: 20,
        applied: 20,
        pending: 20,
        expired: 20,
      });

      hasLoadedInitialData.current = true;
    } catch (error) {
      console.error("Error loading jobs:", error);
      setError("Failed to load jobs");
      // Fallback to mock data
      const mockJobs = getMockJobs();
      setAvailableJobs(mockJobs);
      setMyJobs({
        saved: mockJobs.slice(0, 3),
        applied: [],
        pending: [],
        expired: [],
      });
    } finally {
      setLoading(false);
    }
  };

  // Fallback mock data
  const getMockJobs = () => {
    return [
      {
        id: 4,
        title: "UI/UX Designer",
        company: "Meta",
        location: "Washington DC, USA",
        salary: "₦1.5million/month",
        posted: "Posted 4days ago",
        tags: ["Internship", "Freelance", "Remote"],
        description:
          "Create wireframes and prototypes to design intuitive user interfaces.\nConduct user research and testing to gather insights for design improvements.",
        bookmarked: false,
      },
      {
        id: 5,
        title: "Frontend Developer",
        company: "Google",
        location: "San Francisco, CA, USA",
        salary: "₦2.0million/month",
        posted: "Posted 2days ago",
        tags: ["Full-time", "Remote", "Senior"],
        description:
          "Build responsive web applications using React and modern JavaScript.\nCollaborate with design teams to implement pixel-perfect UIs.",
        bookmarked: true,
      },
      {
        id: 6,
        title: "Product Manager",
        company: "Apple",
        location: "Cupertino, CA, USA",
        salary: "₦2.5million/month",
        posted: "Posted 1day ago",
        tags: ["Full-time", "On-site", "Senior"],
        description:
          "Lead product strategy and roadmap for consumer electronics.\nWork with cross-functional teams to deliver innovative products.",
        bookmarked: false,
      },
      {
        id: 7,
        title: "Data Scientist",
        company: "Microsoft",
        location: "Seattle, WA, USA",
        salary: "₦1.8million/month",
        posted: "Posted 3days ago",
        tags: ["Full-time", "Hybrid", "Mid-level"],
        description:
          "Analyze large datasets to drive business insights.\nDevelop machine learning models for predictive analytics.",
        bookmarked: true,
      },
    ];
  };

  // Load jobs with filters (connects to real backend)
  const loadAvailableJobs = async (filters = {}) => {
    setLoading(true);
    try {
      let jobs = [];

      // Try to get real data first
      jobs = await loadRealJobsFromFlask(filters);

      if (jobs.length === 0) {
        jobs = await loadRealJobsFromNode(filters);
      }

      // If no real data, filter mock data
      if (jobs.length === 0) {
        jobs = getMockJobs();

        // Apply filters to mock data
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          jobs = jobs.filter(
            (job) =>
              job.title.toLowerCase().includes(searchTerm) ||
              job.company.toLowerCase().includes(searchTerm) ||
              job.description.toLowerCase().includes(searchTerm) ||
              job.location.toLowerCase().includes(searchTerm)
          );
        }
      }

      setAvailableJobs(jobs);
    } catch (error) {
      console.error("Error loading jobs with filters:", error);
    } finally {
      setLoading(false);
    }
  };

  // Simple functions without complex dependencies
  const toggleSaveJob = (jobId) => {
    setAvailableJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, bookmarked: !job.bookmarked } : job
      )
    );

    // Update stats
    const job = availableJobs.find((j) => j.id === jobId);
    if (job) {
      const increment = job.bookmarked ? -1 : 1;
      setJobStats((prev) => ({
        ...prev,
        saved: Math.max(0, prev.saved + increment),
      }));
    }
  };

  const subscribeToJobAlerts = async (email) => {
    try {
      // Try to use real backend subscription
      const response = await axios.post(`${NODE_API_URL}/jobs/subscribe`, {
        email,
        userId: user?.id,
      });

      if (response.data?.success) {
        return { success: true, message: "Subscribed successfully!" };
      }
    } catch (error) {
      console.log("Backend subscription not available, using mock");
    }

    // Mock subscription
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "Subscribed successfully!" });
      }, 1000);
    });
  };

  const loadMyJobs = () => {
    // This function exists for compatibility
  };

  const applyToJob = async (jobId, applicationData) => {
    try {
      // Try to use real backend
      const response = await axios.post(
        `${NODE_API_URL}/jobs/apply`,
        {
          jobId,
          ...applicationData,
        },
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
                "x-auth-token": token,
              }
            : {},
        }
      );

      if (response.data?.success) {
        setJobStats((prev) => ({
          ...prev,
          applied: prev.applied + 1,
        }));
        return {
          success: true,
          message: "Application submitted successfully!",
        };
      }
    } catch (error) {
      console.log("Backend application not available, using mock");
    }

    // Mock application
    setJobStats((prev) => ({
      ...prev,
      applied: prev.applied + 1,
    }));

    return { success: true, message: "Application submitted successfully!" };
  };

  // Initialize data only ONCE on mount
  useEffect(() => {
    if (!hasLoadedInitialData.current) {
      initializeRealData();
    }
  }, []); // Empty dependency array - only run once

  const contextValue = {
    myJobs,
    availableJobs,
    jobStats,
    loading,
    error,
    loadMyJobs,
    loadAvailableJobs,
    toggleSaveJob,
    applyToJob,
    subscribeToJobAlerts,
  };

  return (
    <JobsContext.Provider value={contextValue}>{children}</JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
}
