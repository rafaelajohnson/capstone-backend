import { Router } from "express";
import { createUser, authenticateUser } from "#db/queries/users";
import jwt from "jsonwebtoken";
import { getUserById } from "#db/queries/users";

const router = Router();

// signup
router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "username and password required" });

    const user = await createUser(username, password);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "7d",
    });

    res.json({ user, token });
  } catch (err) {
    next(err);
  }
});

// login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await authenticateUser(username, password);

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "7d",
    });

    res.json({ user, token });
  } catch (err) {
    next(err);
  }
});

// get logged-in user
router.get("/me", async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await getUserById(payload.id);

    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
