// middleware/requireRole.js
// Use after authenticate + resolveTenant, e.g.:
//   router.post("/drives", authenticate, resolveTenant, requireRole("TPO"), createDrive);

export default function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.role || !allowedRoles.includes(req.role)) {
      return res.status(403).json({ message: "You do not have access to this resource." });
    }
    next();
  };
}
