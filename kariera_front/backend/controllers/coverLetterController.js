const { generateCoverLetter } = require('../services/coverLetterService');
const { getUserInfo } = require('../services/userService');

// Generate a cover letter based on job info and user resume
const createCoverLetter = async (req, res) => {
  try {
    const jobInfo = req.body;
    
    if (!jobInfo || !jobInfo.job_title || !jobInfo.company || !jobInfo.location || !jobInfo.description) {
      return res.status(400).json({ message: 'Missing required job information' });
    }
    
    // Get user info from database based on authenticated user
    const userInfo = await getUserInfo(req.userId);
    
    // Generate the cover letter
    const coverLetter = await generateCoverLetter(userInfo, jobInfo);
    
    res.json({ success: true, coverLetter });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    res.status(500).json({ message: 'Error generating cover letter', error: error.message });
  }
};

module.exports = {
  createCoverLetter
};
