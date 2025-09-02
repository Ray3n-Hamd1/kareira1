const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");
const cron = require("node-cron");
const { connectToDatabase } = require("./config/database");
const jobRoutes = require("./routes/jobRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const coverLetterRoutes = require("./routes/coverLetterRoutes");
const authRoutes = require("./routes/authRoutes");
const { scrapeJobs } = require("./services/jobScraperService");
const userRoutes = require("./routes/users");
const twoFactorRoutes = require("./routes/twoFactorRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Create CSV directory if it doesn't exist
const csvDir = path.join(__dirname, "csv_Files");
if (!fs.existsSync(csvDir)) {
  fs.mkdirSync(csvDir, { recursive: true });
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/cover-letter", coverLetterRoutes);
app.use("/api/users", userRoutes);
app.use("/api/2fa", twoFactorRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Schedule job scraping task (runs at 16:01 every day)
cron.schedule("1 16 * * *", async () => {
  console.log("Running job scraper...");
  await scrapeJobs();
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectToDatabase();
});
