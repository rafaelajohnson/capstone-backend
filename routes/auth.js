// routes/auth.js
import { Router } from "express";
import jwt from "jsonwebtoken";
import { createUser, authenticateUser } from "../db/queries/users.js";
import { getUserById } from "../db/queries/users.js";

const router = Router();

// POST /auth/signup → create a new user + return token
router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }

    // save new user in db
    const user = await createUser(username, password);

    // sign a JWT with their id
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // 7 days feels reasonable for demo
    );

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
});

// POST /auth/login → authenticate existing user
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }

    // check credentials (this handles fetching + bcrypt compare)
    const user = await authenticateUser(username, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // issue a token just like signup
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ user, token });
  } catch (err) {
    next(err);
  }
});

// GET /auth/me → return current logged-in user (based on token)
router.get("/me", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await getUserById(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;