import express from "express";
import mongoose from "mongoose";

const router = express.Router();

const DB_STATES = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

/**
 * @route   GET /health or /api/health
 * @desc    Health check endpoint for server and database status
 * @access  Public
 */
router.get("/", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = DB_STATES[dbState] || "unknown";
  const isHealthy = dbState === 1;

  const healthData = {
    success: isHealthy,
    status: isHealthy ? "OK" : "DEGRADED",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: {
        status: dbStatus,
        connected: isHealthy,
      },
    },
    environment: process.env.NODE_ENV || "development",
  };

  const statusCode = isHealthy ? 200 : 503;
  res.status(statusCode).json(healthData);
});

export default router;
