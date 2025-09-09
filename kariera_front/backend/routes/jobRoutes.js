const express = require("express");
const multer = require("multer");
const path = require("path");
const { protect } = require("../middleware/authMiddleware");
const { getJobRecommendations } = require("../controllers/jobController");
const AvailableJob = require("../models/AvailableJob");
const {
  scrapeJobs,
  getJobsFromDatabase,
} = require("../services/jobScraperService");

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to only accept PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// ENHANCED: Search jobs with advanced filtering from database
router.get("/search", protect, async (req, res) => {
  try {
    const {
      query = "",
      location = "",
      jobType = "",
      isRemote = "",
      experienceLevel = "",
      salaryMin = "",
      salaryMax = "",
      companySize = "",
      industry = "",
      skills = "",
      sortBy = "postedAt",
      sortOrder = "desc",
      page = 1,
      limit = 20,
    } = req.query;

    console.log("Advanced job search request:", req.query);

    // Build MongoDB query
    let dbQuery = { isActive: true, isExpired: false };

    // Text search across title, description, and company
    if (query.trim()) {
      dbQuery.$or = [
        { title: { $regex: query, $options: "i" } },
        { company: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    // Location filter
    if (location.trim()) {
      dbQuery.location = { $regex: location, $options: "i" };
    }

    // Job type filter
    if (jobType) {
      dbQuery.jobType = jobType;
    }

    // Remote work filter
    if (isRemote !== "") {
      dbQuery.isRemote = isRemote === "true";
    }

    // Experience level filter
    if (experienceLevel) {
      dbQuery.experienceLevel = experienceLevel;
    }

    // Salary range filter
    if (salaryMin || salaryMax) {
      dbQuery.$and = dbQuery.$and || [];
      if (salaryMin) {
        dbQuery.$and.push({ salaryMin: { $gte: parseInt(salaryMin) } });
      }
      if (salaryMax) {
        dbQuery.$and.push({ salaryMax: { $lte: parseInt(salaryMax) } });
      }
    }

    // Company size filter
    if (companySize) {
      dbQuery.companySize = companySize;
    }

    // Industry filter
    if (industry) {
      dbQuery.industry = industry;
    }

    // Skills filter
    if (skills) {
      const skillsArray = skills.split(",").map((skill) => skill.trim());
      dbQuery.skills = { $in: skillsArray };
    }

    // Build sort options
    const sortOptions = {};
    if (sortBy === "postedAt") {
      sortOptions.postedAt = sortOrder === "asc" ? 1 : -1;
    } else if (sortBy === "company") {
      sortOptions.company = sortOrder === "asc" ? 1 : -1;
    } else if (sortBy === "title") {
      sortOptions.title = sortOrder === "asc" ? 1 : -1;
    } else if (sortBy === "salary") {
      sortOptions.salaryMax = sortOrder === "asc" ? 1 : -1;
    } else {
      sortOptions.postedAt = -1; // Default to newest first
    }

    console.log("Database query:", JSON.stringify(dbQuery, null, 2));
    console.log("Sort options:", sortOptions);

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [jobs, totalCount] = await Promise.all([
      AvailableJob.find(dbQuery)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      AvailableJob.countDocuments(dbQuery),
    ]);

    console.log(
      `Found ${jobs.length} jobs out of ${totalCount} total matching jobs`
    );

    // Format jobs for frontend
    const formattedJobs = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      jobUrl: job.jobUrl,
      isRemote: job.isRemote,
      jobType: job.jobType,
      experienceLevel: job.experienceLevel,
      skills: job.skills || [],
      postedAt: job.postedAt,
      salary:
        job.salaryMin && job.salaryMax
          ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
          : job.salaryMin
          ? `$${job.salaryMin.toLocaleString()}+`
          : "Salary not specified",
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      companySize: job.companySize,
      industry: job.industry,
      saved: false, // TODO: Check if user has saved this job
      applied: false, // TODO: Check if user has applied to this job
      viewCount: job.viewCount || 0,
      applicationCount: job.applicationCount || 0,
    }));

    res.json({
      success: true,
      jobs: formattedJobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalJobs: totalCount,
        hasNextPage: skip + parseInt(limit) < totalCount,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit),
      },
      filters: {
        query,
        location,
        jobType,
        isRemote,
        experienceLevel,
        salaryMin,
        salaryMax,
        companySize,
        industry,
        skills,
      },
    });
  } catch (error) {
    console.error("Error searching jobs:", error);
    res.status(500).json({
      success: false,
      message: "Error searching jobs",
      error: error.message,
    });
  }
});

// ENHANCED: Get all available jobs from database
router.get("/all", protect, async (req, res) => {
  try {
    console.log("Request for all jobs from database");

    // Get jobs from database
    let jobs = await getJobsFromDatabase();

    // If no jobs found, trigger scraping
    if (jobs.length === 0) {
      console.log("No jobs found in database, triggering scraping...");
      await scrapeJobs();
      jobs = await getJobsFromDatabase();
    }

    console.log(`Found ${jobs.length} jobs in database`);

    // Format jobs for frontend
    const formattedJobs = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      jobUrl: job.jobUrl,
      isRemote: job.isRemote,
      jobType: job.jobType || "Full-time",
      experienceLevel: job.experienceLevel || "Entry Level",
      skills: job.skills || [],
      postedAt: job.postedAt || new Date(),
      salary:
        job.salaryMin && job.salaryMax
          ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
          : job.salaryMin
          ? `$${job.salaryMin.toLocaleString()}+`
          : `$${Math.floor(Math.random() * 50000) + 40000}`, // Fallback
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      companySize: job.companySize,
      industry: job.industry,
      saved: false,
      applied: false,
      viewCount: job.viewCount || 0,
      applicationCount: job.applicationCount || 0,
    }));

    res.json({
      success: true,
      jobs: formattedJobs,
      count: formattedJobs.length,
      source: "database",
    });
  } catch (error) {
    console.error("Error fetching jobs from database:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching jobs",
      error: error.message,
    });
  }
});

