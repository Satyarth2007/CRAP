// models/PendingHoDRegistration.js
// Holds an HoD's registration details between "submitted the form" and
// "verified their email via OTP". Nothing here becomes a real User/HoD
// document until verifyHoDOtp succeeds. The otpExpiresAt TTL index makes
// MongoDB auto-delete abandoned/expired attempts with no manual cron.

import mongoose from "mongoose";
import tenantScope from "../plugins/tenantScope.js";

const { Schema } = mongoose;

const pendingHoDRegistrationSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },

    email: { type: String, required: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    designation: { type: String, trim: true },
    departmentCode: { type: String, required: true, trim: true, uppercase: true },

    otpHash: { type: String, required: true },
    otpExpiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// One pending registration per (workspace, email) — resubmitting the form
// upserts this document (fresh OTP, reset attempts) rather than erroring
// on a duplicate.
pendingHoDRegistrationSchema.index({ workspaceId: 1, email: 1 }, { unique: true });

// TTL: MongoDB deletes the document once otpExpiresAt is reached.
pendingHoDRegistrationSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0 });

pendingHoDRegistrationSchema.plugin(tenantScope);

export default mongoose.model("PendingHoDRegistration", pendingHoDRegistrationSchema);