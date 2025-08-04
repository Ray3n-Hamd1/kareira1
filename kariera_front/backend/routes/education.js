const express = require('express');
const Education = require('../models/Education');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all education entries for current user
router.get('/', auth, async (req, res) => {
  try {
    const education = await Education.find({ user: req.userId });
    res.json(education);
  } catch (error) {
    console.error('Get education error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get education entries for a specific user (by userId)
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const education = await Education.find({ user: req.params.userId });
    
    if (!education || education.length === 0) {
      return res.status(404).json({ message: 'No education entries found for this user' });
    }
    
    res.json(education);
  } catch (error) {
    console.error('Get user education error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific education entry
router.get('/:id', auth, async (req, res) => {
  try {
    const education = await Education.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    });
    
    if (!education) {
      return res.status(404).json({ message: 'Education entry not found' });
    }
    
    res.json(education);
  } catch (error) {
    console.error('Get education entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new education entry
router.post('/', auth, async (req, res) => {
  try {
    const { degree, school, city, location, startDate, endDate, fieldOfStudy, description } = req.body;
    
    const education = new Education({
      user: req.userId,
      degree,
      school,
      city,
      location,
      startDate,
      endDate,
      fieldOfStudy,
      description
    });
    
    await education.save();
    res.status(201).json(education);
  } catch (error) {
    console.error('Add education error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update education entry
router.put('/:id', auth, async (req, res) => {
  try {
    const { degree, school, city, location, startDate, endDate, fieldOfStudy, description } = req.body;
    
    const education = await Education.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { 
        degree, 
        school, 
        city,
        location,
        startDate, 
        endDate, 
        fieldOfStudy,
        description,
        updatedAt: Date.now() 
      },
      { new: true }
    );
    
    if (!education) {
      return res.status(404).json({ message: 'Education entry not found' });
    }
    
    res.json(education);
  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete education entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const education = await Education.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!education) {
      return res.status(404).json({ message: 'Education entry not found' });
    }
    
    res.json({ message: 'Education entry removed' });
  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
