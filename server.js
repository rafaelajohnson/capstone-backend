// Initialize Datadog APM tracing before anything else
import tracer from "dd-trace";
tracer.init({
  logInjection: true,
  runtimeMetrics: true,
});
const tracer = require('dd-trace').init({
  profiling: true,
  env: 'sandbox',
  service: 'node-app',
  version: 'v5.3',
  logInjection: true,
  runtimeMetrics: true,
});

tracer.use('express', {
hooks: {
  request: (span, req, res) => {
    span.setTag('custom.tag', 'example1')
  }
},
validateStatus: function (code) {
  if (code < 300) {
    return true
  }
}
});
// server.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
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
