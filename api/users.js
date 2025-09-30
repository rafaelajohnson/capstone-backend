import { Router } from "express";
import { createUser, authenticateUser } from "#db/queries/users";
import { createToken } from "#utils/jwt";
import requireBody from "#middleware/requireBody"; //import middleware

const router = Router();

// Signup route
router.post(
  "/signup",
  requireBody(["username", "password"]), // this replaces manual check
  async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await createUser(username, password);

      const token = createToken({ id: user.id });
      res.status(201).json({ user, token });
    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({ error: "Failed to create user" });
    }
  }
);

// Login route
router.post(
  "/login",
  requireBody(["username", "password"]), // this replaces manual check too
  async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await authenticateUser(username, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const token = createToken({ id: user.id });
      res.json({ user, token });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Login failed" });
    }
  }
);

export default router;
