const express = require('express');
const { registerUser, loginUser, getUserProfile, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/me', protect, getUserProfile);

// Debug route (remove in production)
if (process.env.NODE_ENV !== 'production') {
  router.post('/debug-hash', async (req, res) => {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ message: 'Please provide a password' });
      }
      
      // Generate hash using the same method as the User model
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      
      // Test verification
      const isMatch = await bcrypt.compare(password, hash);
      
      res.json({
        success: true,
        originalPassword: password,
        hash,
        verified: isMatch,
        hashLength: hash.length
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Hash generation error', 
        error: error.message 
      });
    }
  });

  // Admin password reset route (remove or secure in production)
  router.post('/reset-password', resetPassword);
}

module.exports = router;
