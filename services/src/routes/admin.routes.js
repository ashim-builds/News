import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import Admin from "../models/Admin.js";
import { requireAdminAuth } from "../middlewares/auth.middleware.js";

const JWT_SECRET = process.env.JWT_SECRET || env.JWT_SECRET || "7313cc8651a398378f869faed4cb896c80e04ba4e4e6065e2c697385ab0d6fbc";

const router = express.Router();

// Direct Admin Login
const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    let admin = await Admin.findOne({ email: email.toLowerCase() });

    // Seed default admin if non-existent
    if (!admin && email.toLowerCase() === "admin@smartsanchar.com") {
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "Smartsanchar@001!";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      admin = await Admin.create({
        email: email.toLowerCase(),
        password: hashedPassword,
      });
    }

    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT token (7 days validity)
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: "admin" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set secure HttpOnly cookie for browser and Next.js middleware (JWT inaccessible to client JS)
    res.cookie("smart_admin_token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    // Set non-sensitive UI indicator cookie (contains NO tokens or credentials)
    res.cookie("smart_admin_logged_in", "1", {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("[ADMIN LOGIN ERROR]:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

router.post("/login", loginHandler);
router.post("/send-otp", loginHandler);
router.post("/verify-otp", (req, res) => res.json({ success: true, message: "OTP step obsolete" }));

// Verify Admin Session Token
router.get("/verify", requireAdminAuth, (req, res) => {
  res.json({
    success: true,
    valid: true,
    admin: {
      email: req.admin.email,
      role: req.admin.role || "admin",
    },
  });
});

// Admin Logout
router.post("/logout", (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("smart_admin_token", { path: "/", httpOnly: true, secure: isProduction, sameSite: "lax" });
  res.clearCookie("smart_admin_logged_in", { path: "/", httpOnly: false, secure: isProduction, sameSite: "lax" });
  res.json({ success: true, message: "Logged out successfully" });
});

// Change Password (from Dashboard settings) - Protected with requireAdminAuth
router.post("/change-password", requireAdminAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const email = req.admin?.email || req.body.email;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin account not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
