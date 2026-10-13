import mongoose from "mongoose";

let cachedConnection = null;

// High-Performance Serverless Connection Pool Tuning (Vercel & Production)
const MONGOOSE_OPTIONS = {
  maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE, 10) || 5, // Serverless connection conservation
  minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE, 10) || 1, // Keep 1 warm socket
  maxIdleTimeMS: parseInt(process.env.DB_MAX_IDLE_TIME_MS, 10) || 30000, // Drop idle sockets after 30s
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  autoIndex: process.env.NODE_ENV !== "production", // Disable auto-indexing in production to save RAM
};

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    cachedConnection = mongoose.connect(process.env.MONGODB_URI, MONGOOSE_OPTIONS);
    const conn = await cachedConnection;
    console.log(`[MongoDB] Connected: ${conn.connection.host} (Pool max: ${MONGOOSE_OPTIONS.maxPoolSize})`);
    return conn;
  } catch (error) {
    cachedConnection = null;
    console.error(`[MongoDB] Connection error: ${error.message}`);
    if (!process.env.VERCEL) {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

/**
 * Cleanly close connection pool on process termination to prevent zombie connections in CloudLinux
 */
export const closeDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close(false);
      cachedConnection = null;
      console.log("[MongoDB] Connection pool cleanly closed.");
    }
  } catch (err) {
    console.error("[MongoDB] Error closing connection:", err.message);
  }
};

export default connectDB;
