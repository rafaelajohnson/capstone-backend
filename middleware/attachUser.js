// middleware/attachUser.js
import jwt from "jsonwebtoken";

export function attachUser(req, res, next) {
  const auth = req.headers.authorization;

  if (auth && auth.startsWith("Bearer ")) {
    const token = auth.slice(7); // remove "Bearer "
    try {
      // Decode and verify token using your secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // attach user info to request
    } catch (err) {
      console.error("JWT verification failed:", err.message);
    }
  }

  next();
}
