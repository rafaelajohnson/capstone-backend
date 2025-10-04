// server.js
import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRouter from "./routes/auth.js";
import storiesRouter from "./routes/stories.js";
import pagesRouter from "./routes/pages.js";
import optionsRouter from "./routes/options.js";

const app = express();

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
  console.error("❌ Server error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
