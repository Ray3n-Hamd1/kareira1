const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getUserResume,
  refineResume,
  generatePDFResume,
} = require("../controllers/resumeController");

const router = express.Router();

// Get user's resume data
router.get("/", protect, getUserResume);

// Refine resume for a specific country
router.post("/refine", protect, refineResume);

// Generate PDF resume from refined data
router.post("/generate-pdf", protect, generatePDFResume);
// Add these new routes to your existing resume routes
router.put("/work-history", protect, async (req, res) => {
  // Save work history data
});

router.put("/job-description", protect, async (req, res) => {
  // Save job description data
});

router.put("/additional-education", protect, async (req, res) => {
  // Save additional education data
});

router.put("/certifications", protect, async (req, res) => {
  // Save certifications data
});

router.put("/links", protect, async (req, res) => {
  // Save links data
});

router.put("/background-summary", protect, async (req, res) => {
  // Save background summary data
});

router.put("/software-skills", protect, async (req, res) => {
  // Save software skills data
});

router.put("/interests-hobbies", protect, async (req, res) => {
  // Save interests and hobbies data
});

router.post("/enhance", protect, async (req, res) => {
  // AI enhancement endpoint
});

module.exports = router;
