const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Add this import

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", protect, getUserProfile);

// ADD THIS NEW ROUTE - Change Password (CORRECTED VERSION)
router.put("/change-password", protect, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    console.log("Password change request received for user:", req.userId);

    // Validation
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Please provide both old and new passwords",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long",
      });
    }

    // Get user from database (with password field included)
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Found user:", user.email);

    // Verify old password using the correct method name
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      console.log(
        "Password change failed: Invalid old password for user",
        req.userId
      );
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    console.log("Old password verified successfully");

    // Update password directly (let the User model pre-save hook handle hashing)
    user.password = newPassword;
    await user.save();

    console.log("Password changed successfully for user:", req.userId);

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      message: "Server error while changing password",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Debug route (remove in production)
if (process.env.NODE_ENV !== "production") {
  router.post("/debug-hash", async (req, res) => {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ message: "Please provide a password" });
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
        hashLength: hash.length,
      });
    } catch (error) {
      res.status(500).json({
        message: "Hash generation error",
        error: error.message,
      });
    }
  });

  // Admin password reset route (remove or secure in production)
  router.post("/reset-password", resetPassword);
}

module.exports = router;
