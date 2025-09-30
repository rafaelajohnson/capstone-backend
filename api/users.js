// api/users.js
import { Router } from "express";
import { createUser, authenticateUser } from "#db/queries/users";
import { createToken } from "#utils/jwt.js";

const router = Router();

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const user = await createUser(username, password);

    // make a token for the new user
    const token = createToken({ id: user.id });

    // return safe user + token
    res.status(201).json({ user, token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const user = await authenticateUser(username, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // make a token for the logged-in user
    const token = createToken({ id: user.id });

    // return safe user + token
    res.json({ user, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
