const express = require('express');
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all skills for a user
router.get('/', auth, async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.userId });
    res.json(skills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new skill
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    
    // Check if skill already exists for this user
    const existingSkill = await Skill.findOne({ 
      user: req.userId,
      name: name 
    });
    
    if (existingSkill) {
      return res.status(400).json({ message: 'Skill already exists' });
    }
    
    const skill = new Skill({
      user: req.userId,
      name
    });
    
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update skill
router.put('/:id', auth, async (req, res) => {
  try {
    const { name } = req.body;
    
    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { name, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    res.json(skill);
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete skill
router.delete('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    res.json({ message: 'Skill removed' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
