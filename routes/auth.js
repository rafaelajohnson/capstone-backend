// routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import { createUser, authenticateUser } from "#db/queries/users.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// --- Signup ---
router.post("/auth/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }

    const user = await createUser(username, password);
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ user, token });
  } catch (err) {
    if (err.code === "23505") {
      // duplicate username
      return res.status(400).json({ error: "username already exists" });
    }
    next(err); // will be caught by global error handler
  }
});

// --- Login ---
router.post("/auth/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }

    const user = await authenticateUser(username, password);
    if (!user) {
      return res.status(401).json({ error: "invalid username or password" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ user, token });
  } catch (err) {
    next(err);
  }
});

export default router;
