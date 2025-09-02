// backend/routes/notificationRoutes.js - FIXED VERSION
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// Get notification settings
router.get("/settings", protect, async (req, res) => {
  try {
    console.log("Getting notification settings for user:", req.userId);

    const user = await User.findById(req.userId).select(
      "emailNotifications pushNotifications"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Current user notifications:", {
      email: user.emailNotifications,
      push: user.pushNotifications,
    });

    // Ensure we return the full structure with defaults
    const emailNotifications = {
      newJobs: true,
      newsUpdates: true,
      interviewSchedule: true,
      jobRejection: true,
      marketing: false,
      weeklyDigest: true,
      ...user.emailNotifications,
    };

    const pushNotifications = {
      newJobs: true,
      newsUpdates: true,
      interviewSchedule: true,
      jobRejection: true,
      marketing: false,
      weeklyDigest: false,
      ...user.pushNotifications,
    };

    res.json({
      success: true,
      emailNotifications,
      pushNotifications,
    });
  } catch (error) {
    console.error("Error getting notification settings:", error);
    res
      .status(500)
      .json({
        message: "Error getting notification settings",
        error: error.message,
      });
  }
});

// Update notification settings
router.put("/settings", protect, async (req, res) => {
  try {
    console.log("Updating notification settings for user:", req.userId);
    console.log("Received settings:", req.body);

    const { emailNotifications, pushNotifications } = req.body;

    if (!emailNotifications || !pushNotifications) {
      return res.status(400).json({
        message: "Both emailNotifications and pushNotifications are required",
      });
    }

    // Update user with new notification settings
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          emailNotifications: emailNotifications,
          pushNotifications: pushNotifications,
        },
      },
      {
        new: true,
        runValidators: true,
        // This ensures we get the updated document
        returnDocument: "after",
      }
    ).select("emailNotifications pushNotifications");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Updated user notifications:", {
      email: updatedUser.emailNotifications,
      push: updatedUser.pushNotifications,
    });

    res.json({
      success: true,
      message: "Notification settings updated successfully",
      emailNotifications: updatedUser.emailNotifications,
      pushNotifications: updatedUser.pushNotifications,
    });
  } catch (error) {
    console.error("Error updating notification settings:", error);
    res.status(500).json({
      message: "Error updating notification settings",
      error: error.message,
    });
  }
});

module.exports = router;
