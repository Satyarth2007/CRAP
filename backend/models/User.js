// models/User.js
// Base identity shared across all roles. Auth (email/password/JWT) lives
// here; role-specific data lives in the profile document referenced by
// profileRef + profileModel.
//
// JWTs issued at login carry only { userId } — no role or permissions —
// so role/workspace are always re-resolved from the DB on every request
// via resolveTenant middleware. This enables immediate revocation.

import mongoose from "mongoose";

const { Schema } = mongoose;

const ROLES = ["TPO", "HoD", "Student", "HR"];
// Note: SuperAdmin removed — single-college scope, TPO is the top-level
// in-app authority; no platform-level admin role remains.

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: { type: String, required: true },

    role: { type: String, enum: ROLES, required: true },

    // Polymorphic reference to the role-specific profile document
    // (TPO / HoD / Student / HR).
    profileRef: { type: Schema.Types.ObjectId, required: true, refPath: "profileModel" },
    profileModel: { type: String, required: true, enum: ROLES },

    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);