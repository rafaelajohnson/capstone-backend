// middleware/attachUser.js
// This middleware checks for a JWT in the Authorization header
// If the token is valid, it decodes it and attaches the user info to req.user
// Otherwise, it just moves on (req.user will remain undefined)

import jwt from "jsonwebtoken";

export function attachUser(req, res, next) {
  // Grab the Authorization header (should look like "Bearer <token>")
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7); // remove the "Bearer " part
    try {
      // Verify the token with the secret key (must match the one used in login/register)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the decoded payload (usually { id, iat, exp }) to req.user
      req.user = decoded;
    } catch (err) {
      // If token is invalid or expired, log the reason (but don't crash)
      console.error("❌ JWT verification failed:", err.message);
    }
  }

  // Always move on to the next middleware or route
  next();
}
