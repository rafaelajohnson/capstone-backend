// routes/auth.js
import express from "express";
import { createUser, authenticateUser } from "../db/queries/users.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// signup
router.post("/signup", async (req, res, next) => {
  console.log("📥 Received signup request:", req.body); // added this line for testing
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }
    const user = await createUser(username, password);
    console.log("✅ Created user:", user); // added this line for testing
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ user, token });
  } catch (err) {
    console.error("❌ Signup error:", err);
    next(err);
  }
});


// login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await authenticateUser(username, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
});

export default router;
