// api/users.js
import { Router } from "express";
import { createUser, authenticateUser } from "#db/queries/users";
import { createToken } from "#utils/jwt";
import requireBody from "#middleware/requireBody";

const router = Router();

// Signup route
router.post(
  "/signup",
  requireBody(["username", "password"]), //replaces manual checks
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await createUser(username, password);

      const token = createToken({ id: user.id });
      res.status(201).json({ user, token });
    } catch (err) {
      next(err); // let middleware handle errors
    }
  }
);

// Login route
router.post(
  "/login",
  requireBody(["username", "password"]), //replaces manual checks too
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await authenticateUser(username, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const token = createToken({ id: user.id });
      res.json({ user, token });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
