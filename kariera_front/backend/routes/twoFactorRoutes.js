// backend/routes/twoFactorRoutes.js - UPDATED WITH EMAIL NOTIFICATIONS
const express = require("express");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const emailService = require("../services/emailService");

const router = express.Router();

// Helper function to get user agent and IP
const getUserInfo = (req) => {
  const userAgent = req.get("User-Agent") || "Unknown Browser";
  const ipAddress =
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    "Unknown";
  return { userAgent, ipAddress };
};

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

    console.log(`2FA setup initiated for user: ${user.email}`);

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

    console.log(`2FA enabled for user: ${user.email}`);

    // Send confirmation email
    try {
      const { userAgent, ipAddress } = getUserInfo(req);
      await emailService.send2FAEnabledEmail(
        user.email,
        user.name,
        userAgent,
        ipAddress
      );
      console.log(`2FA enabled confirmation email sent to: ${user.email}`);
    } catch (emailError) {
      console.error("Failed to send 2FA enabled email:", emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: "2FA enabled successfully. A confirmation email has been sent.",
    });
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

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ message: "2FA is not enabled" });
    }

    // Verify password before disabling 2FA
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(
        `Failed 2FA disable attempt for ${user.email}: incorrect password`
      );
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Disable 2FA
    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    user.twoFactorTempSecret = undefined;
    await user.save();

    console.log(`2FA disabled for user: ${user.email}`);

    // Send security alert email
    try {
      const { userAgent, ipAddress } = getUserInfo(req);
      await emailService.send2FADisabledEmail(
        user.email,
        user.name,
        userAgent,
        ipAddress
      );
      console.log(`2FA disabled security alert sent to: ${user.email}`);
    } catch (emailError) {
      console.error("Failed to send 2FA disabled email:", emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message:
        "2FA disabled successfully. A security alert has been sent to your email.",
    });
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
      hasSecret: !!user.twoFactorSecret,
      hasTempSecret: !!user.twoFactorTempSecret,
    });
  } catch (error) {
    console.error("Error getting 2FA status:", error);
    res.status(500).json({ message: "Error getting 2FA status" });
  }
});

// Verify 2FA token (for login process)
router.post("/verify-login", protect, async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.userId);

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return res
        .status(400)
        .json({ message: "2FA is not enabled for this user" });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: token,
      window: 2,
    });

    if (!verified) {
      console.log(`Failed 2FA verification attempt for ${user.email}`);
      return res.status(400).json({ message: "Invalid verification code" });
    }

    console.log(`Successful 2FA verification for ${user.email}`);
    res.json({
      success: true,
      message: "Token verified successfully",
    });
  } catch (error) {
    console.error("Error verifying 2FA token:", error);
    res.status(500).json({ message: "Error verifying 2FA token" });
  }
});

// Generate backup codes (optional feature)
router.post("/backup-codes", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.twoFactorEnabled) {
      return res
        .status(400)
        .json({ message: "2FA must be enabled to generate backup codes" });
    }

    // Generate 10 backup codes
    const backupCodes = Array.from({ length: 10 }, () => {
      return Math.random().toString(36).substring(2, 10).toUpperCase();
    });

    // In a real implementation, you'd hash and store these codes
    // user.twoFactorBackupCodes = backupCodes.map(code => bcrypt.hash(code, 10));
    // await user.save();

    console.log(`Backup codes generated for user: ${user.email}`);

    res.json({
      success: true,
      backupCodes,
      message:
        "Backup codes generated. Store these securely - they will only be shown once.",
    });
  } catch (error) {
    console.error("Error generating backup codes:", error);
    res.status(500).json({ message: "Error generating backup codes" });
  }
});

module.exports = router;
