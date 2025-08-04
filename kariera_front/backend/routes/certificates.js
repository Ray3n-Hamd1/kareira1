const express = require('express');
const Certificate = require('../models/Certificate');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all certificates for current user
router.get('/', auth, async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.userId });
    res.json(certificates);
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get certificates for a specific user (by userId)
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.params.userId });
    
    if (!certificates || certificates.length === 0) {
      return res.status(404).json({ message: 'No certificates found for this user' });
    }
    
    res.json(certificates);
  } catch (error) {
    console.error('Get user certificates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific certificate
router.get('/:id', auth, async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    });
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    res.json(certificate);
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new certificate
router.post('/', auth, async (req, res) => {
  try {
    const { certificate, certificateUrl } = req.body;
    
    const newCertificate = new Certificate({
      user: req.userId,
      certificate,
      certificateUrl
    });
    
    await newCertificate.save();
    res.status(201).json(newCertificate);
  } catch (error) {
    console.error('Add certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update certificate
router.put('/:id', auth, async (req, res) => {
  try {
    const { certificate, certificateUrl } = req.body;
    
    const updatedCertificate = await Certificate.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { 
        certificate, 
        certificateUrl,
        updatedAt: Date.now() 
      },
      { new: true }
    );
    
    if (!updatedCertificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    res.json(updatedCertificate);
  } catch (error) {
    console.error('Update certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete certificate
router.delete('/:id', auth, async (req, res) => {
  try {
    const certificate = await Certificate.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    res.json({ message: 'Certificate removed' });
  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
