// utils/jwt.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in the environment.");
}

// Payload is intentionally minimal — { userId } only. No role or
// permissions are baked into the token, so revoking access (deactivating
// a user, changing a role, rejecting an HoD) takes effect on the very
// next request rather than waiting for token expiry. Everything else is
// re-resolved from the DB on every request by resolveTenant.
export function signToken(userId) {
  return jwt.sign({ userId: userId.toString() }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET); // throws on invalid/expired
}