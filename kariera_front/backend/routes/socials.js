const express = require('express');
const Social = require('../models/Social');
const auth = require('../middleware/auth');
const router = express.Router();

// Get social profiles for current user
router.get('/', auth, async (req, res) => {
  try {
    let social = await Social.findOne({ user: req.userId });
    
    if (!social) {
      // Create empty social profile if none exists
      social = new Social({
        user: req.userId,
        websiteUrl: '',
        linkedinProfile: '',
        behanceProfile: '',
        other: []
      });
      await social.save();
    }
    
    res.json(social);
  } catch (error) {
    console.error('Get social profiles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get social profiles for a specific user (by userId)
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const social = await Social.findOne({ user: req.params.userId });
    
    if (!social) {
      return res.status(404).json({ message: 'No social profiles found for this user' });
    }
    
    res.json(social);
  } catch (error) {
    console.error('Get user social profiles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update social profiles
router.put('/', auth, async (req, res) => {
  try {
    const { websiteUrl, linkedinProfile, behanceProfile, other } = req.body;
    
    const social = await Social.findOneAndUpdate(
      { user: req.userId },
      { 
        websiteUrl, 
        linkedinProfile, 
        behanceProfile, 
        other,
        updatedAt: Date.now() 
      },
      { new: true, upsert: true }
    );
    
    res.json(social);
  } catch (error) {
    console.error('Update social profiles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
