const express = require('express');
const Job = require('../models/UserJob');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all job entries for a user
router.get('/', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.userId }).sort({ startDate: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific job entry
router.get('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    });
    
    if (!job) {
      return res.status(404).json({ message: 'Job entry not found' });
    }
    
    res.json(job);
  } catch (error) {
    console.error('Get job entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new job entry
router.post('/', auth, async (req, res) => {
  try {
    const { title, company, location, startDate, endDate, workHere, description } = req.body;
    
    const job = new Job({
      user: req.userId,
      title,
      company,
      location,
      startDate,
      endDate,
      workHere,
      description
    });
    
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error('Add job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update job entry
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, company, location, startDate, endDate, workHere, description } = req.body;
    
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { 
        title, 
        company, 
        location,
        startDate,
        endDate,
        workHere,
        description,
        updatedAt: Date.now() 
      },
      { new: true }
    );
    
    if (!job) {
      return res.status(404).json({ message: 'Job entry not found' });
    }
    
    res.json(job);
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete job entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!job) {
      return res.status(404).json({ message: 'Job entry not found' });
    }
    
    res.json({ message: 'Job entry removed' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get job entries for a specific user (by userId)
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.params.userId }).sort({ startDate: -1 });
    
    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: 'No job entries found for this user' });
    }
    
    res.json(jobs);
  } catch (error) {
    console.error('Get user jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
