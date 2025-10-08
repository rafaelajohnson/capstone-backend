// --- Load environment ---
import "dotenv/config";
import tracer from "dd-trace";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import winston from "winston";
import DatadogWinston from "datadog-winston";

// --- Detect environment ---
const isRender = !!process.env.RENDER; // Render sets this automatically
const hasLocalAgent = !!process.env.DD_AGENT_HOST;

// --- Datadog ENV Info ---
console.log("🐾 Datadog ENV CHECK");
console.log("  DD_SERVICE:", process.env.DD_SERVICE);
console.log("  DD_ENV:", process.env.DD_ENV);
console.log("  DD_SITE:", process.env.DD_SITE);
console.log("  DD_AGENT_HOST:", process.env.DD_AGENT_HOST);
console.log("  DD_API_KEY exists:", !!process.env.DD_API_KEY);
console.log("  DATABASE_URL exists:", !!process.env.DATABASE_URL);

// --- Initialize Datadog tracer (APM) ---
if (hasLocalAgent) {
  console.log("💻 Using local Datadog Agent → http://localhost:8126");
  tracer.init({
    env: process.env.DD_ENV || "dev",
    service: process.env.DD_SERVICE || "storybook-builder-api",
    hostname: process.env.DD_AGENT_HOST || "localhost",
    port: 8126,
    logInjection: true,
    runtimeMetrics: true,
  });
} else {
  console.log("🌐 Running in Render/Agentless mode (logs only, no APM traces)");
}

// Enable specific integrations
tracer.use("express");
tracer.use("pg");

// --- Imports (AFTER tracer init) ---
import authRouter from "./routes/auth.js";
import storiesRouter from "./routes/stories.js";
import pagesRouter from "./routes/pages.js";
import optionsRouter from "./routes/options.js";

// --- Express setup ---
const app = express();

// --- Datadog Logger ---
const logger = winston.createLogger({
  transports: [
    new DatadogWinston({
      apiKey: process.env.DD_API_KEY,
      hostname: process.env.DD_AGENT_HOST || "render",
      service: process.env.DD_SERVICE || "storybook-builder-api",
      ddsource: "nodejs",
      ddtags: `env:${process.env.DD_ENV || "production"},project:storybook-builder`,
    }),
  ],
});

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// --- Routes ---
app.use("/auth", authRouter);
app.use("/stories", storiesRouter);
app.use("/pages", pagesRouter);
app.use("/options", optionsRouter);

// --- Health Check ---
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Capstone backend running" });
});

// --- Error Handler ---
app.use((err, req, res, next) => {
  logger.error("❌ Server error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(
    `📡 Datadog trace mode: ${
      hasLocalAgent ? "Local Agent (Full APM)" : "Agentless (Render logs only)"
    }`
  );
  logger.info(`Server started on port ${PORT}`);
});
