// middleware/resolveTenant.js
// Runs AFTER authenticate (needs req.auth.userId already set).
// Performs a fresh DB lookup on every request — per the locked
// architecture decision — rather than trusting anything baked into the
// JWT, so a deactivated user, a rejected HoD, or a role change takes
// effect immediately rather than waiting for the token to expire.

import mongoose from "mongoose";
import User from "../models/User.js";

const PROFILE_MODELS = new Set(["TPO", "HoD", "Student", "HR"]);

export default async function resolveTenant(req, res, next) {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Account not found or inactive." });
    }

    if (!PROFILE_MODELS.has(user.profileModel)) {
      return res.status(500).json({ message: "Unrecognized profile type on user record." });
    }

    const ProfileModel = mongoose.model(user.profileModel);
    const profile = await ProfileModel.findById(user.profileRef);
    if (!profile) {
      return res.status(401).json({ message: "Profile record not found." });
    }

    // Role-specific "is this account allowed to act" gate, centralised
    // here so every route downstream can assume req.profile is a usable,
    // approved/active account rather than re-checking status everywhere.
    if (user.role === "HoD" && profile.status !== "approved") {
      return res.status(403).json({
        message:
          profile.status === "pending"
            ? "Your HoD registration is awaiting TPO approval."
            : "Your HoD registration was rejected.",
      });
    }

    if ((user.role === "TPO" || user.role === "HR") && profile.status !== "active") {
      return res.status(403).json({ message: "Account is not yet active." });
    }

    req.user = user; // the User (auth) document
    req.profile = profile; // the role-specific profile document
    req.role = user.role;

    // TPO / HoD / Student carry workspaceId directly on their profile.
    // HR does not (scoped by companyId instead — see plugins/tenantScope.js,
    // which is deliberately not applied to the HR schema), so this is
    // null for HR requests. Routes that need HR's workspace should derive
    // it via Company instead.
    req.workspaceId = profile.workspaceId ?? null;

    next();
  } catch (err) {
    next(err);
  }
}