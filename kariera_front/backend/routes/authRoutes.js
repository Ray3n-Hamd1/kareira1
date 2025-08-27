const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", protect, getUserProfile);

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
const updateUserProfile = async (profileData) => {
  try {
    console.log("Sending profile update request:", profileData);

    const response = await axios.put(`${API_URL}/users/profile`, profileData, {
      headers: {
        "x-auth-token": token,
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Profile update response:", response.data);

    if (response.data && response.data.user) {
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } else {
      console.error("Unexpected response format:", response.data);
      return { success: false, error: "Invalid response from server" };
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    // More detailed error logging
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
      return {
        success: false,
        error: error.response.data.message || "Server error",
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      return { success: false, error: "No response from server" };
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request error:", error.message);
      return { success: false, error: "Request failed" };
    }
  }
};

module.exports = router;
