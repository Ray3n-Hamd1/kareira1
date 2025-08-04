const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createCoverLetter } = require('../controllers/coverLetterController');

const router = express.Router();

// Generate a cover letter
router.post('/generate', protect, createCoverLetter);

module.exports = router;
