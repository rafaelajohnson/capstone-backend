// middleware/attachUser.js
// This middleware checks for a JWT in the Authorization header
// If the token is valid, it decodes it and attaches the user info to req.user
// Otherwise, it just moves on (req.user will remain undefined)

// middleware/attachUser.js
import jwt from "jsonwebtoken";
import { getUserById } from "#db/queries/users";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function attachUser(req, res, next) {
  const auth = req.headers.authorization;
  console.log("🔑 Incoming auth header:", auth);

  if (auth && auth.startsWith("Bearer ")) {
    const token = auth.split(" ")[1];
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      console.log("✅ Decoded payload:", payload);

      const user = await getUserById(payload.id);
      console.log("👤 User from DB:", user);

      if (user) {
        req.user = user;
      } else {
        console.warn("⚠️ No user found for id:", payload.id);
      }
    } catch (err) {
      console.error("❌ Token verification failed:", err.message);
    }
  } else {
    console.warn("⚠️ No Authorization header or wrong format");
  }

  next();
}
