// routes/auth.js
import { Router } from "express";
import jwt from "jsonwebtoken";
import { createUser, authenticateUser } from "#db/queries/users";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // fallback for dev

// POST /auth/signup
router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }

    const user = await createUser(username, password);

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ user, token });
  } catch (err) {
    next(err);
  }
});

// POST /auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }

    const user = await authenticateUser(username, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ user, token });
  } catch (err) {
    next(err);
  }
});

export default router;
