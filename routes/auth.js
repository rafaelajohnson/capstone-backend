// routes/auth.js
import { Router } from "express";
import { createUser, getUserByUsername } from "../db/queries/users.js";
import { signToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";

const router = Router();

/** POST /auth/signup - create user + return token */
router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser(username, hashed);

    const token = signToken({ id: user.id });
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
});

/** POST /auth/login - verify user + return token */
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken({ id: user.id });
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
});

export default router;
