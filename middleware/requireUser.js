// middleware/requireUser.js
import jwt from "jsonwebtoken";
import { getUserById } from "../db/queries/users.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

/** Middleware to require a valid logged-in user */
export default async function requireUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "User not found or invalid token" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("requireUser error:", err.message);
    res.status(401).json({ error: "Unauthorized" });
  }
}
