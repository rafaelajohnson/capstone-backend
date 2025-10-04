import express from "express";
import jwt from "jsonwebtoken";
import { createUser, authenticateUser } from "#db/queries/users.js";

const router = express.Router();

// signup
router.post("/auth/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }

    const user = await createUser(username, password);

    // sign JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "7d" }
    );

    res.json({ user, token }); // ✅ sends response
  } catch (err) {
    next(err); // ✅ passes to error handler
  }
});

// login
router.post("/auth/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await authenticateUser(username, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "7d" }
    );

    res.json({ user, token });
  } catch (err) {
    next(err);
  }
});

export default router;