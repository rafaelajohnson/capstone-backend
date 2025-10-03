
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import storiesRoutes from "./routes/stories.js";
import { attachUser } from "./middleware/attachUser.js"; // 👈 import

const app = express();

app.use(cors());
app.use(express.json());

// Attach req.user if token is valid
app.use(attachUser);

// Routes
app.use("/auth", authRoutes);
app.use("/stories", storiesRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
