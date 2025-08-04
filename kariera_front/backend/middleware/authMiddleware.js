const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - authentication middleware
const protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.headers['x-auth-token']) {
      // Also check for x-auth-token header (used by our frontend)
      token = req.headers['x-auth-token'];
    }
    
    // If no token found, try checking cookies (useful for browser-based authentication)
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    
    // Check if token exists
    if (!token) {
      console.log('No authentication token provided');
      return res.status(401).json({ message: 'No authentication token provided' });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
      
      // Check if user exists in database
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        console.log('User not found for token');
        return res.status(401).json({ message: 'User not found' });
      }
      
      // Add user id to request
      req.userId = decoded.userId;
      req.user = user;  // Optional: Add full user object to req
      
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      
      return res.status(401).json({ message: 'Invalid authentication token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error in authentication' });
  }
};

module.exports = { protect };
