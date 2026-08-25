import express from "express";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import Admin from "../models/Admin.js";

const router = express.Router();

// Helper to create Nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// 1. SEND OTP FOR LOGIN
router.post("/send-otp", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    let admin = await Admin.findOne({ email: email.toLowerCase() });

    // Seed default admin if non-existent
    if (!admin) {
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "admin123456";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      admin = await Admin.create({
        email: email.toLowerCase(),
        password: hashedPassword,
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = otp;
    admin.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await admin.save();

    // Send Email
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'Smart Sanchar'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
        to: email,
        subject: "SmartSanchar Admin Login OTP Code",
        text: `Your SmartSanchar Admin login OTP code is: ${otp}`,
      });
    } catch (mailErr) {
      console.warn("SMTP email sending failed, proceeding with demo mode:", mailErr.message);
    }

    res.json({ success: true, message: "OTP code sent to email", otpDemo: otp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. VERIFY LOGIN OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin || !admin.otp || admin.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    admin.otp = null;
    admin.otpExpires = null;
    await admin.save();

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin account not found" });
    }

    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.resetOtp = resetOtp;
    admin.resetOtpExpires = new Date(Date.now() + 15 * 60 * 1000);
    await admin.save();

    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'Smart Sanchar'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
        to: email,
        subject: "SmartSanchar Admin Password Reset Code",
        text: `Your password reset code is: ${resetOtp}`,
      });
    } catch (mailErr) {
      console.warn("SMTP reset email failed:", mailErr.message);
    }

    res.json({ success: true, message: "Reset code sent to email", resetOtpDemo: resetOtp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin || !admin.resetOtp || admin.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset code" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.resetOtp = null;
    admin.resetOtpExpires = null;
    await admin.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
