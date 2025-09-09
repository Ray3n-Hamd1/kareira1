// backend/services/jobScraperService.js - Updated to use AvailableJob model
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { createObjectCsvWriter } = require("csv-writer");
const axios = require("axios");
const cheerio = require("cheerio");
const AvailableJob = require("../models/AvailableJob"); // Updated import
const { embedAndStoreJobs } = require("./vectorService");

// Enhanced job scraping function
async function scrapeJobs() {
  try {
    console.log("Starting job scraping process...");

    // Generate sample jobs (in production, replace with real scraping)
    const jobs = generateSampleJobs(50); // Increased to 50 jobs

    console.log(`Generated ${jobs.length} sample jobs`);

    // Convert jobs to the right format for database
    const formattedJobs = jobs
      .map((job) => ({
        id: job.id || `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: job.title || "",
        company: job.company || "",
        location: job.location || "",
        description: job.description || "",
        jobUrl: job.job_url || job.jobUrl || "",
        isRemote: job.is_remote || job.isRemote || false,
        jobType: job.jobType || "Full-time",
        experienceLevel: job.experienceLevel || "Entry Level",
        skills: job.skills || [],
        postedAt: new Date(),
        source: "scraped",
        isActive: true,
      }))
      .filter(
        (job) => job.description && job.jobUrl && job.title && job.company
      );

    console.log(`Filtered to ${formattedJobs.length} valid jobs`);

    // Save to CSV (for backup)
    const csvFilePath = path.join(__dirname, "../csv_Files/jobs.csv");
    await saveJobsToCSV(formattedJobs, csvFilePath);

    // Store in MongoDB
    await storeJobsInDatabase(formattedJobs);

    return formattedJobs;
  } catch (error) {
    console.error("Error scraping jobs:", error);
    return [];
  }
}

// Enhanced sample job generation with more realistic data
function generateSampleJobs(count) {
  const jobTitles = [
    "Software Engineer Intern",
    "Data Scientist Intern",
    "UX/UI Designer Intern",
    "Product Manager Intern",
    "Marketing Specialist Intern",
    "Frontend Developer Intern",
    "Backend Developer Intern",
    "Full Stack Developer Intern",
    "DevOps Engineer Intern",
    "Mobile App Developer Intern",
    "QA Engineer Intern",
    "Business Analyst Intern",
    "Cybersecurity Analyst Intern",
    "AI/ML Engineer Intern",
    "Game Developer Intern",
    "Web Developer Intern",
    "Cloud Engineer Intern",
    "Database Administrator Intern",
    "Network Engineer Intern",
    "Sales Development Representative Intern",
  ];

  const companies = [
    "TechCorp",
    "InnovateLabs",
    "DataMasters",
    "DesignThink",
    "ProductInc",
    "MarketGenius",
    "CodeCrafters",
    "CloudNine",
    "SecureNet",
    "GameStudio",
    "WebWizards",
    "AppFactory",
    "StartupHub",
    "Enterprise Solutions",
    "Digital Dynamics",
    "Future Systems",
    "Smart Analytics",
    "Creative Agency",
    "Tech Innovators",
    "Modern Solutions",
  ];

  const locations = [
    "New York, NY, USA",
    "San Francisco, CA, USA",
    "London, UK",
    "Paris, France",
    "Berlin, Germany",
    "Tokyo, Japan",
    "Toronto, Canada",
    "Sydney, Australia",
    "Amsterdam, Netherlands",
    "Stockholm, Sweden",
    "Dublin, Ireland",
    "Barcelona, Spain",
    "Austin, TX, USA",
    "Seattle, WA, USA",
    "Boston, MA, USA",
    "Chicago, IL, USA",
    "Los Angeles, CA, USA",
    "Miami, FL, USA",
    "Denver, CO, USA",
    "Atlanta, GA, USA",
  ];

  const skillSets = [
    ["JavaScript", "React", "Node.js", "MongoDB"],
    ["Python", "Django", "PostgreSQL", "Docker"],
    ["Java", "Spring Boot", "MySQL", "Redis"],
    ["TypeScript", "Vue.js", "Express", "GraphQL"],
    ["PHP", "Laravel", "MariaDB", "Nginx"],
    ["C#", ".NET", "SQL Server", "Azure"],
    ["Ruby", "Rails", "PostgreSQL", "Heroku"],
    ["Go", "Kubernetes", "Microservices", "AWS"],
    ["Figma", "Sketch", "Adobe XD", "Prototyping"],
    ["Python", "TensorFlow", "PyTorch", "Pandas"],
  ];

  const jobDescriptions = [
    "Join our dynamic team and work on cutting-edge projects that will shape the future of technology. You will collaborate with experienced professionals and gain hands-on experience with modern development practices.",
    "We are looking for a passionate intern to contribute to our innovative products. This role offers excellent learning opportunities and the chance to work with the latest technologies.",
    "Exciting opportunity to work in a fast-paced environment where you will be involved in the entire product development lifecycle. Perfect for someone looking to kickstart their career.",
    "Be part of our mission to revolutionize the industry through technology. This internship provides exposure to real-world projects and mentorship from senior team members.",
    "We offer a collaborative environment where interns can make meaningful contributions while learning from experts in the field. Great stepping stone for your career.",
    "Join our team and work on projects that impact millions of users worldwide. This role combines learning with practical application of your skills.",
    "Opportunity to work with a talented team on innovative solutions. We provide comprehensive training and support to help you succeed in your role.",
    "Perfect role for someone passionate about technology and eager to learn. You will work on challenging projects and develop skills that will benefit your career.",
    "We are seeking a motivated intern to join our growing team. This position offers excellent growth opportunities and exposure to industry best practices.",
    "Exciting internship opportunity in a company that values innovation and creativity. You will work on meaningful projects and receive mentorship from experienced professionals.",
  ];

  const jobs = [];

  for (let i = 0; i < count; i++) {
    const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const isRemote = Math.random() > 0.6; // 40% chance of being remote
    const skills = skillSets[Math.floor(Math.random() * skillSets.length)];
    const description =
      jobDescriptions[Math.floor(Math.random() * jobDescriptions.length)];

    jobs.push({
      id: `job-${Date.now()}-${i}`,
      title: title,
      company: company,
      location: location,
      is_remote: isRemote,
      job_url: `https://example.com/jobs/${company
        .toLowerCase()
        .replace(/\s+/g, "-")}/${title
        .toLowerCase()
        .replace(/\s+/g, "-")}-${i}`,
      description: description,
      skills: skills,
      jobType: Math.random() > 0.7 ? "Internship" : "Full-time",
      experienceLevel: Math.random() > 0.8 ? "Junior" : "Entry Level",
      salaryMin: Math.floor(Math.random() * 30000) + 40000,
      salaryMax: Math.floor(Math.random() * 40000) + 70000,
      industry: [
        "Technology",
        "Finance",
        "Healthcare",
        "Education",
        "E-commerce",
      ][Math.floor(Math.random() * 5)],
      companySize: ["Startup", "Small", "Medium", "Large"][
        Math.floor(Math.random() * 4)
      ],
    });
  }

  return jobs;
}

// Save jobs to CSV (backup)
async function saveJobsToCSV(jobs, csvFilePath) {
  try {
    // Ensure directory exists
    const dir = path.dirname(csvFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let existingJobs = [];
    let updatedJobs = [];

    // Check if CSV file exists and read existing jobs
    if (fs.existsSync(csvFilePath)) {
      existingJobs = await new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(csvFilePath)
          .pipe(csv())
          .on("data", (data) => results.push(data))
          .on("end", () => resolve(results))
          .on("error", (err) => reject(err));
      });

      // Find new jobs that are not duplicates
      const existingIds = existingJobs.map((job) => job.id);
      const newJobs = jobs.filter((job) => !existingIds.includes(job.id));
      console.log(`Found ${newJobs.length} new jobs to add to CSV`);

      updatedJobs = [...existingJobs, ...newJobs];
    } else {
      updatedJobs = jobs;
    }

    // Define CSV headers
    const csvWriter = createObjectCsvWriter({
      path: csvFilePath,
      header: [
        { id: "id", title: "id" },
        { id: "title", title: "title" },
        { id: "company", title: "company" },
        { id: "location", title: "location" },
        { id: "jobUrl", title: "job_url" },
        { id: "isRemote", title: "is_remote" },
        { id: "description", title: "description" },
        { id: "jobType", title: "job_type" },
        { id: "experienceLevel", title: "experience_level" },
      ],
    });

    // Write updated jobs to CSV
    await csvWriter.writeRecords(updatedJobs);
    console.log(`Successfully saved ${updatedJobs.length} jobs to CSV`);

    return updatedJobs;
  } catch (error) {
    console.error("Error saving jobs to CSV:", error);
    throw error;
  }
}

// Store jobs in MongoDB using AvailableJob model
async function storeJobsInDatabase(jobs) {
  try {
    console.log(`Storing ${jobs.length} jobs in MongoDB...`);

    let newJobsCount = 0;
    let updatedJobsCount = 0;

    // Store each job in MongoDB
    for (const jobData of jobs) {
      try {
        const existingJob = await AvailableJob.findOne({ id: jobData.id });

        if (existingJob) {
          // Update existing job
          await AvailableJob.updateOne(
            { id: jobData.id },
            {
              ...jobData,
              updatedAt: new Date(),
              // Preserve application and view counts
              applicationCount: existingJob.applicationCount || 0,
              viewCount: existingJob.viewCount || 0,
            }
          );
          updatedJobsCount++;
        } else {
          // Create new job
          const newJob = new AvailableJob(jobData);
          await newJob.save();
          newJobsCount++;
        }
      } catch (jobError) {
        console.error(`Error saving individual job ${jobData.id}:`, jobError);
      }
    }

    console.log(
      `Jobs saved to MongoDB: ${newJobsCount} new, ${updatedJobsCount} updated`
    );

    // Optional: Embed and store in vector database for AI matching
    try {
      if (typeof embedAndStoreJobs === "function") {
        await embedAndStoreJobs(jobs);
        console.log("Jobs embedded in vector database");
      }
    } catch (embedError) {
      console.error("Error embedding jobs in vector database:", embedError);
    }

    console.log("Job storage in database complete");
    return { newJobs: newJobsCount, updatedJobs: updatedJobsCount };
  } catch (error) {
    console.error("Error storing jobs in database:", error);
    throw error;
  }
}

// Get jobs from database (helper function)
async function getJobsFromDatabase(filters = {}) {
  try {
    const query = { isActive: true, isExpired: false, ...filters };
    const jobs = await AvailableJob.find(query).sort({ postedAt: -1 });
    return jobs;
  } catch (error) {
    console.error("Error getting jobs from database:", error);
    throw error;
  }
}

// Clean up old expired jobs
async function cleanupExpiredJobs() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await AvailableJob.updateMany(
      { postedAt: { $lt: thirtyDaysAgo } },
      { isExpired: true, isActive: false }
    );
    console.log(`Marked ${result.modifiedCount} old jobs as expired`);
    return result;
  } catch (error) {
    console.error("Error cleaning up expired jobs:", error);
    throw error;
  }
}

module.exports = {
  scrapeJobs,
  getJobsFromDatabase,
  cleanupExpiredJobs,
  storeJobsInDatabase,
};
