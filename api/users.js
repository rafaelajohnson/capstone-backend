import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "#utils/jwt";
import { createUser, getUserByUsernameAndPassword } from "#db/queries/users";

const router = Router();

// signup route
router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }

    // hash password before storing
    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser(username, hashed);

    // make a token
    const token = jwt.sign({ id: user.id });
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
});

// login route
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsernameAndPassword(username, password);

    if (!user) {
      return res.status(401).json({ error: "invalid login" });
    }

    // make a token
    const token = jwt.sign({ id: user.id });
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
});

export default router;
