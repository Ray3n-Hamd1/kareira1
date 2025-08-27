const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile - KEEP ONLY THIS ONE
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, email, phone, profession, district, city, postalCode } =
      req.body;

    // Check if email already exists for another user
    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.userId },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Find and update user
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          name,
          email,
          phone,
          profession,
          district,
          city,
          postalCode,
        },
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Make response format consistent with GET route
    res.json(user); // Changed from res.json({ user }) to res.json(user)
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update notification settings
router.put("/notifications", auth, async (req, res) => {
  try {
    const { emailNotifications, pushNotifications } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          emailNotifications,
          pushNotifications,
        },
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Update notification settings error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
