const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register a new user
const registerUser = async (req, res) => {
  try {
    console.log("Registration attempt with data:", {
      name: req.body.name,
      email: req.body.email,
      // Don't log passwords
    });

    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      console.log("Registration failed: Missing required fields");
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("Registration failed: User already exists with email", email);
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password, // The password will be hashed in the User model's pre-save hook
    });

    // Save user to database
    await user.save();
    console.log("User created successfully with id:", user._id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "30d" }
    );

    // Return user data and token
    console.log("Registration successful, returning token and user data");
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// Login a user
const loginUser = async (req, res) => {
  try {
    console.log("Login attempt for email:", req.body.email);

    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log("Login failed: Missing email or password");
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Login failed: User not found with email", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // For debugging - check stored hashed password
    console.log(
      `Found user with ID: ${user._id}, hash: ${user.password.substring(
        0,
        10
      )}...`
    );

    // Check if password matches using the User model method
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log("Login failed: Incorrect password for email", email);

      // Return the same error message as user not found for security
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "30d" }
    );

    // Return user data and token
    console.log("Login successful for user", user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Server error during login", error: error.message });
  }
};

// Get current user profile
const getUserProfile = async (req, res) => {
  try {
    console.log("Getting profile for user ID:", req.userId);

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      console.log(
        "Profile retrieval failed: User not found with ID",
        req.userId
      );
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Profile retrieved successfully for user", req.userId);
    // Return the entire user object instead of just id, name, email
    res.json({
      user: user,
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reset user password (admin only - temporary fix)
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, adminKey } = req.body;

    // Verify admin key for security (replace with proper admin authentication in production)
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save user with new password
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "Server error during password reset" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  resetPassword, // Add this to the exports
};
