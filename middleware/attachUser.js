import jwt from "jsonwebtoken";

/**
 * attachUser
 * Looks for Authorization: Bearer <token>
 * If valid, attaches the decoded user to req.user
 * If invalid or missing, req.user just stays undefined
 */
export function attachUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return next(); // no token provided
  }

  // Expect header format: "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return next();
  }

  try {
    // Verify JWT using your secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user payload to request
    req.user = decoded;
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);
    // Don’t throw — just leave req.user undefined
  }

  next();
}
