const { parseResume } = require('../services/resumeParserService');
const { findJobRecommendations } = require('../services/jobProcessingService');
const fs = require('fs');
const path = require('path');

// Get job recommendations based on resume
const getJobRecommendations = async (req, res) => {
  try {
    const { country = 'usa', jobTitle = 'internship', numberOfJobs = 4 } = req.body;
    
    // Get the uploaded resume file from the request
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a resume' });
    }
    
    console.log(`Resume file uploaded: ${req.file.path}`);
    
    // Parse the resume
    console.log('Parsing resume...');
    const resumeData = await parseResume(req.file.path);
    console.log('Resume parsed successfully');
    
    // Find job recommendations
    console.log('Finding job recommendations...');
    const jobs = await findJobRecommendations(resumeData, numberOfJobs, country, jobTitle);
    console.log(`Found ${jobs.length} job recommendations`);
    
    // Clean up the uploaded file after processing
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error(`Error deleting file ${req.file.path}:`, err);
      } else {
        console.log(`File ${req.file.path} deleted successfully`);
      }
    });
    
    res.json({ success: true, jobs });
  } catch (error) {
    console.error('Error getting job recommendations:', error);
    
    // Clean up file on error if it exists
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, () => {});
    }
    
    res.status(500).json({ message: 'Error processing resume', error: error.message });
  }
};

module.exports = {
  getJobRecommendations
};
