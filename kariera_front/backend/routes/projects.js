const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all projects for current user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.userId });
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get projects for a specific user (by userId)
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.params.userId });
    
    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: 'No projects found for this user' });
    }
    
    res.json(projects);
  } catch (error) {
    console.error('Get user projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new project
router.post('/', auth, async (req, res) => {
  try {
    const { projectTitle, projectLink, description } = req.body;
    
    const project = new Project({
      user: req.userId,
      projectTitle,
      projectLink,
      description
    });
    
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Add project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const { projectTitle, projectLink, description } = req.body;
    
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { 
        projectTitle, 
        projectLink, 
        description,
        updatedAt: Date.now() 
      },
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json({ message: 'Project removed' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
