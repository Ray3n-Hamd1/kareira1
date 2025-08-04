const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getUserResume, refineResume, generatePDFResume } = require('../controllers/resumeController');

const router = express.Router();

// Get user's resume data
router.get('/', protect, getUserResume);

// Refine resume for a specific country
router.post('/refine', protect, refineResume);

// Generate PDF resume from refined data
router.post('/generate-pdf', protect, generatePDFResume);

module.exports = router;
