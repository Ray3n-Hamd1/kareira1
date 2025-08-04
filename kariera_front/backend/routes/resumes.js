const express = require('express');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user's resume
router.get('/', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.userId });
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    res.json(resume);
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get resume for a specific user (by userId)
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.params.userId });
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found for this user' });
    }
    
    res.json(resume);
  } catch (error) {
    console.error('Get user resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update resume
router.post('/', auth, async (req, res) => {
  try {
    const { firstName, lastName, profession, languages, district, city, postalCode, phone, image } = req.body;
    
    // Check if user already has a resume
    let resume = await Resume.findOne({ user: req.userId });
    
    if (resume) {
      // Update existing resume
      resume.firstName = firstName || resume.firstName;
      resume.lastName = lastName || resume.lastName;
      resume.profession = profession || resume.profession;
      resume.languages = languages || resume.languages;
      resume.district = district || resume.district;
      resume.city = city || resume.city;
      resume.postalCode = postalCode || resume.postalCode;
      resume.phone = phone || resume.phone;
      resume.image = image || resume.image;
      resume.updatedAt = Date.now();
    } else {
      // Create new resume
      resume = new Resume({
        user: req.userId,
        firstName,
        lastName,
        profession,
        languages,
        district,
        city,
        postalCode,
        phone,
        image
      });
    }
    
    await resume.save();
    res.json(resume);
  } catch (error) {
    console.error('Create/update resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update resume
router.put('/', auth, async (req, res) => {
  try {
    const { firstName, lastName, profession, languages, district, city, postalCode, phone, image } = req.body;
    
    // Find and update resume
    const resume = await Resume.findOneAndUpdate(
      { user: req.userId },
      { 
        $set: { 
          firstName, 
          lastName, 
          profession, 
          languages, 
          district, 
          city, 
          postalCode, 
          phone, 
          image,
          updatedAt: Date.now() 
        }
      },
      { new: true, upsert: true }
    );
    
    res.json(resume);
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
