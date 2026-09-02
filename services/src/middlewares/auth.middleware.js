import jwt from "jsonwebtoken";
import env from "../config/env.js";

const JWT_SECRET = process.env.JWT_SECRET || env.JWT_SECRET || "7313cc8651a398378f869faed4cb896c80e04ba4e4e6065e2c697385ab0d6fbc";

/**
 * Middleware to require valid Admin JWT authentication.
 * Checks Bearer Authorization header and smart_admin_token cookie.
 */
export const requireAdminAuth = (req, res, next) => {
  try {
    let token = null;

    // 1. Check Authorization Bearer header
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1].trim();
    }

    // 2. Check HTTP cookie if not in header
    if (!token && req.cookies && req.cookies.smart_admin_token) {
      token = req.cookies.smart_admin_token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "प्रशासक प्रमाणीकरण आवश्यक छ (Admin authentication required). Please log in.",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.email) {
      return res.status(401).json({
        success: false,
        message: "प्रशासक टोकन अमान्य छ (Invalid admin session token).",
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error("[AUTH MIDDLEWARE ERROR]:", error.message);
    return res.status(401).json({
      success: false,
      message: "सत्र समाप्त भएको छ वा अमान्य छ (Session expired or invalid). Please log in again.",
      error: error.message,
    });
  }
};
