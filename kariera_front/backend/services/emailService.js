// backend/services/emailService.js - QUICK FIX VERSION
const nodemailer = require("nodemailer");
require("dotenv").config();

class EmailService {
  constructor() {
    // Configure nodemailer transporter - FIXED METHOD NAME
    this.transporter = nodemailer.createTransport({
      // Using Gmail as example
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // Test configuration on startup
    this.validateConfiguration().catch((error) => {
      console.warn("⚠️ Email service configuration issue:", error.message);
    });
  }

  // Send 2FA disabled confirmation email
  async send2FADisabledEmail(
    userEmail,
    userName,
    userAgent = "Unknown",
    ipAddress = "Unknown"
  ) {
    try {
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });

      const mailOptions = {
        from: {
          name: "Kariera Security Team",
          address: process.env.EMAIL_USER || "noreply@kariera.com",
        },
        to: userEmail,
        subject: "🔒 Two-Factor Authentication Disabled - Security Alert",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🔒 Security Alert</h1>
            <p style="color: #fecaca; margin: 10px 0 0 0;">Two-Factor Authentication Disabled</p>
          </div>
          
          <div style="padding: 40px 20px;">
            <p>Hi <strong>${userName}</strong>,</p>
            
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h2 style="color: #dc2626; margin: 0 0 10px 0; font-size: 18px;">⚠️ Important Security Notice</h2>
              <p>Two-factor authentication (2FA) has been <strong>disabled</strong> on your Kariera account.</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr><th style="padding: 12px; background: #f9fafb; border-bottom: 1px solid #e5e7eb;">Date & Time</th><td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${currentDate}</td></tr>
              <tr><th style="padding: 12px; background: #f9fafb; border-bottom: 1px solid #e5e7eb;">Browser</th><td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${userAgent}</td></tr>
              <tr><th style="padding: 12px; background: #f9fafb; border-bottom: 1px solid #e5e7eb;">IP Address</th><td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${ipAddress}</td></tr>
            </table>
            
            <p><strong>If you disabled 2FA yourself:</strong> No action required, but consider re-enabling for security.</p>
            
            <div style="background: #f0f9ff; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #0c4a6e; margin: 0 0 15px 0;">If you did NOT disable 2FA:</h3>
              <ol>
                <li>Change your password immediately</li>
                <li>Re-enable two-factor authentication</li>
                <li>Contact support: ${
                  process.env.SUPPORT_EMAIL || "support@kariera.com"
                }</li>
              </ol>
            </div>
            
            <p>Stay secure,<br><strong>Kariera Security Team</strong></p>
          </div>
        </div>`,
        text: `Security Alert: 2FA Disabled\n\nHi ${userName},\n\n2FA has been disabled on your account.\nDate: ${currentDate}\nBrowser: ${userAgent}\nIP: ${ipAddress}\n\nIf this wasn't you, contact support immediately.`,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("✅ 2FA disabled email sent to:", userEmail);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("❌ Error sending 2FA disabled email:", error);
      return { success: false, error: error.message };
    }
  }

  // Send 2FA enabled confirmation email
  async send2FAEnabledEmail(
    userEmail,
    userName,
    userAgent = "Unknown",
    ipAddress = "Unknown"
  ) {
    try {
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });

      const mailOptions = {
        from: {
          name: "Kariera Security Team",
          address: process.env.EMAIL_USER || "noreply@kariera.com",
        },
        to: userEmail,
        subject: "🔐 Two-Factor Authentication Enabled Successfully",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
          <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🔐 Security Enhanced</h1>
            <p style="color: #bbf7d0; margin: 10px 0 0 0;">Two-Factor Authentication Enabled</p>
          </div>
          
          <div style="padding: 40px 20px;">
            <p>Hi <strong>${userName}</strong>,</p>
            
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h2 style="color: #059669; margin: 0 0 10px 0; font-size: 18px;">✅ Great Job!</h2>
              <p>Two-factor authentication has been <strong>successfully enabled</strong> on your Kariera account!</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr><th style="padding: 12px; background: #f9fafb; border-bottom: 1px solid #e5e7eb;">Date & Time</th><td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${currentDate}</td></tr>
              <tr><th style="padding: 12px; background: #f9fafb; border-bottom: 1px solid #e5e7eb;">Browser</th><td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${userAgent}</td></tr>
              <tr><th style="padding: 12px; background: #f9fafb; border-bottom: 1px solid #e5e7eb;">IP Address</th><td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${ipAddress}</td></tr>
            </table>
            
            <div style="background: #fffbeb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #d97706; margin: 0 0 15px 0;">💡 Important Tips:</h3>
              <ul>
                <li>Keep your authenticator app secure</li>
                <li>You'll need your phone for every login</li>
                <li>Don't share screenshots of codes</li>
              </ul>
            </div>
            
            <p>Thank you for securing your account!</p>
            <p>Best regards,<br><strong>Kariera Security Team</strong></p>
          </div>
        </div>`,
        text: `2FA Enabled Successfully\n\nHi ${userName},\n\n2FA has been enabled on your account.\nDate: ${currentDate}\n\nYour account is now more secure!`,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("✅ 2FA enabled email sent to:", userEmail);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("❌ Error sending 2FA enabled email:", error);
      return { success: false, error: error.message };
    }
  }

  // Generic email sending
  async sendEmail({ to, subject, html, text }) {
    try {
      const mailOptions = {
        from: {
          name: "Kariera",
          address: process.env.EMAIL_USER || "noreply@kariera.com",
        },
        to,
        subject,
        html,
        text,
      };

      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  // Test email configuration
  async validateConfiguration() {
    try {
      // Check if environment variables are set
      if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
        throw new Error(
          "EMAIL_USER and EMAIL_APP_PASSWORD environment variables are required"
        );
      }

      // Verify SMTP connection
      await this.transporter.verify();
      console.log("✅ Email service is configured and ready");
      return true;
    } catch (error) {
      console.error("❌ Email configuration error:", error.message);
      return false;
    }
  }
}

// Export singleton instance
module.exports = new EmailService();
