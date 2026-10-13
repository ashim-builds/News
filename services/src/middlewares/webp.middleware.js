import fs from "fs";
import path from "path";

/**
 * Smart WebP Auto-Negotiation Middleware
 * Intercepts requests for .jpg / .png images and serves existing .webp equivalent
 */
export const webpNegotiation = (staticDir) => {
  return (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return next();
    }

    const ext = path.extname(req.path).toLowerCase();
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      return next();
    }

    // Check if browser accepts WebP
    const acceptsWebp = req.headers.accept && req.headers.accept.includes("image/webp");
    if (!acceptsWebp) {
      return next();
    }

    const webpPath = path.join(staticDir, req.path.replace(/\.(jpg|jpeg|png)$/i, ".webp"));

    fs.access(webpPath, fs.constants.R_OK, (err) => {
      if (!err) {
        res.setHeader("Content-Type", "image/webp");
        res.setHeader("Cache-Control", "public, max-age=2592000, stale-while-revalidate=86400");
        res.setHeader("Vary", "Accept");
        return res.sendFile(webpPath);
      }
      next();
    });
  };
};

export default webpNegotiation;
