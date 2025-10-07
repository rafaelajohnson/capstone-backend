// Initialize Datadog APM tracing before anything else
// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import tracer from 'dd-trace';

// Only init tracer if we’re not already instrumented
if (!tracer._tracer) {
  tracer.init({
    env: process.env.DD_ENV || 'production',
    service: process.env.DD_SERVICE || 'storybook-builder-api',
    hostname: process.env.DD_AGENT_HOST,
  });
  tracer.use('express', { service: process.env.DD_SERVICE });
  tracer.use('pg');
  tracer.use('http');
  tracer.use('fs');
  tracer.use('dns');
  tracer.use('net');
}


// server.js
import winston from "winston";
import DatadogWinston from "datadog-winston";

import authRouter from "./routes/auth.js";
import storiesRouter from "./routes/stories.js";
import pagesRouter from "./routes/pages.js";
import optionsRouter from "./routes/options.js";

const app = express();

// Datadog logger setup
const logger = winston.createLogger({
  transports: [
    new DatadogWinston({
      apiKey: process.env.DD_API_KEY,
      hostname: "render",
      service: "storybook-builder-api",
      ddsource: "nodejs",
      ddtags: "env:production,project:storybook-builder",
    }),
  ],
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes with proper prefixes
app.use("/auth", authRouter);       // signup, login
app.use("/stories", storiesRouter); // CRUD stories
app.use("/pages", pagesRouter);     // CRUD pages
app.use("/options", optionsRouter); // CRUD options

// Root health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Capstone backend is running" });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error("❌ Server error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 Server listening on http://localhost:${PORT}`);
});
