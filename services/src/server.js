import "dotenv/config";
import app from "./app.js";
import connectDB, { closeDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB with tuned low-resource pool
connectDB().catch((err) => {
  console.error("[Startup] MongoDB initial connection failed:", err.message);
});

let server = null;

if (!process.env.VERCEL) {
  server = app.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT} (PID: ${process.pid})`);
  });
}

// Graceful shutdown handler to eliminate zombie processes & socket leaks on CloudLinux LVE
const gracefulShutdown = async (signal) => {
  console.log(`[Shutdown] Received ${signal}. Starting graceful termination...`);

  if (server) {
    server.close(() => {
      console.log("[Shutdown] HTTP server closed for new incoming connections.");
    });
  }

  try {
    await closeDB();
    console.log("[Shutdown] Graceful cleanup completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("[Shutdown] Error during cleanup:", err);
    process.exit(1);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGUSR2", () => gracefulShutdown("SIGUSR2")); // Passenger / nodemon reload

export default app;