// NEW: Get job details by ID
router.get("/details/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching job details for ID: ${id}`);

    const job = await AvailableJob.findOne({ id, isActive: true });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Increment view count
    await job.incrementViewCount();

    // Format job for frontend
    const formattedJob = {
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      jobUrl: job.jobUrl,
      isRemote: job.isRemote,
      jobType: job.jobType,
      experienceLevel: job.experienceLevel,
      skills: job.skills || [],
      requirements: job.requirements || [],
      benefits: job.benefits || [],
      postedAt: job.postedAt,
      expiresAt: job.expiresAt,
      salary:
        job.salaryMin && job.salaryMax
          ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
          : job.salaryMin
          ? `$${job.salaryMin.toLocaleString()}+`
          : "Salary not specified",
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      companySize: job.companySize,
      industry: job.industry,
      source: job.source,
      viewCount: job.viewCount,
      applicationCount: job.applicationCount,
      saved: false, // TODO: Check if user has saved this job
      applied: false, // TODO: Check if user has applied to this job
    };

    res.json({
      success: true,
      job: formattedJob,
    });
  } catch (error) {
    console.error("Error fetching job details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching job details",
      error: error.message,
    });
  }
});

// NEW: Get job statistics
router.get("/stats", protect, async (req, res) => {
  try {
    const [
      totalJobs,
      remoteJobs,
      recentJobs,
      jobsByType,
      jobsByExperience,
      topCompanies,
      topLocations,
    ] = await Promise.all([
      AvailableJob.countDocuments({ isActive: true }),
      AvailableJob.countDocuments({ isActive: true, isRemote: true }),
      AvailableJob.countDocuments({
        isActive: true,
        postedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
      AvailableJob.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$jobType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      AvailableJob.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$experienceLevel", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      AvailableJob.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$company", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      AvailableJob.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$location", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        totalJobs,
        remoteJobs,
        recentJobs,
        remotePercentage:
          totalJobs > 0 ? Math.round((remoteJobs / totalJobs) * 100) : 0,
        jobsByType: jobsByType.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        jobsByExperience: jobsByExperience.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        topCompanies: topCompanies.map((item) => ({
          name: item._id,
          count: item.count,
        })),
        topLocations: topLocations.map((item) => ({
          name: item._id,
          count: item.count,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching job stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching job statistics",
      error: error.message,
    });
  }
});

// ENHANCED: Trigger manual job scraping
router.post("/scrape", protect, async (req, res) => {
  try {
    console.log(
      "Manual job scraping triggered by user:",
      req.user?.email || req.userId
    );
    const jobs = await scrapeJobs();

    res.json({
      success: true,
      message: `Successfully scraped and stored ${jobs.length} jobs`,
      jobCount: jobs.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error manually scraping jobs:", error);
    res.status(500).json({
      success: false,
      message: "Error scraping jobs",
      error: error.message,
    });
  }
});

// Existing route: Get job recommendations based on resume upload
router.post(
  "/recommendations",
  protect,
  upload.single("resume"),
  getJobRecommendations
);

// NEW: Save a job to user's saved list
router.post("/save", protect, async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.userId;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    // TODO: Implement user's saved jobs in a separate model/collection
    // For now, just return success
    console.log(`User ${userId} saved job ${jobId}`);

    res.json({
      success: true,
      message: "Job saved successfully",
      jobId,
      userId,
    });
  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({
      success: false,
      message: "Error saving job",
      error: error.message,
    });
  }
});

// NEW: Get user's saved jobs
router.get("/saved", protect, async (req, res) => {
  try {
    const userId = req.userId;

    // TODO: Implement user's saved jobs functionality
    // For now, return empty array
    console.log(`Fetching saved jobs for user ${userId}`);

    res.json({
      success: true,
      jobs: [],
      count: 0,
      message: "Saved jobs functionality will be implemented",
    });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching saved jobs",
      error: error.message,
    });
  }
});

// NEW: Apply to a job
router.post("/apply", protect, async (req, res) => {
  try {
    const { jobId, coverLetter = "", resumeData = null } = req.body;
    const userId = req.userId;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    // Find the job and increment application count
    const job = await AvailableJob.findOne({ id: jobId, isActive: true });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await job.incrementApplicationCount();

    // TODO: Store application in a separate model/collection
    console.log(`User ${userId} applied to job ${jobId}`);

    res.json({
      success: true,
      message: "Application submitted successfully",
      jobId,
      jobTitle: job.title,
      company: job.company,
      appliedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error applying to job:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting application",
      error: error.message,
    });
  }
});

module.exports = router;
