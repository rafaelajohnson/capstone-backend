// middleware/attachUser.js
// This middleware checks for a JWT in the Authorization header
// If the token is valid, it decodes it and attaches the user info to req.user
// Otherwise, it just moves on (req.user will remain undefined)

import jwt from "jsonwebtoken";
import { getUserById } from "#db/queries/users.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function attachUser(req, res, next) {
  const authHeader = req.headers.authorization;

  console.log("🔑 Incoming Authorization header:", authHeader);

  if (!authHeader) return next();

  const token = authHeader.replace("Bearer ", "").trim();
  console.log("🪙 Extracted token:", token);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log("📦 JWT payload:", payload);

    const user = await getUserById(payload.id);
    console.log("👤 Attached user:", user);

    if (user) req.user = user;
  } catch (err) {
    console.warn("⚠️ Invalid token:", err.message);
  }

  next();
}