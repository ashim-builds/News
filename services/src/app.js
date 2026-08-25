import "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import compression from "compression";

import { errorHandler } from "./middlewares/error.middleware.js";
import { securityMiddleware } from "./middlewares/security.middleware.js";

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

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(compression());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
  }),
);

securityMiddleware(app);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SmartSanchar Express Backend Services API",
  });
});

// Health check endpoint (available at /health and /api/health)
app.use("/health", healthRouter);
app.use("/api/health", healthRouter);

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
