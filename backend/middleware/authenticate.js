// middleware/authenticate.js
// Verifies the bearer token only. Does NOT touch the DB — that's
// resolveTenant's job, run as a separate middleware right after this one.
// Splitting these two lets routes that need "is this a valid token" but
// not full user/role context (rare) skip the DB hit.

import { verifyToken } from "../utils/jwt.js";

export default function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Missing or malformed Authorization header." });
  }

  try {
    const payload = verifyToken(token); // { userId, iat, exp }
    req.auth = { userId: payload.userId };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}