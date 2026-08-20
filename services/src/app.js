import "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import compression from "compression";

import { errorHandler } from "./middlewares/error.middleware.js";
import { securityMiddleware } from "./middlewares/security.middleware.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(compression());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);

securityMiddleware(app);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running (Clean Slate)",
  });
});

// Always LAST
app.use(errorHandler);

export default app;
