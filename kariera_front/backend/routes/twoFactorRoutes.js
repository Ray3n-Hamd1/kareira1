// backend/routes/twoFactorRoutes.js
const express = require("express");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// Generate 2FA secret and QR code
router.post("/setup", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `Kariera (${user.email})`,
      issuer: "Kariera",
    });

    // Save temp secret to user (don't enable 2FA yet)
    user.twoFactorTempSecret = secret.base32;
    await user.save();

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      success: true,
      secret: secret.base32,
      qrCode: qrCodeDataUrl,
      manualEntryKey: secret.base32,
    });
  } catch (error) {
    console.error("Error setting up 2FA:", error);
    res.status(500).json({ message: "Error setting up 2FA" });
  }
});

// Verify and enable 2FA
router.post("/verify", protect, async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.userId);

    if (!user || !user.twoFactorTempSecret) {
      return res.status(400).json({ message: "No 2FA setup in progress" });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorTempSecret,
      encoding: "base32",
      token: token,
      window: 2,
    });

    if (!verified) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Enable 2FA
    user.twoFactorSecret = user.twoFactorTempSecret;
    user.twoFactorEnabled = true;
    user.twoFactorTempSecret = undefined;
    await user.save();

    res.json({ success: true, message: "2FA enabled successfully" });
  } catch (error) {
    console.error("Error verifying 2FA:", error);
    res.status(500).json({ message: "Error verifying 2FA" });
  }
});

// Disable 2FA
router.post("/disable", protect, async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password before disabling 2FA
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Disable 2FA
    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    user.twoFactorTempSecret = undefined;
    await user.save();

    res.json({ success: true, message: "2FA disabled successfully" });
  } catch (error) {
    console.error("Error disabling 2FA:", error);
    res.status(500).json({ message: "Error disabling 2FA" });
  }
});

// Get 2FA status
router.get("/status", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      twoFactorEnabled: user.twoFactorEnabled || false,
    });
  } catch (error) {
    console.error("Error getting 2FA status:", error);
    res.status(500).json({ message: "Error getting 2FA status" });
  }
});

module.exports = router;
