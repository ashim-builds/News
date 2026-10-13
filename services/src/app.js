import "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import compression from "compression";
import connectDB from "./config/db.js";


import { errorHandler } from "./middlewares/error.middleware.js";


import articlesRouter from "./routes/articles.routes.js";
import adsRouter from "./routes/ads.routes.js";
import partnersRouter from "./routes/partners.routes.js";
import adminRouter from "./routes/admin.routes.js";
import uploadRouter from "./routes/upload.routes.js";
import youtubeRouter from "./routes/youtube.routes.js";
import healthRouter from "./routes/health.routes.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://www.smartsanchar.com",
  "https://smartsanchar.com"
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin || 
        allowedOrigins.includes(origin) || 
        origin.endsWith(".vercel.app") || 
        origin.endsWith("smartsanchar.com")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(compression());

import mongoose from "mongoose";

// Fast connection check: only attempt reconnect if socket dropped
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }
  connectDB()
    .then(() => next())
    .catch((error) => {
      console.error("[Database] Reconnect failed on request:", error.message);
      next();
    });
});


app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000, // Increased threshold to support dynamic news portal requests
  }),
);


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SmartSanchar Express Backend Services API",
  });
});

// Health check endpoint (available at /health and /api/health)
app.use("/health", healthRouter);
app.use("/api/health", healthRouter);

import path from "path";
import fs from "fs";
import { webpNegotiation } from "./middlewares/webp.middleware.js";

// Optional local uploads static serving with WebP auto-negotiation
const uploadsDir = path.join(process.cwd(), "uploads");
if (fs.existsSync(uploadsDir)) {
  app.use("/uploads", webpNegotiation(uploadsDir), express.static(uploadsDir, { maxAge: "30d" }));
  app.use("/api/uploads", webpNegotiation(uploadsDir), express.static(uploadsDir, { maxAge: "30d" }));
}

// API Routes
app.use("/api/articles", articlesRouter);
app.use("/api/ads", adsRouter);
app.use("/api/partners", partnersRouter);
app.use("/api/admin", adminRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/youtube", youtubeRouter);

// Always LAST
app.use(errorHandler);

export default app;
